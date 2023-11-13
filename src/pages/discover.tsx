import { AppPage } from "@components/AppPage";
import { DiscoverHeader } from "@components/DiscoverHeader";
import { t } from "@lingui/macro";
import { Spacer } from "@nextui-org/react";
import { ActiveChatsDiscoverCategory } from "src/components/ActiveChatsDiscoverCategory";

import { CharsDiscoverCategory } from "src/components/CharsDiscoverCategory";

const Discover = () => {
  return (
    <AppPage title={t`Discover Characters`} topLevel>
      <DiscoverHeader />
      <Spacer y={14} />

      <div className="w-full mx-auto flex flex-col gap-16">
        <ActiveChatsDiscoverCategory />
        <CharsDiscoverCategory />
        {/*Comment it out for now - it is not done yet.*/}
        {/*<ForumPostsDiscoverCategory />*/}
      </div>
    </AppPage>
  );
};

export default Discover;
