import { protectedProcedure } from "@/server/lib/trpc";
import { BotMode, PrismaClient } from "@prisma/client";
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

    return chat;
  });

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
