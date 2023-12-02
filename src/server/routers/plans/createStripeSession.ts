import { stripe } from "@/server/clients/stripe";
import { createStripeCheckoutSessionJob } from "@/server/jobs/plans/createStripeCheckoutSessionJob";
import { protectedProcedure } from "@/server/lib/trpc";
import { LocaleCode } from "@lib/i18n";
import { Currency, PlanId, PrismaClient, User } from "@prisma/client";
import { SubscriptionInterval } from "@prisma/client";
import { z } from "zod";

export default protectedProcedure
  .input(
    z.object({
      planId: z.nativeEnum(PlanId),
      interval: z.nativeEnum(SubscriptionInterval),
      currency: z.nativeEnum(Currency),
    }),
  )
  .mutation(async ({ ctx, input }) => {
    let customerId: string;
    if (ctx.user.stripeCustomerId) {
      customerId = ctx.user.stripeCustomerId;
    } else {
      const customer = await createStripeCustomer(ctx.user, ctx.prisma, ctx.locale);
      customerId = customer.id;
    }

    // TODO: Translate.
    // Create a new checkout session for the authenticated user
    const session = await createStripeCheckoutSessionJob({
      planId: input.planId,
      interval: input.interval,
      currencyCode: input.currency,
      user: ctx.user,
      customerId: customerId,
      locale: ctx.locale,
    });

    await ctx.prisma.stripeSession.create({
      data: {
        id: session.id,
        userId: ctx.user.id,
        planId: input.planId,
        interval: input.interval,
      },
    });

    return session;
  });

async function createStripeCustomer(user: User, prisma: PrismaClient, locale: LocaleCode) {
  // Create a new customer object
  const customer = await stripe.customers.create({
    email: user.email,
    preferred_locales: [locale],
    description: `Customer for ${user.email} / ${user.name}`,
    metadata: {
      userId: user.id,
    },
  });

  // Update the user with the Stripe customer ID
  await prisma.user.update({
    where: { id: user.id },
    data: { stripeCustomerId: customer.id },
  });

  return customer;
}
