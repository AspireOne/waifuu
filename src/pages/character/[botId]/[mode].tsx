import ChatGradientOverlay from "@/components/bot-chat/ChatGradientOverlay";
import ChatInput from "@/components/bot-chat/ChatInput";
import { useBot } from "@/hooks/useBot";
import useBotChat, { Message } from "@/hooks/useBotChat";
import { makeDownloadUrl } from "@/lib/utils";
import { AppHeaderCharSettingsButton } from "@components/AppHeaderCharSettingsButton";
import { AppPage } from "@components/AppPage";
import { BotChatContent } from "@components/BotChatContent";
import { api } from "@lib/api";
import { paths } from "@lib/paths";
import { msg } from "@lingui/macro";
import { useLingui } from "@lingui/react";
import { Image } from "@nextui-org/react";
import { Bot } from "@prisma/client";
import { useRouter } from "next/router";
import { useMemo } from "react";
import { twMerge } from "tailwind-merge";

/** This is the actual chat page (e.g. chat with Aqua on mode Roleplay). */
const BotChat = () => {
  const router = useRouter();
  const { _ } = useLingui();

  let chatId = router.asPath.split("/")[2] as string;
  // Workaround - it returns this for the first few render cycles before it renders the actual path.
  if (chatId === "[botId]") chatId = "";

  const bot = useBot(chatId);
  const chat = useBotChat(chatId);

  api.bots.markView.useQuery(
    { botId: bot?.id ?? "" },
    {
      enabled: !!bot?.id,
      cacheTime: Infinity,
      staleTime: Infinity,
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
    },
  );

  return (
    <AppPage
      backPath={paths.discover}
      noPadding={true}
      appHeaderEndContent={<AppHeaderCharSettingsButton />}
      title={bot?.name || _(msg`Loading...`)}
    >
      {/*TODO: Make character image only the png of the char.*/}

      {bot && <CharacterImage bot={bot} messages={chat.messages} />}
      <ChatGradientOverlay />
      <BotChatContent chat={chat} bot={bot} />

      <div className="fixed bottom-0 left-0 right-0 p-3 z-30 bg-gradient-to-t from-black via-black/95 to-black/10">
        <ChatInput disabled={chat.loadingReply} onSend={chat.postMessage} />
      </div>
    </AppPage>
  );
};

const CharacterImage = ({
  bot,
  messages,
}: {
  bot: Bot;
  messages: Message[];
}) => {
  const lastMsg = messages[messages.length - 1];
  const image = getMoodImageId(bot, lastMsg) ?? bot.characterImage;

  if (!image) {
    return <></>;
  }

  return useMemo(
    () => (
      <Image
        alt="character image"
        loading="eager"
        src={makeDownloadUrl(bot.characterImage)}
        className={twMerge(
          "animation-slide-fade fixed object-cover",
          "bottom-0 h-[90%]", // set height
          "w-auto", // set width
          "left-0 right-0 mx-auto", // center it horizontally
        )}
        width={1920}
        height={1080}
      />
    ),
    [bot, messages],
  );
};

const getMoodImageId = (bot: Bot, message?: Message): string | null => {
  if (!message || !message.mood || !bot.moodImagesEnabled) return null;

  switch (message.mood) {
    case "HAPPY":
      return bot.happyImageId;
    case "SAD":
      return bot.sadImageId;
    case "NEUTRAL":
      return bot.neutralImageId;
    case "BLUSHED":
      return bot.blushedImageId;
    default:
      return bot.neutralImageId;
  }
};

export default BotChat;
