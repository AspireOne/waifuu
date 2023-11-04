import Page from "@/components/Page";
import { DiscoverHeader } from "@components/DiscoverHeader";
import { t } from "@lingui/macro";
import { Spacer } from "@nextui-org/react";
import { ActiveChatsDiscoverCategory } from "src/components/ActiveChatsDiscoverCategory";
import { ForumPostsDiscoverCategory } from "src/components/ForumPostsDiscoverCategory";
import { PopularCharactersDiscoverCategory } from "src/components/PopularCharactersDiscoverCategory";

const Discover = () => {
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
