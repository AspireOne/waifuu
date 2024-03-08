import { AppPage } from "@components/AppPage";
import { DiscoverHeader } from "@components/DiscoverHeader";
import { t } from "@lingui/macro";
import { Spacer } from "@nextui-org/react";
import { ActiveChatsDiscoverCategory } from "src/components/ActiveChatsDiscoverCategory";

import { CharsDiscoverCategory } from "src/components/CharsDiscoverCategory";

import { AppHeaderCharSettingsButton } from "@components/AppHeaderCharSettingsButton";
import { MyCharactersDiscoverCategory } from "@components/MyCharactersDiscoverCategory";
import { usePersistedScrollPositionHandler } from "@hooks/usePersistedScrollPositionHandler";
import { Card, CardBody } from "@nextui-org/card";

const Discover = () => {
  usePersistedScrollPositionHandler();

  return (
    <AppPage
      appHeaderEndContent={<AppHeaderCharSettingsButton />}
      backPath={null}
      title={t`Discover Characters`}
      topLevel
    >
      <DiscoverHeader className={"h-[200px]"} />
      <Spacer className={"h-[210px] lg:h-[150px]"} />

      <div className="w-full mx-auto flex flex-col gap-16">
        <div className={"lg:flex-row-reverse lg:flex gap-4"}>
          <Card className={"w-full"}>
            <CardBody>
              <ActiveChatsDiscoverCategory />
            </CardBody>
          </Card>
          <Spacer y={5} />
          <Card className={"w-full"}>
            <CardBody>
              <MyCharactersDiscoverCategory />
            </CardBody>
          </Card>
        </div>

        {/*<Divider className={"my-16"}/>*/}
        <CharsDiscoverCategory />
        {/*Comment it out for now - it is not done yet.*/}
        {/*<ForumPostsDiscoverCategory />*/}
      </div>
    </AppPage>
  );
};

export default Discover;
