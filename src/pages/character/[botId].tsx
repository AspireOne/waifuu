import { useRouter } from "next/router";
import { api } from "~/utils/api";
import React, { useEffect } from "react";
import paths from "~/utils/paths";
import Page from "~/components/Page";
import { Button } from "@nextui-org/react";
import { Bot, BotMode } from "@prisma/client";
import Skeleton from "react-loading-skeleton";
import { Card, CardBody, CardHeader } from "@nextui-org/card";

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

  // TODO: Bot main menu.
  return (
    <Page metaTitle={bot.data?.name || "Loading..."} className={"space-y-12"}>
      <Header bot={bot.data ?? undefined} />
      <Card>
        <CardHeader>
          <h2 className={"text-xl font-semibold"}>Who is {bot.data?.name}?</h2>
        </CardHeader>
        <CardBody>
          <p>{bot.data?.description}</p>
        </CardBody>
      </Card>

      <Buttons botId={bot.data?.id} />
    </Page>
  );
};

function Header(props: { bot?: Bot }) {
  return (
    // TODO: A faded background image of the bot.
    <div className={"text-center"}>
      <h1 className={"text-3xl font-semibold line-clamp-2 my-auto"}>
        {props.bot?.name || <Skeleton inline />}
      </h1>
    </div>
  );
}

function Buttons(props: { botId?: string }) {
  // TODO: If chat is open.
  const router = useRouter();

  function handleClick(mode: BotMode) {
    if (!props.botId) {
      console.warn("Bot mode button clicked but bot ID has not been passed.");
      return;
    }

    router.push(paths.botChat(props.botId, mode));
  }

  return (
    <div className={"space-y-4 px-4"}>
      <ActionButton
        title={"Adventure"}
        onClick={() => handleClick(BotMode.ADVENTURE)}
      >
        (i) Your world, your story. You control the character, and you decide
        how the story will unfold.
      </ActionButton>
      <ActionButton
        title={"Roleplay"}
        onClick={() => handleClick(BotMode.ROLEPLAY)}
      >
        (i) Talk with the character as if you were there with them.
      </ActionButton>
      <ActionButton title={"Chat"} onClick={() => handleClick(BotMode.CHAT)}>
        (i) Casually chat with the character. Hey, how r u?
      </ActionButton>
    </div>
  );
}

function ActionButton(props: {
  children: string;
  title: string;
  onClick: () => void;
}) {
  return (
    <div className={"w-full"}>
      <Button
        className={"w-full mx-auto"}
        size={"lg"}
        variant={"solid"}
        color={"primary"}
        onClick={props.onClick}
      >
        {props.title}
      </Button>
      <p>{props.children}</p>
    </div>
  );
}

export default ChatMainMenu;
