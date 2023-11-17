import { useSession } from "@/providers/SessionProvider";
import { Plan, subscriptionPlans } from "@/server/shared/plans";
import { CombinedPage } from "@components/CombinedPage";
import { PricingPageHeader } from "@components/PricingPage/PricingPageHeader";
import { useCreateSessionMutation } from "@components/PricingPage/useCreateSessionMutation";
import { useUnsubscribeMutation } from "@components/PricingPage/useUnsubscribeMutation";
import { PricingPlanCard } from "@components/PricingPlanCard";
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

  const createSessionMut = useCreateSessionMutation(setSubmittingPlan);
  const unsubscribeMut = useUnsubscribeMutation();

  async function onChoosePlanClick(plan: Plan) {
    // Check if authed.
    if (auth.status === "unauthenticated") {
      await router.push(paths.login());
      return;
    }

    // Check if we CAN upgrade/downgrade.
    if (auth.user?.plan.id === plan.id || submittingPlan) return;

    // const downgrading = plan && plan.tier > getPlan(id).tier;

    setSubmittingPlan(plan);
    // Create session & redirect.
    createSessionMut.mutate({ planId: plan.id, interval: "month" });
  }

  function onUnsubscribeClick() {
    if (
      !auth.user?.planId ||
      auth.status !== "authenticated" ||
      submittingPlan ||
      unsubscribeMut.isLoading
    ) {
      return;
    }

    unsubscribeMut.mutate();
  }

  return (
    /*TODO: Desc...*/
    <CombinedPage
      title={_(msg`Subscriptions`)}
      backPath={auth.status === "authenticated" ? paths.discover : paths.index}
    >
      <div className="mx-auto">
        <PricingPageHeader />
        <Spacer y={8} />
        <div className="flex flex-col sm:flex-row gap-6 justify-center">
          <PricingPlanCard
            onClick={onChoosePlanClick}
            onUnsubscribeClick={onUnsubscribeClick}
            currentPlan={auth.user?.plan}
            submittingPlan={submittingPlan}
            {...subscriptionPlans().free}
            gradient={"from-purple-500 via-purple-500 to-pink-500"}
          />
          <PricingPlanCard
            onClick={onChoosePlanClick}
            onUnsubscribeClick={onUnsubscribeClick}
            currentPlan={auth.user?.plan}
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
