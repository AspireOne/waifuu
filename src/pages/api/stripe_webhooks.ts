import { env } from "@/server/env";
import { prisma } from "@/server/lib/db";
import metaHandler from "@/server/lib/metaHandler";
import { stripe } from "@/server/lib/stripe";
import { Currency, SubscriptionInterval } from "@prisma/client";
import { PlanId } from "@prisma/client";
import { buffer } from "micro";
import { NextApiRequest, NextApiResponse } from "next";
import { Stripe } from "stripe";

// EXPORT config to tell Next.js NOT to parse the body
export const config = {
  api: {
    bodyParser: false,
  },
};

// Main webhook handler
const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "POST") {
    console.error("Received a request to stripe webhook that is not POST.");
    return res.status(405).end("Method Not Allowed");
  }
  const buff = await buffer(req);
  const sig = req.headers["stripe-signature"];
  let event: Stripe.Event;

  if (!sig) return res.status(400).send(`Stripe signature doesn't exist!`);

  try {
    event = stripe.webhooks.constructEvent(buff, sig, env.STRIPE_SIGNING_SECRET);
  } catch (err: any) {
    res.status(400).send(`Webhook Error: ${err.message}`);
    return;
  }

  console.log("Received event | type %s | id %s |", event.type, event.id);

  const eventHandlers: { [key: string]: (event: Stripe.Event) => Promise<void> } = {
    "invoice.payment_succeeded": handleInvoicePaymentSucceeded,
    "invoice.payment_failed": handleInvoicePaymentFailed,
    "customer.subscription.updated": handleCustomerSubscriptionUpdated,
    "customer.subscription.deleted": handleCustomerSubscriptionDeleted,
    //"customer.subscription.created": handleCustomerSubscriptionCreated,
    "checkout.session.completed": handleCheckoutSessionCompleted,
  };

  const handler = eventHandlers[event.type];

  if (!handler) {
    console.log("- Event does not have a handler. Returning.");
    return res.json({ received: true });
  }

  try {
    await handler(event);
  } catch (e: any) {
    console.error("Error handling event %s: %s", event.id, e);
    return res.status(500).json({ error: e?.message ?? e });
  }

  // Return a response to acknowledge receipt of the event
  res.json({ received: true });
};

const handleCheckoutSessionCompleted = async (event: Stripe.Event) => {
  const session = event.data.object as Stripe.Checkout.Session;
  const { userId, planId, interval } = session.metadata as {
    userId: string;
    planId: PlanId;
    interval: SubscriptionInterval;
  };

  if (!session.subscription) {
    throw new Error("Session doesn't have a subscription ID.");
  }

  if (!userId || !planId || !interval) {
    throw new Error("Metadata is missing.");
  }

  const subId =
    typeof session.subscription === "string" ? session.subscription : session.subscription.id;

  const stripeSub = await stripe.subscriptions.retrieve(subId);
  if (!stripeSub) {
    throw new Error("Stripe subscription doesn't exist.");
  }

  // Create a new subscription record
  await prisma.subscription.create({
    data: {
      userId: userId,
      stripeSubscriptionId: stripeSub.id,
      status: stripeSub.status,
      planId: planId,
      interval: interval,
      currentPeriodStart: new Date(stripeSub.current_period_start * 1000),
      currentPeriodEnd: new Date(stripeSub.current_period_end * 1000),
    },
  });

  await prisma.user.update({
    where: { id: userId },
    data: { planId: planId },
  });

  // TODO: Add internal sub id.
  await prisma.stripeSession.update({
    where: { id: session.id },
    data: { stripeSubscriptionId: stripeSub.id },
  });
};

// Handler for 'customer.subscription.deleted' event
const handleCustomerSubscriptionDeleted = async (event: Stripe.Event) => {
  const stripeSub = event.data.object as Stripe.Subscription;

  // Update subscription status to 'canceled'
  const sub = await prisma.subscription.update({
    where: { stripeSubscriptionId: stripeSub.id },
    data: { status: "canceled" },
    select: {
      userId: true,
    },
  });

  await prisma.user.update({
    where: { id: sub.userId },
    data: { planId: null },
  });
};

// Handler for 'invoice.payment_succeeded' event
const handleInvoicePaymentSucceeded = async (event: Stripe.Event) => {
  const invoice = event.data.object as Stripe.Invoice;
  const paymentIntentId = invoice.payment_intent as string;

  const stripeSub = await getStripeSubscriptionFromInvoice(invoice);

  // Create a new payment record.
  await prisma.payment.create({
    data: {
      stripeSubscriptionId: stripeSub.id,
      stripePaymentIntentId: paymentIntentId,
      amount: invoice.amount_paid,
      currency: invoice.currency.toUpperCase() as Currency,
      status: "succeeded",
    },
  });

  // Now retrieve the associated subscription and set it to 'active'.
  const sub = await getSubscriptionOrNot(stripeSub);
  if (!sub) return;

  prisma.subscription.update({
    where: { id: sub.id },
    data: { status: "active" },
  });

  prisma.user.update({
    where: { id: sub.userId },
    data: { planId: sub.planId },
  });
};

// Handler for 'invoice.payment_failed' event
const handleInvoicePaymentFailed = async (event: Stripe.Event) => {
  const invoice = event.data.object as Stripe.Invoice;

  const stripeSub = await getStripeSubscriptionFromInvoice(invoice);
  const sub = await getSubscriptionOrNot(stripeSub);
  if (!sub) return;

  // Update subscription status based on the failure reason
  // For simplicity, we're updating to 'past_due' but you might want to handle other statuses.
  await prisma.subscription.update({
    where: { id: sub.id },
    data: { status: "past_due" },
  });
};

// Handler for 'customer.subscription.updated' event
const handleCustomerSubscriptionUpdated = async (event: Stripe.Event) => {
  const stripeSub = event.data.object as Stripe.Subscription;

  // If the subscription cannot be retrieved = this is called too soon after creation = ignore because
  // all the necesarry data will be set at creation.
  const sub = await getSubscriptionOrNot(stripeSub);
  if (!sub) return;

  await prisma.subscription.update({
    where: { stripeSubscriptionId: stripeSub.id },
    data: {
      status: stripeSub.status,
      currentPeriodStart: new Date(stripeSub.current_period_start * 1000),
      currentPeriodEnd: new Date(stripeSub.current_period_end * 1000),
    },
  });

  if (stripeSub.status === "active" || stripeSub.status === "canceled") {
    const active = stripeSub.status === "active";

    prisma.user.update({
      where: {
        id: sub.userId,
      },
      data: {
        planId: active ? sub.planId : null,
      },
    });
  }
};

async function getStripeSubscriptionFromInvoice(invoice: Stripe.Invoice) {
  if (!invoice.subscription) {
    throw new Error("Invoice doesn't have a subscription ID.");
  }

  return typeof invoice.subscription === "string"
    ? await stripe.subscriptions.retrieve(invoice.subscription)
    : invoice.subscription;
}

/** If returns null, just return, do not throw any error. */
async function getSubscriptionOrNot(stripeSub: Stripe.Subscription) {
  const sub = await prisma.subscription.findFirst({
    where: { stripeSubscriptionId: stripeSub.id },
  });

  if (sub) return sub;

  // if not exist & date of creation is less than 2 minutes.
  if (stripeSub.created * 1000 > Date.now() - 2 * 60 * 1000) {
    console.log(
      "Subscription doesn't exist in db, " +
        "but it was created less than 2 minutes ago, so this is the intended behavior. Ignoring.",
    );
    return null;
  } else {
    throw new Error("Subscription is not saved in db but it should.");
  }
}

export default metaHandler.public(handler);
