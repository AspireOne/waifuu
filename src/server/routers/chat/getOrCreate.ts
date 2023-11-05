import { protectedProcedure } from "@/server/lib/trpc";
import { ChatMode, PrismaClient, User } from "@prisma/client";
import { z } from "zod";

export default protectedProcedure
  .input(
    z.object({
      botId: z.string(),
      mode: z.nativeEnum(ChatMode),
      userContext: z.string(),
    }),
  )
  .mutation(async ({ input: { botId, mode, userContext }, ctx: { prisma, user } }) => {
    // Check if there is already a chat.
    const current = await retrieveCurrentChat(botId, mode, user, prisma);
    if (current) return current;

    // Create a new chat.
    const chat = await prisma.chat.create({
      data: {
        botId: botId,
        mode: mode,
        userId: user.id,
        userContext: userContext,
      },
    });

    // Insert initial message.
    const initialMessage = await retrieveInitialMessage(botId, mode, prisma);
    await prisma.message.create({
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
  mode: ChatMode,
  user: User,
  db: PrismaClient,
) {
  return await db.chat.findFirst({
    where: {
      userId: user.id,
      mode: mode,
      botId: botId,
    },
  });
}

async function retrieveInitialMessage(botId: string, mode: ChatMode, db: PrismaClient) {
  return await db.initialMessage.findUniqueOrThrow({
    where: {
      botId_chatMode: {
        botId: botId,
        chatMode: mode,
      },
    },
  });
}
