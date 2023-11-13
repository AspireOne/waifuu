import { env } from "@/server/env";
import Stripe from "stripe";

const globalForStripe = globalThis as unknown as {
  stripe: Stripe | undefined;
};

/** Global Stripe instance. */
export const stripe =
  globalForStripe.stripe ?? new Stripe(env.STRIPE_SK, { apiVersion: "2023-10-16" });

if (process.env.NODE_ENV !== "production") globalForStripe.stripe = stripe;
