import Page from "@/components/Page";
import { DiscoverHeader } from "@components/DiscoverHeader";
import { t } from "@lingui/macro";
import { Spacer } from "@nextui-org/react";
import { ActiveChatsDiscoverCategory } from "src/components/ActiveChatsDiscoverCategory";

import { PopularCharactersDiscoverCategory } from "src/components/PopularCharactersDiscoverCategory";

const Discover = () => {
  return (
    <Page title={t`Discover Characters`} showActionBar autoBack={false}>
      <DiscoverHeader />
      <Spacer y={14} />

      <div className="w-full mx-auto flex flex-col gap-16">
        <ActiveChatsDiscoverCategory />
        <PopularCharactersDiscoverCategory />
        {/*Comment it out for now - it is not done yet.*/}
        {/*<ForumPostsDiscoverCategory />*/}
      </div>
    </Page>
  );
};

export default Discover;
