import { rateLimiter } from "@/server/clients/rateLimiter";
import { retrieveIp } from "@/server/helpers/helpers";
import { sendWelcomeEmail } from "@/server/jobs/auth/sendWelcomeEmail";
import { upsertUser } from "@/server/jobs/auth/upsertUser";
import { verifyRequest } from "@/server/jobs/auth/verifyIdToken";
import { serverFirebaseAuth } from "@/server/lib/serverFirebaseAuth";
import { publicProcedure } from "@/server/lib/trpc";
import { NextApiResponse } from "next";
import parse from "parse-duration";
import { z } from "zod";

export default publicProcedure
  .input(
    z.object({
      idToken: z.string(),
      csrfToken: z.string().nullish(),
    }),
  )
  .mutation(async ({ input, ctx }) => {
    rateLimiter.ensureWithinLimitOrThrow({
      id: "sign-in",
      ip: retrieveIp(ctx.req),
      ipLimits: [
        { maxHits: 30, ms: parse("1h")! },
        { maxHits: 50, ms: parse("1d")! },
      ],
    });

    const decodedIdToken = await serverFirebaseAuth().verifyIdToken(input.idToken);
    console.log("HEY, SUCCESFULLY DECODED ID TOKEN");
    await verifyRequest(decodedIdToken.auth_time, input.csrfToken, ctx.req?.cookies.csrfToken);
    console.log("HEY, SUCCESFULLY VERIFIED REQUEST");

    // Uncomment to get early access.
    /*const hasEarlyAccess = await ctx.prisma.earlyAccess.findUnique({
      where: {
        email: decodedIdToken.email,
        granted: true,
      },
    });

    if (!hasEarlyAccess && process.env.NODE_ENV !== "development") {
      const isAdmin = await ctx.prisma.adminEmail.findUnique({
        where: {
          email: decodedIdToken.email,
        },
      });
      if (!isAdmin) {
        throw new TRPCError({
          // Do not specify "UNAUTHORIZED" here.
          code: "BAD_REQUEST",
          message: "You don't have early access.",
          toast: t`You don't have early access.`,
        });
      }
    }*/

    const { alreadyExisted } = await upsertUser(ctx.prisma, decodedIdToken);
    console.log("HEY, SUCCESFULLY UPSERTED USER");

    if (!alreadyExisted && decodedIdToken.email) {
      // TODO(1): Send it asynchronously!.
      await sendWelcomeEmail(decodedIdToken);
    }

    return {
      //session: cookie,
    };
  });

/**
 * Creates a session cookie and sets it in the response. Returns the cookie.
 * @param idToken
 * @param res
 */
async function createSessionCookie(idToken: string, res: NextApiResponse): Promise<string> {
  const cookie = await serverFirebaseAuth().createSessionCookie(idToken, {
    // 2 weeks.
    expiresIn: 60 * 60 * 24 * 14 * 1000,
  });

  res.setHeader("Set-Cookie", `session=${cookie}; Path=/; HttpOnly; Secure; SameSite=Strict`);

  return cookie;
}
