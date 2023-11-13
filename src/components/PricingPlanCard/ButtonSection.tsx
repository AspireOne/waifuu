import { ConfirmationModal } from "@components/PricingPlanCard/ConfirmationModal";
import { Trans, msg } from "@lingui/macro";
import { useLingui } from "@lingui/react";
import { Button, useDisclosure } from "@nextui-org/react";

export const ButtonSection = (props: {
  handleClick: () => void;
  handleUnsubscribeClick: () => void;
  isLoading: boolean;
  isDisabled: boolean;
  isSubscribed: boolean;
  unsubscribeAllowedToBeShown: boolean;
}) => {
  const {
    handleClick,
    handleUnsubscribeClick,
    unsubscribeAllowedToBeShown,
    isDisabled,
    isLoading,
    isSubscribed,
  } = props;
  const { _ } = useLingui();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const buttonText = isSubscribed ? _(msg`Current Plan`) : _(msg`Upgrade Plan`);

  return (
    <div className={"flex flex-row gap-2 justify-center items-center mt-auto"}>
      {!isSubscribed && (
        <Button
          isDisabled={isDisabled}
          isLoading={isLoading}
          className={"mt-auto"}
          variant={"bordered"}
          onClick={handleClick}
        >
          <Trans>{buttonText}</Trans>
        </Button>
      )}
      <ConfirmationModal
        onClick={handleUnsubscribeClick}
        isOpen={isOpen}
        onOpenChange={onOpenChange}
      />
      {isSubscribed && unsubscribeAllowedToBeShown && (
        <Button
          onClick={onOpen}
          variant={"light"}
          size={"sm"}
          className={"text-foreground-600"}
        >
          <Trans>Unsubscribe</Trans>
        </Button>
      )}
    </div>
  );
};
