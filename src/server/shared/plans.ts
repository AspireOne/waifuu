import { t } from "@lingui/macro";
import { Currency, PlanId } from "@prisma/client";

type PlanPrice = {
  [K in Currency]: number;
};

type Plan = {
  // The id will be replaced with a reference to enum from prisma schema.
  id: PlanId;
  tier: number;
  name: string;
  description: string;
  features: string[];
  limits: {
    messagesPerDay: number;
    charactersAccessedPerDay: number;
    customCharactersPerMonth: number;
  };
  price: PlanPrice;
};

type Plans = {
  free: Plan;
  plus: Plan;
  pro: Plan;
};

// TODO: Add images so that we can put them to stripe checkout session.
// NOTE: Tiers must be in ascending order!
export const subscriptionPlans = (): Plans => {
  return {
    free: {
      id: PlanId.SUBSCRIPTION_PLAN_FREE_V1,
      tier: 0,
      name: t({ message: "Free", context: "Subscription plan name" }),
      // TODO: Change the descriptions :d
      description: t`All the essentials for a sporadic chatter.`,
      features: [
        t`~50 messages per day`,
        t`10 custom characters a month`,
        t`Access to all official characters`,
        t`Access to all community characters`,
        t`Our best A.I. engine`,
        t`Free access to all new features`,
        t`Free access to all future community-related features`,
      ],
      limits: {
        messagesPerDay: 50,
        charactersAccessedPerDay: 50,
        customCharactersPerMonth: 10,
      },
      price: {
        USD: 0,
        CZK: 0,
        EUR: 0,
      },
    },
    plus: {
      id: PlanId.SUBSCRIPTION_PLAN_PLUS_V1,
      tier: 1,
      name: t({ message: "Plus", context: "Subscription plan name" }),
      description: t`Immerse yourself in a whole new world of imagination.`,
      features: [
        t`Everything from the Free Plan, plus...`,
        t`~300 messages a day`,
        t`100 custom characters per month`,
        t`Priority access to all new early features`,
        t`Priority customer support`,
      ],
      limits: {
        messagesPerDay: 300,
        charactersAccessedPerDay: 1000,
        customCharactersPerMonth: 100,
      },
      price: {
        USD: 6.59,
        CZK: 149,
        EUR: 5.49,
      },
    },
    pro: {
      id: PlanId.SUBSCRIPTION_PLAN_PRO_V1,
      tier: 2,
      name: t({ message: "PRO", context: "Subscription plan name" }),
      description: t`The ultimate experience for the most demanding users.`,
      features: [
        t`Everything from the Plus Plan, plus...`,
        t`~1000 messages a day`,
        t`500 custom characters per month`,
        t`Special recognition within the community (badge)`,
        t`Priority characters in community marketplace`,
        t`Access to all beta features`,
        t`Access to all future features`,
      ],
      limits: {
        messagesPerDay: 1000,
        charactersAccessedPerDay: 1000,
        customCharactersPerMonth: 500,
      },
      price: {
        USD: 14.99,
        CZK: 299,
        EUR: 12.99,
      },
    },
  };
};

export function getPlan(planId: PlanId): Plan {
  for (const plan of Object.values(subscriptionPlans())) {
    if (plan.id === planId) return plan;
  }
  throw new Error(
    `Plan with id ${planId} was not found. This should not be possible to happen.`,
  );
}

export function getPlanOrFree(planId?: PlanId | null) {
  if (!planId) return subscriptionPlans().free;
  return getPlan(planId);
}

export type { Plans, Plan, PlanPrice };
