import { publicProcedure } from "@/server/lib/trpc";
import { z } from "zod";

export default publicProcedure
  .input(
    z.object({
      botId: z.string(),
    }),
  )
  .query(async ({ input, ctx }) => {
    return await ctx.prisma.bot.findUnique({
      where: {
        id: input.botId,
      },
    });
  });
