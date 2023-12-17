import { SessionStatus, useSession } from "@/providers/SessionProvider";
import { paths } from "@lib/paths";
import * as React from "react";
import { PropsWithChildren, useEffect } from "react";
import { BasePage, PageProps } from "src/components/BasePage";
import { PagePadding } from "src/components/PagePadding";

type Props = Pick<
  PageProps,
  "title" | "description" | "className" | "backPath" | "autoBack"
> & {
  disableXPadding?: boolean;
  disableYPadding?: boolean;
};
/**
 * A combination of public/app page
 * - Does NOT require authentication
 * - Shows navbar when user is NOT logged in, and app header when IS
 * - Does not show any app-specific things apart from the header (if user is logged in)
 * - Defines correct back button behavior
 * @param props
 * @constructor
 */
export const CombinedPage = (props: PropsWithChildren<Props>) => {
  const session = useSession();
  const [status, setStatus] = React.useState<SessionStatus>("loading");

  useEffect(() => {
    const update = async () => {
      const status =
        session.status === "loading" ? await session.getLastKnownStatus() : session.status;
      setStatus(status);
    };
    update();
  }, [session.status]);

  return (
    <BasePage
      title={props.title}
      description={props.description}
      className={props.className}
      unprotected={true}
      showActionBar={false}
      topBar={status === "authenticated" ? "app-header" : "navbar"}
      showFooter={status === "unauthenticated"}
      backPath={props.backPath || (props.backPath === null ? null : paths.discover)}
      autoBack={props.autoBack === undefined ? true : props.autoBack}
    >
      <PagePadding
        disableXPadding={props.disableXPadding}
        disableYPadding={props.disableYPadding}
      >
        {props.children}
      </PagePadding>
    </BasePage>
  );
};
