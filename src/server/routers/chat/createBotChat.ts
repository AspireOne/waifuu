import { z } from "zod";
import { BotMode } from "@prisma/client";
import { protectedProcedure } from "@/server/lib/trpc";

export default protectedProcedure
  .input(
    z.object({
      botId: z.string(),
      botMode: z.nativeEnum(BotMode),
      userContext: z.string(),
    }),
  )
  .mutation(async ({ input, ctx }) => {
    return await ctx.prisma.botChat.create({
      data: {
        botId: input.botId,
        botMode: input.botMode,
        userId: ctx.user.id,
        userContext: input.userContext,
      },
    });
  });
