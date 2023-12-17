import { protectedProcedure } from "@/server/lib/trpc";
import { z } from "zod";

export default protectedProcedure
  .input(
    z.object({
      feedback: z.string(),
    }),
  )
  .mutation(async ({ input, ctx }) => {
    await ctx.prisma.generalFeedback.create({
      data: {
        content: input.feedback,
        userId: ctx.user.id,
      },
    });
  });
