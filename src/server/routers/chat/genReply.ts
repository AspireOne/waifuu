import { protectedProcedure } from "@/server/lib/trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { getCharacterSystemPrompt } from "@/server/ai/character-chat/getCharacterSystemPrompt";
import { llama13b } from "@/server/ai/shared/models/llama13b";

export default protectedProcedure
  .input(
    z.object({
      chatId: z.string(),
      message: z.string(),
    }),
  )
  .mutation(async ({ ctx, input }) => {
    // Create a new message from the input user provided
    const userMsg = await ctx.prisma.botChatMessage.create({
      data: {
        chatId: input.chatId,
        content: input.message,
        role: "USER",
        // Status: pending?
      },
    });

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
      // And lastly, find the last 20 messages in the chat.
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

    /*const outputParser = StructuredOutputParser.fromZodSchema(
      z.object({
        reply: z.string().min(1).describe("The reply to the user."),
        mood: z.nativeEnum(Mood).describe("The sentiment of the reply."),
      }),
    );*/
    /*const outputFixingParser = OutputFixingParser.fromLLM(
      fixingLlm,
      outputParser,
    );*/

    console.log(
      "CREATED SYSTEM PROMPT: ",
      await getCharacterSystemPrompt(chat),
    );

    let output;
    try {
      output = await llama13b.run({
        system_prompt: await getCharacterSystemPrompt(
          chat,
          /*outputParser,*/
        ),
        prompt: messages,
      });
    } catch (e) {
      console.log(e);
      // remove the user message from db.
      await ctx.prisma.botChatMessage.delete({
        where: {
          id: userMsg.id,
        },
      });

      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to generate a reply.",
        cause: e,
      });
    }

    const botMsg = await ctx.prisma.botChatMessage.create({
      data: {
        chatId: input.chatId,
        content: output,
        mood: "HAPPY",
        role: "BOT",
      },
    });

    return {
      botChatMessage: botMsg,
      userMessage: userMsg,
    };
  });
