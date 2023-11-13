import Title from "@components/ui/Title";
import { Trans } from "@lingui/macro";

export const PricingPageHeader = () => {
  return (
    <div className="flex flex-col items-center space-y-4 text-center">
      <Title className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl tracking-tighter mb-0">
        <Trans>Subscriptions</Trans>
      </Title>
      <p className="text-foreground-500 max-w-[700px] md:text-xl">
        <Trans>
          Ready to take it to the next level? Immerse yourself in a whole new world of
          imagination.
        </Trans>
      </p>
    </div>
  );
};
