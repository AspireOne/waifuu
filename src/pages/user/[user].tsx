// public user profile page containing centered image, name, bio, link, and public characters.

import Page from "@/components/Page";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { api } from "@/lib/api";
import { paths } from "@/lib/paths";
import Header from "@/components/profile-page/Header";
import InfoCards from "@/components/profile-page/InfoCards";
import { useLingui } from "@lingui/react";
import { msg } from "@lingui/macro";

export default function UserProfile(props: { username?: string }) {
  const router = useRouter();
  const username = props.username || (router.query.user as string | undefined);
  const { _ } = useLingui();

  // Needed to make the gradient stay below other elements.
  return (
    <Page title={username || _(msg`Loading...`)} unprotected>
      <div
        className={
          "absolute left-0 right-0 top-0 z-[0] h-72 bg-gradient-to-b from-secondary-400/30 via-secondary-400/5"
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
      router.replace(paths.discover);
      return;
    }
  }, [username, user, router.isReady]);

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
