import { getCharacterSystemPrompt } from "@/server/ai/character-chat/characterSystemPrompt";
import { llama13b } from "@/server/ai/models/llama13b";
import { protectedProcedure } from "@/server/lib/trpc";
import { TRPCError } from "@trpc/server";
// Yes, this does show error. There is no typescript version.
// @ts-ignore
import llamaTokenizer from "llama-tokenizer-js";
import { z } from "zod";

export default protectedProcedure
  .input(
    z.object({
      chatId: z.string(),
      message: z.string(),
    }),
  )
  .mutation(async ({ ctx, input }) => {
    const chat = await ctx.prisma.chat.findUnique({
      where: {
        id: input.chatId,
      },
      include: {
        bot: true,
        user: true,
        // TODO: Get amount of messages based on the model's context window length.
        // For now we hardcode it.
        messages: {
          take: 20,
        },
      },
    });

    if (!chat) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Chat not found.",
      });
    }

    // Push the new message to the msg history.
    chat.messages.push({
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
    console.log(
      "messages total text length: ",
      chat.messages.reduce((acc, msg) => acc + msg.content.length, 0),
    );
    // prettier-ignore
    console.log(
      "messages total token count: ",
      llamaTokenizer.encode(chat.messages.map((msg) => msg.content)).length,
    );

    let output;
    try {
      output = await llama13b.run({
        system_prompt: await getCharacterSystemPrompt(chat),
        prompt: chat.messages,
      });
    } catch (e) {
      console.log(e);

      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to generate a reply.",
        cause: e,
      });
    }

    // Note: They MUST NOT be CREATED IN PARALLEL (ASYNCHRONOUSLY), because
    // otherwise the order of the messages will be messed up.

    // Create user message.
    const userMsg = await ctx.prisma.message.create({
      data: {
        chatId: input.chatId,
        content: input.message,
        role: "USER",
      },
    });

    const botMsg = await ctx.prisma.message.create({
      data: {
        chatId: input.chatId,
        content: output,
        mood: "HAPPY",
        role: "BOT",
      },
    });

    return {
      message: botMsg,
      userMessage: userMsg,
    };
  });
