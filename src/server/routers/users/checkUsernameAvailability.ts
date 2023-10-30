import { protectedProcedure } from "@/server/lib/trpc";
import { z } from "zod";

export default protectedProcedure
  .input(
    z.object({
      username: z.string(),
    }),
  )
  .mutation(async ({ input, ctx }) => {
    const exists = await ctx.prisma.user.findUnique({
      where: {
        username: input.username,
      },
    });

    return !exists;
  });
