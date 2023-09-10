// public user profile page containing centered image, name, bio, link, and public characters.

import Page from "~/components/Page";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { api } from "~/utils/api";
import paths from "~/utils/paths";
import Header from "~/components/profile-page/Header";
import InfoCards from "~/components/profile-page/InfoCards";

export default function UserProfile() {
  const router = useRouter();
  const username = router.query.user as string | undefined;

  // Needed to make the gradient stay below other elements.
  return (
    <Page metaTitle={username || "Loading..."}>
      <div
        className={
          "absolute left-0 right-0 top-0 z-[0] h-64 bg-gradient-to-b from-[#292935]"
        }
      ></div>
      <div className={"relative z-[1]"}>
        <Content username={username} />
      </div>
    </Page>
  );
}

function Content(props: { username?: string }) {
  const router = useRouter();
  const username = props.username;

  const {
    data: user,
    isLoading,
    isInitialLoading,
  } = api.users.getPublic.useQuery(
    { username: username! },
    { enabled: !!username },
  );

  // If user does not exist, redirect.
  useEffect(() => {
    if (!isLoading && !user) {
      // TODO: Remove it from history.
      router.replace(paths.discover);
      // remove it from history.

      return;
    }
  }, [username, user, router.isReady]);

  return (
    <>
      <div className={"flex flex-col gap-4"}>
        <Header {...user} className={"mt-20"} />
        {/*<Stats className={"mt-8"} />*/}
        <InfoCards username={username} />
      </div>
    </>
  );
}
