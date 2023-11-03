import { protectedProcedure } from "@/server/lib/trpc";
import { z } from "zod";
import { llama13b } from "@/server/ai/models/llama13b";
import { getCharacterSystemPrompt } from "@/server/ai/character-chat/getCharacterSystemPrompt";
import { initialMessagePrompt } from "@/server/ai/character-chat/prompts";
import { PrismaClient } from "@prisma/client";
import { TRPCError } from "@trpc/server";

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

    // Check if there are no messages at all in the chat (take into account cursor).
    if (messages.length === 0 && !input.cursor) {
      await createInitialMessage(input.chatId, ctx.prisma);
    }

    const nextCursor =
      messages.length > 0 ? messages[messages.length - 1]?.id : undefined;

    return {
      messages: messages.reverse(),
      nextCursor,
    };
  });

async function createInitialMessage(chatId: string, db: PrismaClient) {
  const chat = await db.botChat.findUnique({
    where: {
      id: chatId,
    },
    include: {
      user: true,
      bot: true,
    },
  });

  if (!chat) {
    throw new TRPCError({
      code: "NOT_FOUND",
      message: "Chat not found.",
    });
  }

  const output = await llama13b.run({
    system_prompt: await getCharacterSystemPrompt(chat),
    prompt: initialMessagePrompt,
  });

  return await db.botChatMessage.create({
    data: {
      chatId: chat.id,
      content: output,
      mood: "HAPPY",
      role: "BOT",
    },
  });
}
