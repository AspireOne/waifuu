// changePlan.ts

import { prisma } from "@/server/lib/db";
import { stripe } from "@/server/lib/stripe";
import { protectedProcedure } from "@/server/lib/trpc";
import { PlanId } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

export default protectedProcedure
  .input(
    z.object({
      planId: z.nativeEnum(PlanId),
    }),
  )
  .mutation(async ({ ctx, input }) => {
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

    const response = await stripe.subscriptions.cancel(sub.stripeSubscriptionId);
    console.log("cancelled plan response status: ", response.status);
    await prisma.subscription.update({
      where: { id: sub.id },
      data: { status: "canceled" },
    });
    // TODO: Send email.
  });
