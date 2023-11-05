import Page from "@components/Page";
import Title from "@components/ui/Title";
import { useSession } from "@contexts/SessionProvider";
import { paths } from "@lib/paths";
import { Trans, msg } from "@lingui/macro";
import { useLingui } from "@lingui/react";
import { Button } from "@nextui-org/react";
import { useEffect, useState } from "react";

export function ErrorPage(props: { message?: string }) {
  const { _ } = useLingui();
  const [href, setHref] = useState(paths.discover);
  const { status } = useSession();

  useEffect(() => {
    setHref(status === "unauthenticated" ? paths.index : paths.discover);
  }, [status]);

  return (
    <Page unprotected title={_(msg`Error`)}>
      <div
        className={
          "flex flex-col items-center justify-center w-full h-screen text-center md:max-w-[500px] lg:max-w-[700px]"
        }
      >
        <Title as={"h1"}>
          {_(msg`Error`)}: {props.message}
        </Title>
        <Button href={href}>
          <Trans>Go back</Trans>
        </Button>
        <p className={"text-lg"}>{_(msg`An error occurred.`)}</p>
      </div>
    </Page>
  );
}
