import { langfuse } from "@/server/clients/langfuse";
import { getModelToUse } from "@/server/lib/models";
import { protectedProcedure } from "@/server/lib/trpc";
import { Feedback } from "@prisma/client";
import { z } from "zod";

export default protectedProcedure
  .input(
    z.object({
      feedback: z.nativeEnum(Feedback).nullable(),
      messageId: z.number(),
      chatId: z.string(),
    }),
  )
  .mutation(async ({ input, ctx }) => {
    if (input.feedback !== null) {
      langfuse.score({
        traceId: `${input.chatId}`,
        name: "user_feedback",
        value: input.feedback === Feedback.LIKE ? 1 : 0,
      });
    }

    const [currentMessage, chat] = await Promise.all([
      ctx.prisma.message.update({
        where: {
          id: input.messageId,
        },
        data: {
          feedback: input.feedback,
        },
        select: {
          createdAt: true,
        },
      }),
      ctx.prisma.chat.findUnique({
        where: {
          id: input.chatId,
        },
        select: {
          mode: true,
        },
      }),
      langfuse.flush(),
    ]);

    const prevMessage = await ctx.prisma.message.findFirst({
      where: {
        chatId: input.chatId,
        createdAt: {
          lt: currentMessage.createdAt, // Find messages created before the current one
        },
      },
      orderBy: {
        createdAt: "desc", // Get the most recent message before the current one
      },
      take: 1, // Only need the single most recent one
      select: {
        id: true,
      },
    });

    if (input.feedback === null) {
      await ctx.prisma.messageFeedbackMetadata.delete({
        where: {
          messageId: input.messageId,
        },
      });
    } else {
      await ctx.prisma.messageFeedbackMetadata.upsert({
        where: {
          messageId: input.messageId,
        },
        create: {
          messageId: input.messageId,
          modelId: getModelToUse(chat!.mode).id,
          feedback: input.feedback,
          previousMessageId: prevMessage?.id || null,
        },
        update: {
          feedback: input.feedback,
        },
      });
    }
  });
