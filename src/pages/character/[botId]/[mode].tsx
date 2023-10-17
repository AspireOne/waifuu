import { ChatMessage } from "~/components/bot-chat/ChatMessage";
import { Image, ScrollShadow } from "@nextui-org/react";
import { useRouter } from "next/router";
import useBotChat, { Message } from "~/hooks/useBotChat";
import Page from "~/components/Page";
import { useBot } from "~/hooks/useBot";
import ChatGradientOverlay from "~/components/bot-chat/ChatGradientOverlay";
import { Bot } from "@prisma/client";
import ChatInput from "~/components/bot-chat/ChatInput";
import { ChatTypingIndicator } from "~/components/bot-chat/ChatTypingIndicator";
import React, { useEffect, useMemo, useState } from "react";
import { useSession } from "~/hooks/useSession";
import { makeDownloadPath } from "~/utils/utils";

const BotChat = () => {
  const router = useRouter();

  const path = router.asPath.split("/");
  const chatId = path[path.length - 2] as string;
  const botId = path[path.length - 1] as string;

  const mode = (router.query.mode as string | undefined)?.toUpperCase();

  const { data: bot } = useBot(chatId, mode, router.isReady);
  const chat = useBotChat(chatId, router.isReady);

  function handleScrollChange() {
    if (window.scrollY === 0) chat.loadMore();
  }

  React.useEffect(() => {
    window.addEventListener("scroll", handleScrollChange);
    // TODO: When I add a return unsubscribe, it does not work.
    //return window.removeEventListener("scroll", handleScrollChange);
  }, []);

  return (
    <Page className="p-0" title={bot?.name || "Loading..."}>
      {/*TODO: Make character image only the png of the char.*/}

      {bot && <CharacterImage bot={bot} messages={chat.messages} />}
      <ChatGradientOverlay />
      <ChatMessages
        loadingReply={chat.loadingReply}
        loadingHistory={chat.loadingMore}
        bot={bot ?? undefined}
        messages={chat.messages}
      />

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

  const component = useMemo(
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

  return component;
};

const ChatMessages = (props: {
  messages: Message[];
  loadingReply: boolean;
  loadingHistory?: boolean;
  bot?: Bot;
}) => {
  const { user } = useSession();
  const lastMsgRef = React.useRef<HTMLDivElement>(null);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [scrollPosBeforeLoad, setScrollPosBeforeLoad] =
    React.useState<number>(0);
  const [deferredScrollFix, setDeferredScrollFix] =
    React.useState<boolean>(false);

  React.useEffect(() => {
    if (props.loadingHistory) {
      setScrollPosBeforeLoad(containerRef.current?.scrollHeight ?? 0);
    }
    if (deferredScrollFix) {
      setDeferredScrollFix(false);
      if (!containerRef.current) return;
      window.scrollTo(
        0,
        containerRef.current.scrollHeight - scrollPosBeforeLoad,
      );
    }
  }, [props.loadingHistory, deferredScrollFix]);

  useEffect(() => {
    if (!props.loadingHistory) setDeferredScrollFix(true);
  }, [props.loadingHistory]);

  // Scrolls to the latest message.
  React.useEffect(() => {
    const posY = window.scrollY;
    const maxY = document.body.scrollHeight - window.innerHeight;

    if (maxY - posY < 220) {
      lastMsgRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [props.messages]);

  if (!props.bot) return <div></div>;

  return (
    <ScrollShadow
      size={200}
      ref={containerRef}
      className="flex flex-col p-5 gap-5 h-[400px] w-full z-[30] overflow-scroll fixed bottom-14"
    >
      {props.messages.map((message, _) => {
        const botName = props.bot!.characterName || "Them";
        const userName = user?.name || "You";
        const isBot = message.role === "BOT";

        return (
          <ChatMessage
            className={"z-[10]"}
            key={message.id}
            author={{
              bot: isBot,
              name: isBot ? botName : userName,
              avatar: isBot
                ? makeDownloadPath(props.bot?.avatar!)
                : user?.image,
            }}
            message={message.content}
            mood={message.mood}
          />
        );
      })}

      {props.loadingReply && <ChatTypingIndicator className={"z-[30]"} />}
      <div ref={lastMsgRef} />
    </ScrollShadow>
  );
};

export default BotChat;
