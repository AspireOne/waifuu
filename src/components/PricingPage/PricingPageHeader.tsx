import { PageTitle } from "@components/LargeTitle";
import { PageDescription } from "@components/PageTitleDescription";
import { Trans } from "@lingui/macro";

export const PricingPageHeader = () => {
  return (
    <div className="flex flex-col items-center space-y-4 text-center">
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
