import { CombinedPage } from "@components/CombinedPage";
import Title from "@components/ui/Title";
import { useSession } from "@contexts/SessionProvider";
import { paths } from "@lib/paths";
import { Trans, msg } from "@lingui/macro";
import { useLingui } from "@lingui/react";
import { Button } from "@nextui-org/react";
import { useEffect, useState } from "react";

export const ErrorPage = (props: { message?: string }) => {
  const { _ } = useLingui();
  const [href, setHref] = useState(paths.discover);
  const { status } = useSession();

  useEffect(() => {
    setHref(status === "unauthenticated" ? paths.index : paths.discover);
  }, [status]);

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
          "flex flex-col items-center justify-center w-full h-screen text-center md:max-w-[500px] lg:max-w-[700px]"
        }
      >
        <Title as={"h1"}>
          {props.message
            ? `${_(msg`Error`)}: ${props.message?.substring(0, 100)}`
            : _(msg`Unknown error`)}
        </Title>
        <Button href={href}>
          <Trans>Go back</Trans>
        </Button>
        <p className={"text-lg"}>{_(msg`An error occurred.`)}</p>
      </div>
    </CombinedPage>
  );
};
