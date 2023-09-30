import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { z } from "zod";

export const authRouter = createTRPCRouter({
  // Handles signIn from frontend's CapacitorGoogleAuth plugin in accordance with NextAuth.
  completeNativeGoogleSignIn: publicProcedure
    .input(
      z.object({
        idToken: z.string(),
      }),
    )
    .query(async ({ input, ctx }) => {
      const session = await ctx.session.user;

      const { idToken } = input;
      const { user, account, isNewUser } = await ctx.nextAuth.signIn("google", {
        idToken,
      });

      return { user, account, isNewUser };
    }),
});
