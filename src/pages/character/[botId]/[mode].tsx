import Page from "@/components/Page";
import ChatGradientOverlay from "@/components/bot-chat/ChatGradientOverlay";
import ChatInput from "@/components/bot-chat/ChatInput";
import { useBot } from "@/hooks/useBot";
import useBotChat, { Message } from "@/hooks/useBotChat";
import { BotChatContent } from "@components/BotChatContent";
import { makeDownloadPath } from "@lib/utils";
import { msg } from "@lingui/macro";
import { useLingui } from "@lingui/react";
import { Image } from "@nextui-org/react";
import { Bot } from "@prisma/client";
import { usePathname } from "next/navigation";
import { useMemo, useState } from "react";

/** This is the actual chat page (e.g. chat with Aqua on mode Roleplay). */
const BotChat = () => {
  const pathname = usePathname();
  const { _ } = useLingui();

  const chatId = pathname.split("/")[2] as string;

  const bot = useBot(chatId);
  const chat = useBotChat(chatId);

  return (
    <Page className="p-0" title={bot?.name || _(msg`Loading...`)}>
      {/*TODO: Make character image only the png of the char.*/}

      {bot && <CharacterImage bot={bot} messages={chat.messages} />}
      <ChatGradientOverlay />
      <BotChatContent chat={chat} bot={bot ?? undefined} />

      <div className="fixed bottom-0 left-0 right-0 p-3 z-30 bg-gradient-to-t from-black via-black/95 to-black/10">
        <ChatInput disabled={chat.loadingReply} onSend={chat.postMessage} />
      </div>
    </Page>
  );
};

const CharacterImage = ({
  bot,
  messages,
}: {
  bot: Bot;
  messages: Message[];
}) => {
  const [moodState, setMoodState] = useState<string | null>();

  const enumMoodValue = () => {
    if (!bot?.moodImagesEnabled) return null;

    const lastMessage = messages[messages.length - 1];
    if (!lastMessage) return null;

    switch (lastMessage.mood) {
      case "HAPPY":
        return bot.happyImageId;
      case "SAD":
        return bot.sadImageId;
      case "NEUTRAL":
        return bot.neutralImageId;
      case "BLUSHED":
        return bot.blushedImageId;
      default:
        return null;
    }
  };

  const getMoodId = () => {
    const value = enumMoodValue();
    if (!value && moodState) return moodState;

    setMoodState(value);
    if (!value) return bot.neutralImageId;
    return value;
  };

  return useMemo(
    () => (
      <Image
        alt="background"
        loading="eager"
        src={
          bot?.moodImagesEnabled
            ? makeDownloadPath(getMoodId() ?? "")
            : makeDownloadPath(bot?.avatar ?? "")
        }
        className="fixed bottom-0 left-[50%] h-[800px] w-full max-w-[500px] translate-x-[-50%] object-cover"
        width={1920}
        height={1080}
      />
    ),
    [bot, messages],
  );
};

export default BotChat;
