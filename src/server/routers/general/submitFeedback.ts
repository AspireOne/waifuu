import { rateLimiter } from "@/server/clients/rateLimiter";
import { retrieveIp } from "@/server/helpers/helpers";
import { protectedProcedure } from "@/server/lib/trpc";
import parse from "parse-duration";
import { z } from "zod";

export default protectedProcedure
  .input(
    z.object({
      feedback: z.string(),
    }),
  )
  .mutation(async ({ input, ctx }) => {
    rateLimiter.ensureWithinLimitOrThrow({
      id: "submit-general-feedback",
      ip: retrieveIp(ctx.req),
      userId: ctx.user.id,
      userLimits: [
        { maxHits: 10, ms: parse("1h")! },
        { maxHits: 30, ms: parse("1d")! },
      ],
      ipLimits: "user-factor",
    });

    await ctx.prisma.generalFeedback.create({
      data: {
        content: input.feedback,
        userId: ctx.user.id,
      },
    });
  });
