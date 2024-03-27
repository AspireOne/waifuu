import { protectedProcedure } from "@/server/lib/trpc";
import { z } from "zod";

export default protectedProcedure
  .input(
    z.object({
      id: z.string(),
    }),
  )
  .mutation(async ({ input, ctx }) => {
    const like = await ctx.prisma.forumPostLike.findFirst({
      where: {
        postId: input.id,
        userId: ctx.user.id,
      },
    });

    if (!like) {
      await ctx.prisma.forumPostLike.create({
        data: {
          postId: input.id,
          userId: ctx.user.id,
        },
      });

      return await ctx.prisma.forumPost.update({
        where: {
          id: input.id,
        },
        data: {
          likeCount: {
            increment: 1,
          },
        },
      });
    }
  });
