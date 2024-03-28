import { rateLimiter } from "@/server/clients/rateLimiter";
import { retrieveIp } from "@/server/helpers/helpers";
import { sendWelcomeEmail } from "@/server/jobs/auth/sendWelcomeEmail";
import { upsertUser } from "@/server/jobs/auth/upsertUser";
import { verifyRequest } from "@/server/jobs/auth/verifyIdToken";
import { TRPCError } from "@/server/lib/TRPCError";
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

    let decodedIdToken;
    let firebaseAuth;

    try {
      firebaseAuth = serverFirebaseAuth();
    } catch (e) {
      console.error("Error getting firebase auth: ", e);

      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        cause: e,
        message: "Error initializing firebase auth.",
        toast: "Error initializing firebase auth.",
      });
    }

    try {
      decodedIdToken = await firebaseAuth.verifyIdToken(input.idToken);
    } catch (e) {
      console.error(e);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        cause: e,
        message: "Invalid ID token or error verifying firebase ID token.",
        toast: "Invalid ID token or error verifying firebase ID token.",
      });
    }
    try {
      await verifyRequest(
        decodedIdToken.auth_time,
        input.csrfToken,
        ctx.req?.cookies.csrfToken,
      );
    } catch (e) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Invalid CSRF token.",
        toast: "Invalid CSRF token.",
      });
    }

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
