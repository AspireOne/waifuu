// public user profile page containing centered image, name, bio, link, and public characters.

import { ErrorPage } from "@components/ErrorPage";

import Header from "@/components/profile-page/Header";
import InfoCards from "@/components/profile-page/InfoCards";
import { api } from "@/lib/api";
import { paths, semanticPaths } from "@/lib/paths";
import { CombinedPage } from "@components/CombinedPage";
import { msg } from "@lingui/macro";
import { useLingui } from "@lingui/react";
import { useRouter } from "next/router";
import { useEffect } from "react";

export default function UserProfile(props: { username?: string }) {
  const { _ } = useLingui();
  const router = useRouter();
  const username = props.username || (router.query.username as string | undefined);

  if (!username && router.isReady) {
    return <ErrorPage message={_(msg`No username specified`)} />;
  }

  // Needed to make the gradient stay below other elements.
  return (
    /*TODO: Description*/
    <CombinedPage
      backPath={semanticPaths.appIndex}
      title={username ?? _(msg`Loading..`)}
      description={""}
    >
      <div
        className={
          "absolute left-0 right-0 top-0 z-[0] h-72 bg-gradient-to-b from-primary-500/60 via-primary-500/20 to-transparent"
        }
      />
      <div className={"relative z-[1]"}>
        <Content username={username} />
      </div>
    </CombinedPage>
  );
}

function Content(props: { username?: string }) {
  const router = useRouter();
  const username = props.username;

  const { data: user, isLoading } = api.users.getPublic.useQuery(
    { username: username! },
    { enabled: !!username },
  );

  // If user does not exist, redirect.
  useEffect(() => {
    if (!isLoading && !user) {
      router.replace(paths.discover);
      return;
    }
  }, [user, isLoading, router]);

  return (
    <>
      <div className={"flex flex-col gap-4"}>
        <Header {...user} className={"mt-20"} />
        {/*TODO: Implement (when users can have stats).*/}
        {/*<Stats className={"mt-8"} />*/}
        <InfoCards username={username} />
      </div>
    </>
  );
}
