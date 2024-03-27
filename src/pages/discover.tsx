import { AppPage } from "@components/AppPage";
import { DiscoverHeader } from "@components/DiscoverHeader";
import { Trans, t } from "@lingui/macro";
import { Button, Spacer } from "@nextui-org/react";
import { ActiveChatsDiscoverCategory } from "src/components/ActiveChatsDiscoverCategory";

import { CharsDiscoverCategory } from "src/components/CharsDiscoverCategory";

import { ForumPostsDiscoverCategory } from "@/components/ForumPostsDiscoverCategory";
import { AppHeaderCharSettingsButton } from "@components/AppHeaderCharSettingsButton";
import { MyCharactersDiscoverCategory } from "@components/MyCharactersDiscoverCategory";
import { usePersistedScrollPositionHandler } from "@hooks/usePersistedScrollPositionHandler";
import { paths } from "@lib/paths";
import { Card, CardBody } from "@nextui-org/card";
import Link from "next/link";

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
        <div className={"grid sm:flex grid-cols-2 gap-4"}>
          <Link href={paths.friends}>
            <Button color={"primary"} variant={"bordered"} className={"w-full sm:w-[130px]"}>
              <Trans>Friends</Trans>
            </Button>
          </Link>

          <Link href={paths.publicChat}>
            <Button color={"primary"} variant={"bordered"} className={"w-full sm:w-[130px]"}>
              <Trans>Public Chat</Trans>
            </Button>
          </Link>
        </div>

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

        <CharsDiscoverCategory />
        <ForumPostsDiscoverCategory />
      </div>
    </AppPage>
  );
};

export default Discover;
