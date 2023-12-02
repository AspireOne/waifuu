import { env } from "@/server/env";
import { global } from "@/server/global";
import Stripe from "stripe";

// biome-ignore lint/suspicious/noAssignInExpressions: off.
export const stripe = (global.stripe ??= new Stripe(env.STRIPE_SK, {
  apiVersion: "2023-10-16",
}));
