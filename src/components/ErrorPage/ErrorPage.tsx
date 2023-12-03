import { useSession } from "@/providers/SessionProvider";
import { CombinedPage } from "@components/CombinedPage";
import Title from "@components/ui/Title";
import { paths } from "@lib/paths";
import { Trans, msg } from "@lingui/macro";
import { useLingui } from "@lingui/react";
import { Button, Spacer } from "@nextui-org/react";
import { useEffect, useState } from "react";

export const ErrorPage = (props: { message?: string }) => {
  const { _ } = useLingui();
  const [href, setHref] = useState(paths.discover);
  const { status } = useSession();

  useEffect(() => {
    setHref(status === "unauthenticated" ? paths.index : paths.discover);
  }, [status]);

  function handleBack() {
    window.history.back();
  }

  return (
    /*TODO: Description*/
    <CombinedPage
      title={_(msg`Error`)}
      autoBack={false}
      backPath={href}
      description={"TODO: DESCRIPTION"}
    >
      <div
        className={
          "flex flex-col gap-1 items-center justify-center text-center w-full h-screen mx-auto md:max-w-[500px] lg:max-w-[700px]"
        }
      >
        <Title as={"h1"} className={"mb-0"}>
          <Trans>An error occurred :(</Trans>
        </Title>
        <p className={"text-foreground-500"}>
          {props.message ? (
            `${props.message?.substring(0, 100)}`
          ) : (
            <Trans>Unknown error</Trans>
          )}
        </p>
        <Spacer y={2} />
        <Button onClick={handleBack} href={href}>
          <Trans>Go back</Trans>
        </Button>
      </div>
    </CombinedPage>
  );
};
