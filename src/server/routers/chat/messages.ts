import { protectedProcedure } from "@/server/lib/trpc";
import { z } from "zod";

/**
 * Retrieves messages with a bot.
 */
export default protectedProcedure
  .input(
    z.object({
      chatId: z.string(),
      limit: z.number().min(1).max(100).default(15),
      cursor: z.number().nullish(),
    }),
  )
  .mutation(async ({ input, ctx }) => {
    const messages = await ctx.prisma.botChatMessage.findMany({
      take: input.limit,
      where: {
        chatId: input.chatId,
        id: input.cursor
          ? {
              lt: input.cursor,
            }
          : undefined,
      },
      orderBy: {
        id: "desc",
      },
    });

    const nextCursor =
      messages.length > 0 ? messages[messages.length - 1]?.id : undefined;

    return {
      messages: messages.reverse(),
      nextCursor,
    };
  });
