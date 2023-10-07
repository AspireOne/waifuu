import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { z } from "zod";
import { NextApiResponse } from "next";
import admin from "firebase-admin";
import { generateUniqueUsername } from "~/server/lib/usernameUtils";
import initializeFirebaseApp from "~/server/lib/firebaseApp";

export const authRouter = createTRPCRouter({
  // Handles signIn from frontend's CapacitorGoogleAuth plugin in accordance with NextAuth.
  // Creates an user or updates their data.
  // TODO: Abstract this out for other OAuth providers? (Apple...)
  handleFirebaseSignIn: publicProcedure
    .input(
      z.object({
        idToken: z.string(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const app = initializeFirebaseApp();

      console.log("Getting user data...");
      // Get the user data.
      const decodedIdToken = await admin
        .auth(app!)
        .verifyIdToken(input.idToken);

      console.log("Checking if user exists...");
      // Check if user already exists.
      const exists = await ctx.prisma.user.findUnique({
        where: {
          id: decodedIdToken.uid,
        },
      });

      console.log("Generating username (if any)...");
      const username = exists
        ? await generateUniqueUsername(
            decodedIdToken.name,
            decodedIdToken.email!,
          )
        : null;

      console.log("Upserting user...");
      // Create or update the user.
      ctx.prisma.user.upsert({
        where: {
          // Note: When using other providers, uid might not be present.
          id: decodedIdToken.uid,
        },
        create: {
          id: decodedIdToken.uid,
          email: decodedIdToken.email,
          name: decodedIdToken.name,
          username: username!,
          image: decodedIdToken.picture,
        },
        // Update all updatable fields.
        update: {
          name: decodedIdToken.name,
          email: decodedIdToken.email ?? undefined,
        },
      });

      console.log("Successfully signed in! Returning...");
      return undefined;
    }),
});
