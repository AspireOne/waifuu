import { Plan, subscriptionPlans } from "@/server/shared/plans";
import { CombinedPage } from "@components/CombinedPage";
import { PricingPageHeader } from "@components/PricingPage/PricingPageHeader";
import { useCreateSessionMutation } from "@components/PricingPage/useCreateSessionMutation";
import { useUnsubscribeMutation } from "@components/PricingPage/useUnsubscribeMutation";
import { PricingPlanCard } from "@components/PricingPlanCard";
import { useSession } from "@contexts/SessionProvider";
import { api } from "@lib/api";
import { paths } from "@lib/paths";
import { msg } from "@lingui/macro";
import { useLingui } from "@lingui/react";
import { Spacer } from "@nextui-org/react";
import { useRouter } from "next/router";
import { useState } from "react";

// TODO: Interval.
export const PricingPage = () => {
  const router = useRouter();
  const auth = useSession();
  const { _ } = useLingui();
  const [submittingPlan, setSubmittingPlan] = useState<Plan | null>(null);

  const { data: currPlan, isLoading: planLoading } = api.plans.getCurrentPlan.useQuery(
    undefined,
    {
      enabled: auth.status === "authenticated",
    },
  );
  const createSessionMut = useCreateSessionMutation(setSubmittingPlan);
  const unsubscribeMut = useUnsubscribeMutation();

  async function onChoosePlanClick(plan: Plan) {
    // Check if authed.
    if (auth.status === "unauthenticated") {
      await router.push(paths.login());
      return;
    }

    // Check if we CAN upgrade/downgrade.
    if (planLoading || currPlan?.id === plan.id || submittingPlan) return;

    // const downgrading = plan && plan.tier > getPlan(id).tier;

    setSubmittingPlan(plan);
    // Create session & redirect.
    createSessionMut.mutate({ planId: plan.id, interval: "month" });
  }

  function onUnsubscribeClick() {
    if (
      !currPlan ||
      auth.status !== "authenticated" ||
      submittingPlan ||
      unsubscribeMut.isLoading
    ) {
      return;
    }

    // TODO: Show modal.
    unsubscribeMut.mutate({ planId: currPlan.id });
  }

  return (
    /*TODO: Desc...*/
    <CombinedPage title={_(msg`Subscriptions`)}>
      <div className="mx-auto">
        <PricingPageHeader />
        <Spacer y={8} />
        <div className="flex flex-col sm:flex-row gap-6 justify-center">
          <PricingPlanCard
            onClick={onChoosePlanClick}
            onUnsubscribeClick={onUnsubscribeClick}
            currentPlan={currPlan}
            submittingPlan={submittingPlan}
            {...subscriptionPlans().free}
            gradient={"from-purple-500 via-purple-500 to-pink-500"}
          />
          <PricingPlanCard
            onClick={onChoosePlanClick}
            onUnsubscribeClick={onUnsubscribeClick}
            currentPlan={currPlan}
            submittingPlan={submittingPlan}
            {...subscriptionPlans().plus}
            gradient={"from-yellow-400 to-red-500"}
            glow={true}
          />
        </div>
      </div>
    </CombinedPage>
  );
};
