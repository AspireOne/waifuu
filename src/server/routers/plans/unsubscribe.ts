import { TRPCError } from "@/server/lib/TRPCError";
import { prisma } from "@/server/lib/db";
import { stripe } from "@/server/lib/stripe";
import { protectedProcedure } from "@/server/lib/trpc";
import { t } from "@lingui/macro";

export default protectedProcedure.mutation(async ({ ctx, input }) => {
  const sub = await ctx.prisma.subscription.findFirst({
    where: {
      userId: ctx.user.id,
      status: "active",
    },
    select: {
      id: true,
      stripeSubscriptionId: true,
    },
  });

  if (!sub) {
    throw new TRPCError({
      code: "NOT_FOUND",
      message: "Could not found the Subscription to unsubscribe from.",
    });
  }

  if (!sub.stripeSubscriptionId) {
    throw new Error(
      "Could not find the Stripe Subscription ID from an existing subscription.",
    );
  }

  try {
    const response = await stripe.subscriptions.cancel(sub.stripeSubscriptionId);
    console.log("cancelled plan response status: ", response.status);
  } catch (e) {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Failed to cancel the subscription.",
      cause: e,
      toast: t`Failed to cancel the subscription. Please contact support.`,
    });
  }

  await prisma.subscription.update({
    where: { id: sub.id },
    data: { status: "canceled" },
  });

  await prisma.user.update({
    where: { id: ctx.user.id },
    data: { planId: null },
  });
  // TODO: Send email.
});
