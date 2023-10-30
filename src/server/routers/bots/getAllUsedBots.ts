import { protectedProcedure } from "@/server/lib/trpc";
import { z } from "zod";

/**
 * Return all bots that user has currently conversation with.
 */
export default protectedProcedure
  .input(
    z.object({
      limit: z.number().min(1).nullish(),
    }),
  )
  .query(async ({ input, ctx }) => {
    const chats = await ctx.prisma.botChat.findMany({
      take: input?.limit || undefined,
      where: {
        userId: ctx.user.id,
      },
      include: {
        bot: true,
      },
    });

    return chats.map((chat) => {
      return {
        chatId: chat.id,
        chatType: chat.botMode,
        ...chat.bot,
      };
    });
  });
