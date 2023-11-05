import { protectedProcedure } from "@/server/lib/trpc";
import { PrismaClient } from "@prisma/client";
import { z } from "zod";

const Input = z.object({
  chatId: z.string(),
  limit: z.number().min(1).max(100).default(15),
  cursor: z.number().nullish(),
});

/**
 * Retrieves messages with a bot.
 */
export default protectedProcedure.input(Input).mutation(async ({ input, ctx: { prisma } }) => {
  const messages = await retrieveMessages(input, prisma);

  const nextCursor = messages.length > 0 ? messages[messages.length - 1]?.id : undefined;

  return {
    messages: messages,
    nextCursor,
  };
});

async function retrieveMessages(input: z.infer<typeof Input>, db: PrismaClient) {
  return await db.botChatMessage.findMany({
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
}
