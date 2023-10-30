import { publicProcedure } from "@/server/lib/trpc";
import { z } from "zod";
import { serverFirebaseAuth } from "@/server/lib/serverFirebaseAuth";
import { PrismaClient } from "@prisma/client";
import { DecodedIdToken } from "firebase-admin/auth";
import { generateUniqueUsername } from "@/server/lib/usernameUtils";
import { TRPCError } from "@trpc/server";
import { NextApiResponse } from "next";

// Handles signIn from frontend's CapacitorGoogleAuth plugin in accordance with NextAuth.
// Creates an user or updates their data.
// TODO: Abstract this out for other OAuth providers? (Apple...)
export default publicProcedure
  .input(
    z.object({
      idToken: z.string(),
      csrfToken: z.string().nullish(),
    }),
  )
  .mutation(async ({ input, ctx }) => {
    // Get the user data.
    const decodedIdToken = await serverFirebaseAuth().verifyIdToken(
      input.idToken,
    );

    await verifyRequest(
      decodedIdToken.auth_time,
      input.csrfToken,
      ctx.req?.cookies["csrfToken"]!,
    );

    await upsertUser(ctx.prisma, decodedIdToken);

    //const cookie = await createSessionCookie(input.idToken, ctx.res!);

    console.log("Successfully signed in with Firebase.");
    return {
      //session: cookie,
    };
  });

/**
 * Creates a user if they don't exist.
 * @param prisma
 * @param decodedIdToken
 */
async function upsertUser(
  prisma: PrismaClient,
  decodedIdToken: DecodedIdToken,
) {
  // Check if user already exists.
  const exists = await prisma.user.findUnique({
    where: {
      id: decodedIdToken.uid,
    },
  });

  const username = exists
    ? null
    : await generateUniqueUsername(decodedIdToken.name, decodedIdToken.email!);

  if (!exists) {
    await prisma.user.create({
      data: {
        id: decodedIdToken.uid,
        email: decodedIdToken.email,
        name: decodedIdToken.name,
        username: username!,
        image: decodedIdToken.picture,
      },
    });
  }
}

/**
 * Verifies the request by checking the authentication time and CSRF tokens.
 *
 * @param {number} authTime - The authentication time in seconds.
 * @param {string} [inputCsrf] - The input CSRF token.
 * @param {string} [cookieCsrf] - The cookie CSRF token.
 * @throws {TRPCError} When the authentication time is not recent or the CSRF tokens do not match.
 */
async function verifyRequest(
  authTime: number,
  inputCsrf?: string | null,
  cookieCsrf?: string | null,
) {
  // Check if the user signed in recently.
  if (authTime < new Date().getTime() / 1000 - 5 * 60) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "Sign in must be recent.",
    });
  }

  if (inputCsrf !== cookieCsrf) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "CSRF token mismatch.",
    });
  }
}

/**
 * Creates a session cookie and sets it in the response. Returns the cookie.
 * @param idToken
 * @param res
 */
async function createSessionCookie(
  idToken: string,
  res: NextApiResponse,
): Promise<string> {
  const cookie = await serverFirebaseAuth().createSessionCookie(idToken, {
    // 2 weeks.
    expiresIn: 60 * 60 * 24 * 14 * 1000,
  });

  res.setHeader(
    "Set-Cookie",
    `session=${cookie}; Path=/; HttpOnly; Secure; SameSite=Strict`,
  );

  return cookie;
}
