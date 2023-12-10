import { sendWelcomeEmail } from "@/server/jobs/auth/sendWelcomeEmail";
import { upsertUser } from "@/server/jobs/auth/upsertUser";
import { verifyRequest } from "@/server/jobs/auth/verifyIdToken";
import { serverFirebaseAuth } from "@/server/lib/serverFirebaseAuth";
import { publicProcedure } from "@/server/lib/trpc";
import { NextApiResponse } from "next";
import { z } from "zod";

export default publicProcedure
  .input(
    z.object({
      idToken: z.string(),
      csrfToken: z.string().nullish(),
    }),
  )
  .mutation(async ({ input, ctx }) => {
    const decodedIdToken = await serverFirebaseAuth().verifyIdToken(input.idToken);
    await verifyRequest(decodedIdToken.auth_time, input.csrfToken, ctx.req?.cookies.csrfToken);

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
