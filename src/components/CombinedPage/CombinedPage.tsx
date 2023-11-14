import { SessionStatus, useSession } from "@/providers/SessionProvider";
import * as React from "react";
import { PropsWithChildren, useEffect } from "react";
import { BasePage, PageProps } from "src/components/BasePage";

type Props = Pick<PageProps, "title" | "description" | "className" | "backPath" | "autoBack">;
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
  console.log(status);

  return (
    <BasePage
      unprotected={true}
      showActionBar={false}
      showHeader={status === "authenticated"}
      /*TODO: Show navbar*/
      title={props.title}
      description={props.description}
      className={props.className}
      backPath={props.backPath}
      autoBack={props.autoBack === undefined ? true : props.autoBack}
    >
      {/*TODO: Navbar*/}
      {props.children}
    </BasePage>
  );
};
