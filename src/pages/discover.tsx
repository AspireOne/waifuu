import Page from "@/components/Page";
import { useSession } from "@/hooks/useSession";
import { t, Trans } from "@lingui/macro";
import { DiscoverHeader } from "@components/DiscoverHeader";
import { ActiveChatsDiscoverCategory } from "src/components/ActiveChatsDiscoverCategory";
import { PopularCharactersDiscoverCategory } from "src/components/PopularCharactersDiscoverCategory";
import { ForumPostsDiscoverCategory } from "src/components/ForumPostsDiscoverCategory";
import { Spacer } from "@nextui-org/react";

const Discover = () => {
  const { user } = useSession();

  return (
    <Page title={t`Discover Characters`} showActionBar autoBack={false}>
      <DiscoverHeader />
      <Spacer y={14} />

      <div className="w-full mx-auto flex flex-col gap-16">
        <ActiveChatsDiscoverCategory />
        <PopularCharactersDiscoverCategory />
        <ForumPostsDiscoverCategory />
      </div>
    </Page>
  );
};

export default Discover;
