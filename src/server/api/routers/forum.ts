import { createTRPCRouter, protectedProcedure } from "../trpc";
import { z } from "zod";

export const forumRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({
        title: z.string(),
        content: z.string(),
      }),
    )
    .query(async ({ input, ctx }) => {
      return await ctx.prisma.forumPost.create({
        data: {
          title: input.title,
          content: input.content,
          authorId: ctx.user.id,
        },
      });
    }),
});
