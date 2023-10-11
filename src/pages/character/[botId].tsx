import { useRouter } from "next/router";
import { api } from "~/utils/api";
import React, { useEffect } from "react";
import paths, { makeDownloadPath } from "~/utils/paths";
import Page from "~/components/Page";
import { Bot, BotMode } from "@prisma/client";
import Skeleton from "react-loading-skeleton";
import { Card, CardBody } from "@nextui-org/card";
import ChatSelectTabs from "~/components/chat/ChatSelectTabs";
import { Divider, Image } from "@nextui-org/react";

// Main page of the bot.
const ChatMainMenu = () => {
  const router = useRouter();
  const { botId } = router.query;

  const createBotChat = api.bots.createBotChat.useMutation({
    onSuccess(data) {
      router.push(paths.botChat(data.id, data.botId));
    },
  });
  const bot = api.bots.getBot.useQuery({ botId: botId as string });

  useEffect(() => {
    if (!bot.isLoading && !bot.data) {
      router.replace(paths.discover);
    }
  }, [bot.isLoading, bot.data]);

  const onSubmit = (type: BotMode) => {
    if (!bot.data?.id || typeof bot.data?.id !== "string") return;

    createBotChat.mutateAsync({
      botId: bot.data?.id,
      botMode: type,
    });
  };

  return (
    <Page
      title={
        bot.isLoading ? "Loading Character..." : `Chat with ${bot.data?.name}`
      }
      className={"space-y-12"}
    >
      <Card className="z-20">
        <Image
          removeWrapper
          isLoading={bot.isLoading}
          alt="Card example background"
          className="z-0 w-full h-36 scale-120 -translate-y-6 object-cover"
          src={makeDownloadPath(bot.data?.avatar)}
        />
        <CardBody>
          <p className="mt-2">
            {bot.data?.description ?? <Skeleton inline height={140} />}
          </p>
        </CardBody>

        <Divider className="mt-1 mb-5" />

        <ChatSelectTabs
          isLoading={createBotChat.isLoading}
          onSelect={onSubmit}
        />
      </Card>
    </Page>
  );
};

export default ChatMainMenu;
