// increment features
// - messagesSent
// - botsCreated
// - botsAccessedIds

// get features status (true = enabled, false = used up)
// - messagesSent: boolean
// - botsCreated: boolean
// - botsAccessedIds: boolean

import { retrieveQuotaUsageJob } from "@/server/jobs/plans/retrieveQuotaUsageJob";
import { TRPCError } from "@/server/lib/TRPCError";
import { Plan, getPlanOrFree } from "@/server/shared/plans";
import { t } from "@lingui/macro";
import { PlanId, PlanQuotaUsage, PrismaClient } from "@prisma/client";

export type QuotaParameter = "messagesSent" | "botsCreated" | "botsAccessedIds";

const getErrorMessage = (parameter: QuotaParameter) => {
  switch (parameter) {
    case "messagesSent":
      return t`Your daily message limit has been reached. Upgrade your plan to get more messages.`;
    case "botsCreated":
      return t`Your monthly character creation limit has been reached. Upgrade your plan to get more characters.`;
    case "botsAccessedIds":
      return t`Your daily character access limit has been reached. Upgrade your plan to get more characters.`;
  }
};

/** Throws an error if the quota for the given parameter has been exceeded. */
export const ensureWithinQuotaOrThrow = async (
  parameter: QuotaParameter,
  db: PrismaClient,
  userId: string,
  planId?: PlanId | null,
) => {
  const usage = await retrieveQuotaUsageJob(db, userId);
  const isUsedUp = isQuotaUsedUp(parameter, usage, getPlanOrFree(planId));

  if (isUsedUp) {
    throw new TRPCError({
      code: "FORBIDDEN",
      message: "quota exceeded",
      toast: getErrorMessage(parameter),
      toastType: "warning",
    });
  }
};

// TODO: Make the parameter be typecheck validated when passed to data{}.
export const incrementQuotaUsage = async (
  parameter: QuotaParameter,
  userId: string,
  db: PrismaClient,
) => {
  await db.planQuotaUsage.update({
    where: {
      userId: userId,
    },
    data: {
      [parameter]: {
        increment: 1,
      },
    },
  });
};

export const isQuotaUsedUp = (
  parameter: QuotaParameter,
  quota: Omit<PlanQuotaUsage, "userId">,
  plan: Plan,
) => {
  switch (parameter) {
    case "messagesSent":
      return quota.messagesSent >= plan.limits.messagesPerDay;
    case "botsCreated":
      return quota.botsCreated >= plan.limits.customCharactersPerMonth;
    case "botsAccessedIds":
      return quota.botsAccessedIds.length >= plan.limits.charactersAccessedPerDay;
  }
};
