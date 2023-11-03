import { protectedProcedure } from "@/server/lib/trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { llama13b } from "@/server/ai/models/llama13b";
import { getCharacterSystemPrompt } from "@/server/ai/character-chat/getCharacterSystemPrompt";
import { getInitialMessagePrompt } from "@/server/ai/character-chat/prompts";

export default protectedProcedure
  .input(
    z.object({
      chatId: z.string(),
    }),
  )
  .mutation(async ({ ctx, input }) => {
    const chat = await ctx.prisma.botChat.findFirst({
      where: {
        id: input.chatId,
      },
      include: {
        bot: true,
        user: true,
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
      prompt: getInitialMessagePrompt,
    });

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
    };
  });
