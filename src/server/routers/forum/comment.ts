import { protectedProcedure } from "@/server/lib/trpc";
import { z } from "zod";

export default protectedProcedure
  .input(
    z.object({
      content: z.string(),
      parentPostId: z.string(),
    }),
  )
  .mutation(async ({ input, ctx }) => {
    const res = await ctx.prisma.forumPost.create({
      data: {
        content: input.content,
        authorId: ctx.user.id,
        parentPostId: input.parentPostId,
      },
    });

    return res;
  });
