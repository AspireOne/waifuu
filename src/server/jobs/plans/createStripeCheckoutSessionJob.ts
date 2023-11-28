import { stripe } from "@/server/lib/stripe";
import { currencyData } from "@/server/shared/currency";
import { getPlan } from "@/server/shared/plans";
import { LocaleCode } from "@lib/i18n";
import { fullUrl, paths } from "@lib/paths";
import { Currency, PlanId, SubscriptionInterval, User } from "@prisma/client";

export const createStripeCheckoutSessionJob = async (props: {
  user: User;
  planId: PlanId;
  interval: SubscriptionInterval;
  customerId: string;
  locale: LocaleCode;
  currencyCode: Currency;
}) => {
  const { user, currencyCode, locale, interval, customerId, planId } = props;
  const plan = getPlan(planId);
  const currency = currencyData.find((c) => c.code === currencyCode)!;

  return await stripe.checkout.sessions.create({
    payment_method_types: ["card", "paypal"],
    mode: "subscription",
    success_url: fullUrl(paths.subscriptionSuccess),
    cancel_url: fullUrl(paths.subscriptionCancel),
    locale: locale,
    client_reference_id: user.id,
    currency: currency.code.toLowerCase(),
    customer: customerId,
    metadata: {
      userId: user.id,
      planId: plan.id,
      interval: interval,
    },
    expand: ["subscription"],
    line_items: [
      {
        quantity: 1,
        // Either 'price' or 'price_data' is requred.
        // 'price' references a pre-created plan in Stripe.
        // 'price_data' is used when creating a plan/price/data dynamically.
        // We are using 'price_data' here because wewant to set the currency dynamically AND because it is easier.
        price_data: {
          currency: currency.code.toLowerCase(),
          unit_amount: plan.price[currency.code] * 100,
          recurring: {
            interval: interval,
            interval_count: 1,
          },
          // Either 'product' or 'product_data' is required. 'product' references a pre-created product in Stripe.
          product_data: {
            name: plan.name,
            description: plan.description,
            // TODO: Add images.
            metadata: {
              planId: plan.id,
              id: plan.id,
            },
          },
        },
      },
    ],
  });
};
