import { protectedProcedure } from "@/server/lib/trpc";
import { z } from "zod";

export default protectedProcedure
  .input(
    z.object({
      skip: z.number(),
      take: z.number(),
    }),
  )
  .query(async ({ input, ctx }) => {
    return await ctx.prisma.forumPost.findMany({
      where: {
        parentPostId: null,
      },
      skip: input.skip,
      take: input.take,
      include: {
        author: true,
      },
    });
  });
