import { protectedProcedure } from "@/server/lib/trpc";
import { z } from "zod";

export default protectedProcedure
  .input(
    z.object({
      chatId: z.string(),
    }),
  )
  .query(async ({ input, ctx }) => {
    const chat = await ctx.prisma.botChat.findUnique({
      where: {
        id: input.chatId,
      },
      include: {
        bot: true,
      },
    });

    return chat?.bot;
  });
