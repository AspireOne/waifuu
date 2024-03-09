import { TRPCError } from "@/server/lib/TRPCError";
import { protectedProcedure } from "@/server/lib/trpc";
import { z } from "zod";

export default protectedProcedure
  .input(
    z.object({
      botId: z.string(),
    }),
  )
  .query(async ({ input, ctx }) => {
    const { botId } = input;

    const bot = await ctx.prisma.bot.findFirst({
      where: {
        id: botId,
      },
    });

    if (!bot) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Bot not found.",
      });
    }

    // Increment the view count of the bot
    await ctx.prisma.bot.update({
      where: { id: botId },
      data: {
        viewCount: {
          increment: 1,
        },
      },
    });

    return { success: true };
  });
