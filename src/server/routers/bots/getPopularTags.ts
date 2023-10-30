import { protectedProcedure } from "@/server/lib/trpc";
import { z } from "zod";

export default protectedProcedure
  .input(
    z.object({
      limit: z.number().min(1).max(10).default(10),
    }),
  )
  .query(async ({ input, ctx }) => {
    const tags = await ctx.prisma.category.findMany({
      take: input.limit,
      orderBy: {
        Bots: {
          _count: "desc",
        },
      },
    });

    return tags;
  });
