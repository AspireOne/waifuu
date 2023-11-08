import { protectedProcedure } from "@/server/lib/trpc";
import { z } from "zod";

export default protectedProcedure
  .input(
    z.object({
      botId: z.string(),
    }),
  )
  .query(async ({ input, ctx }) => {
    // Get all used chatModes for the bot based on chats.
    const chats = await ctx.prisma.chat.findMany({
      where: { botId: input.botId, userId: ctx.user.id },
      select: { mode: true },
    });

    return chats.map((chat) => chat.mode);
  });
