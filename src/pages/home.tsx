import Page from "@/components/Page";
import { t } from "@lingui/macro";

export default function Home() {
  return (
    <Page title={t`Home`} showActionBar autoBack={false}>
      <div />
    </Page>
  );
}
