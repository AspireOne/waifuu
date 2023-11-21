import { Plan } from "@/server/shared/plans";
import { ButtonSection } from "@components/PricingPlanCard/ButtonSection";
import Title from "@components/ui/Title";
import { useCurrency } from "@hooks/useCurrency";
import { Trans, msg } from "@lingui/macro";
import { useLingui } from "@lingui/react";
import { Divider, Spacer } from "@nextui-org/react";
import { PlanId } from "@prisma/client";
import { IoIosCheckmarkCircle } from "react-icons/io";
import Skeleton from "react-loading-skeleton";
import { twMerge } from "tailwind-merge";

export const PricingPlanCard = (
  props: Plan & {
    gradient?: string;
    glow?: boolean;
    currentPlan?: Plan;
    submittingPlan?: Plan | null;
    onClick: (plan: Plan) => void;
    onUnsubscribeClick: () => void;
  },
) => {
  const { code, symbol } = useCurrency();
  const { _ } = useLingui();

  const price = code && props.price[code];
  const priceStr = code && _(msg`${price! + symbol!} / month`);
  const subscribed = props.currentPlan?.id === props.id;
  // biome-ignore format: off.
  const isDisabled = subscribed || !!props.submittingPlan || props.tier < (props.currentPlan?.tier ?? 0);
  const isLoading = props.submittingPlan?.id === props.id;

  function handleClick() {
    subscribed ? props.onUnsubscribeClick() : props.onClick(props);
  }

  function handleUnsubscribeClick() {
    props.onUnsubscribeClick();
  }

  return (
    <div
      className={twMerge(
        "rounded-lg p-[2px] bg-gradient-to-r w-full sm:w-[370px]",
        props.gradient,
      )}
    >
      <div
        className={twMerge(
          "flex flex-col p-5 bg-background h-full w-full rounded-lg",
          props.glow && "bg-black/90 shadow shadow-white",
        )}
      >
        <div className={"flex flex-row justify-between"}>
          <div>
            <Title as={"h2"} size={"md"} className="mb-0 tracking-tighter">
              {props.name}
            </Title>
            <p>{priceStr || <Skeleton width={80} />}</p>
          </div>
          {subscribed && (
            <p className={"text-primary-500"}>
              <Trans>Active</Trans>
            </p>
          )}
        </div>
        <Divider className={"my-4"} />

        <ul>
          {props.features.map((feature) => (
            <li key={feature} className={"flex flex-row gap-2 items-center"}>
              <IoIosCheckmarkCircle className={"text-green-500"} /> {feature}
            </li>
          ))}
        </ul>

        <Spacer y={4} />

        <ButtonSection
          isDisabled={isDisabled}
          isSubscribed={subscribed}
          isLoading={isLoading}
          handleClick={handleClick}
          handleUnsubscribeClick={handleUnsubscribeClick}
          unsubscribeAllowedToBeShown={props.id !== PlanId.SUBSCRIPTION_PLAN_FREE_V1}
        />
      </div>
    </div>
  );
};
