import { Plan } from "@/server/shared/plans";
import { api } from "@lib/api";
import { msg } from "@lingui/macro";
import { useLingui } from "@lingui/react";
import { loadStripe } from "@stripe/stripe-js";
import { toast } from "react-toastify";

if (!process.env.NEXT_PUBLIC_STRIPE_PK) throw new Error("Missing stripe public key.");
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PK);

export const useCreateSessionMutation = (setSubmittingPlan: (plan: Plan | null) => void) => {
  const { _ } = useLingui();
  return api.plans.createStripeSession.useMutation({
    onSuccess: async (data) => {
      // Load stripe.
      const stripe = await stripePromise;
      if (!stripe) {
        setSubmittingPlan(null);
        toast(_(msg`Stripe did not load`), { type: "error" });
        throw new Error("Stripe did not load.");
      }

      const result = await stripe.redirectToCheckout({ sessionId: data.id });
      setSubmittingPlan(null);

      if (result.error) {
        toast(result.error.message, { type: "error" });
      }
    },
  });
};
