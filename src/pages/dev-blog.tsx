import Page from "@components/Page";
import { t } from "@lingui/macro";
import Title from "@components/ui/Title";

export default function DevBlog(props: {}) {
  return (
    <Page
      title={t`Blog`}
      showActionBar={true}
      showHeader={true}
      unprotected={true}
    >
      <Title>Some title</Title>
    </Page>
  );
}
