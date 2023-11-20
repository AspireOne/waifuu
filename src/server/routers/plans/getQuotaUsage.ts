import { QuotaParameter } from "@/server/helpers/quota";
import { retrieveQuotaUsageJob } from "@/server/jobs/plans/retrieveQuotaUsageJob";
import { protectedProcedure } from "@/server/lib/trpc";
import { getPlanOrFree } from "@/server/shared/plans";
import { z } from "zod";

export type UsageFormatted = {
  [key in QuotaParameter]: {
    used: number;
    limit: number;
    interval: "day" | "month";
  };
};

const QuotaUsage = z.object({
  used: z.number(),
  limit: z.number(),
  interval: z.enum(["day", "month"]),
});

export const UsageFormattedSchema = z.record(QuotaUsage);

export default protectedProcedure.output(UsageFormattedSchema).query(async ({ ctx }) => {
  const usage = await retrieveQuotaUsageJob(ctx.prisma, ctx.user.id);
  const plan = getPlanOrFree(ctx.user.planId);

  const usageFormatted: UsageFormatted = {
    messagesSent: {
      used: usage.messagesSent,
      limit: plan.limits.messagesPerDay,
      interval: "day",
    },
    botsCreated: {
      used: usage.botsCreated,
      limit: plan.limits.customCharactersPerMonth,
      interval: "month",
    },
    botsAccessedIds: {
      used: usage.botsAccessedIds.length,
      limit: plan.limits.customCharactersPerMonth,
      interval: "month",
    },
  };

  return usageFormatted;
});
