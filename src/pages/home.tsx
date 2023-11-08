import { AppPage } from "@components/AppPage";
import { t } from "@lingui/macro";

export default function Home() {
  return (
    <AppPage title={t`Home`} topLevel>
      <div />
    </AppPage>
  );
}
