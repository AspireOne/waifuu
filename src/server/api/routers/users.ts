import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { z } from "zod";

export const usersRouter = createTRPCRouter({
  getSelf: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.user.findUnique({
      where: {
        id: ctx.session.user.id,
      },
      include: {
        Bot: true,
      },
    });
  }),

  getPublic: publicProcedure
    .input(
      z.object({
        username: z.string(),
      }),
    )
    .query(async ({ input, ctx }) => {
      const user = await ctx.prisma.user.findUnique({
        where: {
          username: input.username,
        },
        include: {
          Bot: {
            where: {
              visibility: "PUBLIC",
            },
          },
        },
      });

      if (!user) return null;

      // Hand-pick the returned properties, so we don't leak sensitive information.
      return {
        id: user.id,
        name: user.name,
        image: user.image,
        bots: user.Bot,
        username: user.username,
        bio: user.bio,
      };
    }),
});
