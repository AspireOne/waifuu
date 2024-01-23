import { protectedProcedure } from "@/server/lib/trpc";
import { z } from "zod";

export default protectedProcedure
  .input(
    z.object({
      skip: z.number(),
      take: z.number(),
      includesCategories: z.array(z.string()).optional().default([]),
    }),
  )
  .query(async ({ input, ctx }) => {
    return await ctx.prisma.forumPost.findMany({
      where: {
        parentPostId: null,
        ...(input.includesCategories.length > 0 && {
          category: {
            name: {
              in: input.includesCategories,
            },
          },
        }),
      },
      skip: input.skip,
      take: input.take,
      include: {
        author: true,
      },
    });
  });
