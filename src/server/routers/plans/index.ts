import { createTRPCRouter } from "@/server/lib/trpc";
import createStripeSession from "@/server/routers/plans/createStripeSession";
import getQuotaUsage from "@/server/routers/plans/getQuotaUsage";
import unsubscribe from "@/server/routers/plans/unsubscribe";

export const plansRouter = createTRPCRouter({
  getQuotaUsage,
  createStripeSession,
  unsubscribe,
});
