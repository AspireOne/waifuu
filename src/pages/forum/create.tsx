import { AppPage } from "@components/AppPage";
import { paths } from "@lib/paths";
import { Trans, t } from "@lingui/macro";
import { Button, Card, Input } from "@nextui-org/react";
import { useForm } from "react-hook-form";

export default () => {
  const { register } = useForm();

  return (
    <AppPage backPath={paths.forum} title="Create new forum post">
      <Card className="max-w-[600px] mx-auto">
        <form className="p-4 flex flex-col gap-3">
          <h2 className="text-xl">
            <Trans>Basic post info</Trans>
          </h2>
          <Input {...register("title")} label={t`Title`} />
          <Input {...register("category")} label={t`Category`} />

          <Button type="submit">{t`Create new post`}</Button>
        </form>
      </Card>
    </AppPage>
  );
};
