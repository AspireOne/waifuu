import { TRPCError } from "@/server/lib/TRPCError";
import { protectedProcedure } from "@/server/lib/trpc";
import { z } from "zod";

export default protectedProcedure
  .input(
    z.object({
      botId: z.string(),
      rate: z.enum(["like", "dislike"]),
    }),
  )
  .mutation(async ({ input, ctx }) => {
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
        likes: input.rate === "like" ? { increment: 1 } : undefined,
        dislikes: input.rate === "dislike" ? { increment: 1 } : undefined,
      },
    });

    return { success: true };
  });
