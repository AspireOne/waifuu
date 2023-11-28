import { TRPCError } from "@/server/lib/TRPCError";
import { protectedProcedure } from "@/server/lib/trpc";
import { t } from "@lingui/macro";
import { z } from "zod";

export default protectedProcedure
  .input(
    z.object({
      chatId: z.string(),
    }),
  )
  .query(async ({ input, ctx }) => {
    const chat = await ctx.prisma.chat.findUnique({
      where: {
        id: input.chatId,
      },
      include: {
        bot: true,
      },
    });

    if (!chat) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: `Chat not found based on passed in ID: ${input.chatId}`,
        toast: t`There was an error loading the chat.`,
      });
    }

    return chat.bot;
  });
