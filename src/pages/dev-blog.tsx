import Page from "@components/Page";
import Title from "@components/ui/Title";
import { t } from "@lingui/macro";

export default function DevBlog() {
  return (
    <Page title={t`Blog`} showActionBar={true} showHeader={true} unprotected={true}>
      <Title>Some title</Title>
    </Page>
  );
}
