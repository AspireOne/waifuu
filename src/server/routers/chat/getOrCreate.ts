import { protectedProcedure } from "@/server/lib/trpc";
import { BotMode, PrismaClient, User } from "@prisma/client";
import { z } from "zod";

export default protectedProcedure
  .input(
    z.object({
      botId: z.string(),
      botMode: z.nativeEnum(BotMode),
      userContext: z.string(),
    }),
  )
  .mutation(async ({ input: { botId, botMode, userContext }, ctx: { prisma, user } }) => {
    // Check if there is already a chat.
    const current = await retrieveCurrentChat(botId, botMode, user, prisma);
    if (current) return current;

    // Create a new chat.
    const chat = await prisma.botChat.create({
      data: {
        botId: botId,
        botMode: botMode,
        userId: user.id,
        userContext: userContext,
      },
    });

    // Insert initial message.
    const initialMessage = await retrieveInitialMessage(botId, botMode, prisma);
    await prisma.botChatMessage.create({
      data: {
        chatId: chat.id,
        content: initialMessage.message,
        role: "BOT",
      },
    });

    // Return the chat.
    return chat;
  });

async function retrieveCurrentChat(
  botId: string,
  botMode: BotMode,
  user: User,
  db: PrismaClient,
) {
  return await db.botChat.findFirst({
    where: {
      userId: user.id,
      botMode: botMode,
      botId: botId,
    },
  });
}

async function retrieveInitialMessage(botId: string, botMode: BotMode, db: PrismaClient) {
  return await db.initialMessage.findUniqueOrThrow({
    where: {
      botId_botMode: {
        botId: botId,
        botMode: botMode,
      },
    },
  });
}
