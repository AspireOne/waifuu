import { getCharacterSystemPrompt } from "@/server/ai/character-chat/characterSystemPrompt";
import { llama13b } from "@/server/ai/models/llama13b";
import { protectedProcedure } from "@/server/lib/trpc";
import { Bot, Chat, Message, PrismaClient, User } from "@prisma/client";
import { TRPCError } from "@trpc/server";
// Yes, this does show error. There is no typescript version.
// @ts-ignore
import llamaTokenizer from "llama-tokenizer-js";
import { z } from "zod";

const Input = z.object({
  chatId: z.string(),
  message: z.string(),
});

export default protectedProcedure.input(Input).mutation(async ({ ctx, input }) => {
  // TODO: Get amount of messages based on the model's context window length.
  // For now we hardcode it.
  const chat = await retrieveChat(input.chatId, ctx.prisma, 20);

  // Push the new message to the msg history so that it is included in the prompt without saving them just yet.
  chat.messages.push(getMockMessage(input));

  // biome-ignore format:
  console.trace("messages total text length: ", chat.messages.reduce((acc, msg) => acc + msg.content.length, 0));
  // biome-ignore format:
  console.trace("messages total token count: ", llamaTokenizer.encode(chat.messages.map((msg) => msg.content)).length);

  const output = await genOutput(chat);

  const [userMsg, botMsg] = await saveMessages(input, output, ctx.prisma);

  return {
    message: botMsg,
    userMessage: userMsg,
  };
});

function getMockMessage(input: z.infer<typeof Input>): Message {
  return {
    content: input.message,
    chatId: input.chatId,

    // Bogus data (not important):
    role: "USER",
    id: 1,
    remembered: false,
    createdAt: new Date(),
    updatedAt: new Date(),
    mood: "HAPPY",
  };
}

async function genOutput(
  chat: Chat & { bot: Bot } & { user: User } & { messages: Message[] },
) {
  try {
    return await llama13b.run({
      system_prompt: await getCharacterSystemPrompt(chat),
      prompt: chat.messages,
    });
  } catch (e) {
    console.error(e);
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Failed to generate a reply.",
      cause: e,
    });
  }
}

async function saveMessages(input: z.infer<typeof Input>, output: string, db: PrismaClient) {
  // Note: They MUST NOT be CREATED IN PARALLEL (ASYNCHRONOUSLY), because
  // otherwise the order of the messages will be messed up.

  // Create user message.
  const userMsg = await db.message.create({
    data: {
      chatId: input.chatId,
      content: input.message,
      role: "USER",
    },
  });

  const botMsg = await db.message.create({
    data: {
      chatId: input.chatId,
      content: output,
      mood: "HAPPY",
      role: "BOT",
    },
  });

  return [userMsg, botMsg];
}

async function retrieveChat(chatId: string, db: PrismaClient, numOfMessages: number) {
  const chat = await db.chat.findUnique({
    where: {
      id: chatId,
    },
    include: {
      bot: true,
      user: true,
      messages: {
        take: numOfMessages,
      },
    },
  });

  if (!chat) {
    throw new TRPCError({
      code: "NOT_FOUND",
      message: "Chat not found.",
    });
  }

  return chat;
}
