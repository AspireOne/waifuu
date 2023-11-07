import { PublicPage } from "@components/PublicPage";
import Title from "@components/ui/Title";
import { t } from "@lingui/macro";

export default function DevBlog() {
  return (
    <PublicPage title={t`Blog`} description={""}>
      <Title>Some title</Title>
    </PublicPage>
  );
}
