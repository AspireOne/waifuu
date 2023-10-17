import { useRouter } from "next/router";
import { api } from "~/lib/api";
import React, { useEffect } from "react";
import { paths } from "~/lib/paths";
import Page from "~/components/Page";
import { BotMode } from "@prisma/client";
import Skeleton from "react-loading-skeleton";
import { Card } from "@nextui-org/card";
import {
  Button,
  Image,
  Input,
  RadioGroup,
  Spacer,
  Textarea,
} from "@nextui-org/react";
import { CustomRadio } from "~/components/ui/CustomRadio";
import { useSession } from "~/hooks/useSession";
import { makeDownloadPath } from "~/utils/utils";

// Main page of the bot for creating new chats.
const ChatMainMenu = () => {
  const router = useRouter();
  const { botId } = router.query;
  const { user } = useSession();

  const createBotChat = api.bots.createBotChat.useMutation();
  const bot = api.bots.getBot.useQuery({ botId: botId as string });

  const [botMode, setBotMode] = React.useState<BotMode>(BotMode.CHAT);

  const onSubmit = () => {
    if (!bot.data || !bot.data?.id) return;

    createBotChat.mutateAsync(
      {
        botId: bot.data.id,
        botMode,
      },
      {
        onSuccess(data) {
          router.push(paths.botChat(data.id, bot.data?.id ?? ""));
        },
      },
    );
  };

  return (
    <Page
      title={
        bot.isLoading ? "Loading Character..." : `Chat with ${bot.data?.name}`
      }
      className={"space-y-12"}
    >
      <Card className="z-20">
        <div className="flex flex-col text-center gap-2 p-3">
          <Spacer y={2} />
          <Image
            removeWrapper
            isLoading={bot.isLoading}
            alt="Card example background"
            className="z-0 h-[90px] w-[90px] mx-auto scale-120 object-cover"
            height={90}
            width={90}
            src={makeDownloadPath(bot.data?.avatar ?? "/assets/background.png")}
          />
          <div>
            <div className="flex flex-col">
              <Spacer x={2} y={2} />

              <h1 className="title-2xl font-semibold">
                Starting chat with{" "}
                {bot.isLoading ? <Skeleton /> : bot.data?.name}
              </h1>
              <p className="text-gray-400">
                Select one of the available chat types
              </p>
            </div>
          </div>
        </div>

        <div className="p-3">
          <RadioGroup
            value={botMode}
            onValueChange={(value) => setBotMode(value as BotMode)}
            className="w-full"
          >
            <CustomRadio
              description="Classic chat experience, talk about your day, interests or try to make romantic partner!"
              value={BotMode.CHAT}
            >
              Chat
            </CustomRadio>
            <CustomRadio
              description="Go for a funny adventure like in the characters natural environment"
              value={BotMode.ADVENTURE}
            >
              Adventure
            </CustomRadio>
            <CustomRadio
              description="Roleplay with the character, feels just real!"
              value={BotMode.ROLEPLAY}
            >
              Roleplay
            </CustomRadio>
          </RadioGroup>

          <Spacer y={7} />

          <Textarea
            label="Your context"
            description="This is default context for bot, meaning they will remember everything you'll type here"
            defaultValue={user?.about ?? ""}
          />
        </div>

        <div className="p-3">
          <Button
            isLoading={createBotChat.isLoading}
            onClick={onSubmit}
            className="w-full"
          >
            Start the chat
          </Button>
        </div>
      </Card>
    </Page>
  );
};

export default ChatMainMenu;
