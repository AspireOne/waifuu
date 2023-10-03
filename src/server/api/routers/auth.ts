import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { z } from "zod";
import { GoogleAuth, OAuth2Client, TokenPayload } from "google-auth-library";
import { env } from "~/server/env";
import { TRPCError } from "@trpc/server";
import generateUUID from "~/utils/utils";
import { PrismaClient } from "@prisma/client";
import { NextApiResponse } from "next";

export const authRouter = createTRPCRouter({
  // Handles signIn from frontend's CapacitorGoogleAuth plugin in accordance with NextAuth.
  completeNativeGoogleSignIn: publicProcedure
    .input(
      z.object({
        idToken: z.string(),
        accessToken: z.string(),
        refreshToken: z.string().nullish(),
        serverAuthCode: z.string().nullish(),
        clientId: z.string(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const payload = await verifyUser(input.idToken, input.clientId);
      console.log("Verified Google ID Token. User payload: ", payload);

      // !TODO: When creating user, create username (atm it is in NextAuth hook!).
      // or move it to nextauth get session or some method that gets called on every request.

      console.log("Creating user...");
      const user = await createUser(ctx.prisma, payload);

      console.log("Creating account...");
      const account = await createAccount(ctx.prisma, payload, user.id, input);

      // Create a new session
      console.log("Creating session...");
      const session = await createSession(ctx.prisma, user.id);

      if (!ctx.res) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "No response object in context. This should not happen.",
        });
      }

      console.log("Saving session to cookies...");
      await saveSessionToCookies(ctx.res, session);

      console.log("All good, returning session token...");
      return { sessionToken: session.sessionToken };
    }),
});

async function saveSessionToCookies(
  res: NextApiResponse,
  session: {
    sessionToken: string;
    expires: Date;
  },
) {
  res.setHeader(
    "Set-Cookie",
    `next-auth.session-token=${
      session.sessionToken
    }; path=/; expires=${session.expires.toUTCString()}; httponly; samesite=lax`,
  );
}

async function createSession(prisma: PrismaClient, userId: string) {
  return await prisma.session.create({
    data: {
      userId: userId,
      sessionToken: generateUUID(),
      expires: new Date(Date.now() + 1000 * 60 * 60 * 24), // expires in 24 hours
    },
  });
}

async function createAccount(
  prisma: PrismaClient,
  payload: TokenPayload,
  userId: string,
  input: {
    accessToken: string;
    refreshToken?: string | null;
    idToken: string;
  },
) {
  // The user might exist while the google account not.
  let account = await prisma.account.findFirst({
    where: {
      userId: userId,
      provider: "google",
      type: "oauth",
      providerAccountId: payload.sub,
    },
  });

  if (!account) {
    account = await prisma.account.create({
      data: {
        userId: userId,
        type: "oauth",
        provider: "google",
        providerAccountId: payload.sub,
        access_token: input.accessToken,
        refresh_token: input.refreshToken,
        id_token: input.idToken,
        token_type: "Bearer",
        scope:
          "openid https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile",
      },
    });
  }

  return account;
}

async function createUser(prisma: PrismaClient, payload: TokenPayload) {
  // Create user if not exists. The user can already be created with another provider.
  return await prisma.user.upsert({
    where: { email: payload.email },
    update: {},
    create: {
      name: payload.name,
      email: payload.email,
      image: payload.picture,
    },
  });
}

/**
 * @throws TRPCError
 * @param idToken
 * @param clientId The client ID of the frontend.
 */
async function verifyUser(
  idToken: string,
  clientId: string,
): Promise<TokenPayload> {
  const client = new OAuth2Client(env.NEXT_PUBLIC_GOOGLE_CLIENT_ID);

  const ticket = await client.verifyIdToken({
    idToken: idToken,
    audience: clientId,
  });

  const payload = ticket.getPayload();
  if (!payload?.sub) {
    console.error("No sub in payload. Seems like the token is invalid.");
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "Invalid Google token",
    });
  }

  return payload;
}
