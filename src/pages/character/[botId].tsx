import { useRouter } from "next/router";
import { api } from "~/utils/api";
import React, { useEffect } from "react";
import paths from "~/utils/paths";
import Page from "~/components/Page";
import { Bot, BotMode } from "@prisma/client";
import Skeleton from "react-loading-skeleton";
import { Card, CardBody } from "@nextui-org/card";
import ChatSelectTabs from "~/components/chat/ChatSelectTabs";
import { Divider, Image } from "@nextui-org/react";

// Main page of the bot.
const ChatMainMenu = () => {
  const router = useRouter();
  const { botId, mode } = router.query;

  const bot = api.bots.getBot.useQuery({ botId: botId as string });

  useEffect(() => {
    if (!bot.isLoading && !bot.data) {
      router.replace(paths.discover);
    }
  }, [bot.isLoading, bot.data]);

  function handleClick(mode: BotMode) {
    if (!botId) {
      console.warn("Bot mode button clicked but bot ID has not been passed.");
      return;
    }

    router.push(paths.botChat(botId as string, mode));
  }

  // TODO: Bot main menu.

  if (bot.isLoading) {
    return (
      <Page metaTitle={"Loading Character..."}>
        <Skeleton height={100} />
        <Skeleton height={280} />
        <Skeleton height={200} />
      </Page>
    );
  }
  return (
    <Page
      metaTitle={`Chat with ${bot.data?.name}` || "Loading..."}
      className={"space-y-12"}
    >
      {/*<Header bot={bot.data ?? undefined} />*/}
      <Card className="z-20">
        <Image
          removeWrapper
          alt="Card example background"
          className="z-0 w-full h-36 scale-120 -translate-y-6 object-cover"
          src="/assets/background.png"
        />
        <CardBody>
          <p className="mt-2">{bot.data?.description}</p>
        </CardBody>

        <Divider className="mt-1 mb-5" />

        <ChatSelectTabs onSelect={handleClick} />
      </Card>
    </Page>
  );
};

const Header = (props: { bot?: Bot }) => {
  return (
    // TODO: A faded background image of the bot.
    <div className={"text-center"}>
      <h1 className={"text-3xl font-semibold line-clamp-2 my-auto"}>
        {props.bot?.name || <Skeleton inline />}
      </h1>
    </div>
  );
};

export default ChatMainMenu;
