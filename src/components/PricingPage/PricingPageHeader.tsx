import { Trans } from "@lingui/macro";
import { PageDescription } from "src/components/PageDescription";
import { PageTitle } from "src/components/PageTitle";

export const PricingPageHeader = () => {
  return (
    <div className="flex flex-col items-center text-center">
      <PageTitle>
        <Trans>Subscriptions</Trans>
      </PageTitle>
      <PageDescription>
        <Trans>
          Ready to take it to the next level? Immerse yourself in a whole new world of
          imagination.
        </Trans>
      </PageDescription>
    </div>
  );
};
