import { protectedProcedure } from "@/server/lib/trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { getCharacterSystemPrompt } from "@/server/ai/character-chat/getCharacterSystemPrompt";
import { llama13b } from "@/server/ai/models/llama13b";
// Yes, this does show error. There is no typescript version.
// @ts-ignore
import llamaTokenizer from "llama-tokenizer-js";

export default protectedProcedure
  .input(
    z.object({
      chatId: z.string(),
      message: z.string(),
    }),
  )
  .mutation(async ({ ctx, input }) => {
    const [chat, messages] = await Promise.all([
      // Find the chat that is user and bot currently in.
      ctx.prisma.botChat.findUnique({
        where: {
          id: input.chatId,
        },
        include: {
          bot: true,
          user: true,
        },
      }),

      // TODO: Get amount of messages based on the model's context window length.
      // For now we hardcode it.
      // Find the last x messages in the chat.
      ctx.prisma.botChatMessage.findMany({
        where: {
          chatId: input.chatId,
        },
        take: 20,
      }),
    ]);

    if (!chat) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Chat not found.",
      });
    }

    // Push the new message to the msg history.
    messages.push({
      content: input.message,
      chatId: input.chatId,

      // Bogus data (not important):
      role: "USER",
      id: 1,
      remembered: false,
      createdAt: new Date(),
      updatedAt: new Date(),
      mood: "HAPPY",
    });

    console.log("System Prompt: ", await getCharacterSystemPrompt(chat));
    // prettier-ignore
    console.log("messages total text length: ", messages.reduce((acc, msg) => acc + msg.content.length, 0));
    // prettier-ignore
    console.log("messages total token count: ", llamaTokenizer.encode(messages.map((msg) => msg.content)).length);

    let output;
    try {
      output = await llama13b.run({
        system_prompt: await getCharacterSystemPrompt(chat),
        prompt: messages,
      });
    } catch (e) {
      console.log(e);

      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to generate a reply.",
        cause: e,
      });
    }

    const [userMsg, botMsg] = await Promise.all([
      // Create user message.
      ctx.prisma.botChatMessage.create({
        data: {
          chatId: input.chatId,
          content: input.message,
          role: "USER",
        },
      }),

      // Create bot message.
      ctx.prisma.botChatMessage.create({
        data: {
          chatId: input.chatId,
          content: output,
          mood: "HAPPY",
          role: "BOT",
        },
      }),
    ]);

    return {
      message: botMsg,
      userMessage: userMsg,
    };
  });
