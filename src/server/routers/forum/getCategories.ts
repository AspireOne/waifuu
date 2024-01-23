import { protectedProcedure } from "@/server/lib/trpc";
import { z } from "zod";

export default protectedProcedure
  .input(
    z.object({
      skip: z.number(),
      take: z.number(),
    }),
  )
  .query(({ ctx, input }) => {
    return ctx.prisma.category.findMany({
      skip: input.skip,
      take: input.take,
    });
  });
