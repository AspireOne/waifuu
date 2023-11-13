import { createTRPCRouter } from "@/server/lib/trpc";
import createStripeSession from "@/server/routers/plans/createStripeSession";
import getCurrentPlan from "@/server/routers/plans/getCurrentPlan";
import unsubscribe from "@/server/routers/plans/unsubscribe";

export const plansRouter = createTRPCRouter({
  getCurrentPlan,
  createStripeSession,
  unsubscribe,
});
