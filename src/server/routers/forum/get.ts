import { protectedProcedure } from "@/server/lib/trpc";
import { z } from "zod";

export default protectedProcedure
  .input(
    z.object({
      id: z.string(),
    }),
  )
  .query(async ({ input, ctx }) => {
    const res = await ctx.prisma.forumPost.update({
      where: {
        id: input.id,
        parentPostId: null,
      },
      data: {
        viewCount: {
          increment: 1,
        },
      },
      include: {
        author: true,
        category: true,
      },
    });

    const like = await ctx.prisma.forumPostLike.findFirst({
      where: {
        postId: input.id,
        userId: ctx.user.id,
      },
    });

    return {
      ...res,
      liked: !!like,
    };
  });
