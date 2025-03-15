import {AppPage} from "@components/AppPage";
import {DiscoverHeader} from "@components/DiscoverHeader";
import {Trans, t} from "@lingui/macro";
import {Button, Spacer} from "@nextui-org/react";
import {ActiveChatsDiscoverCategory} from "src/components/ActiveChatsDiscoverCategory";

import {CharsDiscoverCategory} from "src/components/CharsDiscoverCategory";

import {AppHeaderCharSettingsButton} from "@components/AppHeaderCharSettingsButton";
import {MyCharactersDiscoverCategory} from "@components/MyCharactersDiscoverCategory";
import {usePersistedScrollPositionHandler} from "@hooks/usePersistedScrollPositionHandler";
import {paths} from "@lib/paths";
import {Card, CardBody} from "@nextui-org/card";
import Link from "next/link";
import {IoWarning} from "react-icons/io5";

const Discover = () => {
  usePersistedScrollPositionHandler();

  return (
    <AppPage
      appHeaderEndContent={<AppHeaderCharSettingsButton/>}
      backPath={null}
      title={t`Discover Characters`}
      topLevel
    >
      <DiscoverHeader className={"h-[200px]"}/>
      <Spacer className={"h-[210px] lg:h-[150px]"}/>

      <div className="w-full mx-auto flex flex-col gap-16">
        <Card className={"bg-warning-400/50 -mb-8"}>
          <CardBody>
            <div className="flex items-center gap-2">
              <IoWarning size={24} className="text-warning-600"/>
              <p><b>Waifuu has been sunset</b> and is now in a maintanance mode with limited functionality. Some parts of the app may not work. Thank you for support!</p>
            </div>
          </CardBody>
        </Card>

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
              <ActiveChatsDiscoverCategory/>
            </CardBody>
          </Card>
          <Spacer y={5}/>
          <Card className={"w-full"}>
            <CardBody>
              <MyCharactersDiscoverCategory/>
            </CardBody>
          </Card>
        </div>

        {/*<Divider className={"my-16"}/>*/}
        <CharsDiscoverCategory/>
        {/*Comment it out for now - it is not done yet.*/}
        {/*<ForumPostsDiscoverCategory />*/}
      </div>
    </AppPage>
  );
};

export default Discover;
