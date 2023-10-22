import { useRouter } from "next/router";
import { api } from "@/lib/api";
import React from "react";
import { paths } from "@/lib/paths";
import Page from "@/components/Page";
import { BotMode } from "@prisma/client";
import Skeleton from "react-loading-skeleton";
import { Card } from "@nextui-org/card";
import { Button, Image, RadioGroup, Spacer, Textarea } from "@nextui-org/react";
import { CustomRadio } from "@/components/ui/CustomRadio";
import { useSession } from "@/hooks/useSession";
import { makeDownloadPath } from "@/utils/utils";
import { useLingui } from "@lingui/react";
import { msg, Trans } from "@lingui/macro";

// Main page of the bot for creating new chats.
const ChatMainMenu = () => {
  const router = useRouter();
  const { botId } = router.query;
  const { user } = useSession();
  const { _ } = useLingui();

  const createBotChat = api.bots.createBotChat.useMutation({
    onSuccess: (data) => {
      router.push(paths.botChat(data.id, bot.data?.id ?? ""));
    },
  });
  const bot = api.bots.getBot.useQuery({ botId: botId as string });

  const [botMode, setBotMode] = React.useState<BotMode>(BotMode.CHAT);

  const onSubmit = () => {
    if (!bot.data || !bot.data?.id) return;

    createBotChat.mutate({
      botId: bot.data.id,
      botMode,
    });
  };

  return (
    <Page
      title={
        bot.isLoading ? _(msg`Loading...`) : _(msg`Chat with ${bot.data?.name}`)
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
                <Trans>
                  Starting chat with{" "}
                  {bot.isLoading ? <Skeleton /> : bot.data?.name}
                </Trans>
              </h1>
              <p className="text-gray-400">
                <Trans>Select one of the available experiences</Trans>
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
              description={_(
                msg`Classic chat experience, talk about your day, interests, or try to make a romantic partner!`,
              )}
              value={BotMode.CHAT}
            >
              <Trans>Chat</Trans>
            </CustomRadio>
            <CustomRadio
              description={_(
                msg`Adventure-style game. Let the character guide you through the story!`,
              )}
              value={BotMode.ADVENTURE}
            >
              <Trans>Adventure</Trans>
            </CustomRadio>
            <CustomRadio
              description={_(
                msg`Roleplay with the character, feels just real!`,
              )}
              value={BotMode.ROLEPLAY}
            >
              <Trans>Roleplay</Trans>
            </CustomRadio>
          </RadioGroup>

          <Spacer y={7} />

          <Textarea
            label={_(`Your context`)}
            description={_(
              `This is the default context for the character - they will remember everything you'll type here.`,
            )}
            defaultValue={user?.about ?? ""}
          />
        </div>

        <div className="p-3">
          <Button
            isLoading={createBotChat.isLoading}
            onClick={onSubmit}
            className="w-full"
          >
            <Trans>Start the chat</Trans>
          </Button>
        </div>
      </Card>
    </Page>
  );
};

export default ChatMainMenu;
