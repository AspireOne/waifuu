import { ChatMessage } from "@/components/bot-chat/ChatMessage";
import { Image, ScrollShadow } from "@nextui-org/react";
import { useRouter } from "next/router";
import useBotChat, { Message } from "@/hooks/useBotChat";
import Page from "@/components/Page";
import { useBot } from "@/hooks/useBot";
import ChatGradientOverlay from "@/components/bot-chat/ChatGradientOverlay";
import { Bot } from "@prisma/client";
import ChatInput from "@/components/bot-chat/ChatInput";
import { ChatTypingIndicator } from "@/components/bot-chat/ChatTypingIndicator";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useSession } from "@/hooks/useSession";
import { isUrl, makeDownloadPath } from "@lib/utils";
import { useLingui } from "@lingui/react";
import { msg } from "@lingui/macro";

const BotChat = () => {
  const router = useRouter();
  const { _ } = useLingui();
  const session = useSession();

  const path = router.asPath.split("/");
  const chatId = path[path.length - 2] as string;
  const botId = path[path.length - 1] as string;

  const mode = (router.query.mode as string | undefined)?.toUpperCase();

  const { data: bot } = useBot(
    chatId,
    mode,
    router.isReady && session.status === "authenticated",
  );
  const chat = useBotChat(
    chatId,
    router.isReady && session.status === "authenticated",
  );

  function handleScrollChange() {
    if (window.scrollY === 0) chat.loadMore();
  }

  React.useEffect(() => {
    window.addEventListener("scroll", handleScrollChange);
    // TODO: When I add a return unsubscribe, it does not work.
    //return window.removeEventListener("scroll", handleScrollChange);
  }, []);

  return (
    <Page className="p-0" title={bot?.name || _(msg`Loading...`)}>
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

const ChatMessages = (props: {
  messages: Message[];
  loadingReply: boolean;
  loadingHistory?: boolean;
  bot?: Bot;
}) => {
  const { user } = useSession();
  const lastMsgRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollPosBeforeLoad, setScrollPosBeforeLoad] = useState<number>(0);
  const [deferredScrollFix, setDeferredScrollFix] = useState<boolean>(false);
  const { _ } = useLingui();

  useEffect(() => {
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
  useEffect(() => {
    const posY = window.scrollY;
    const maxY = document.body.scrollHeight - window.innerHeight;

    if (maxY - posY < 220) {
      lastMsgRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [props.messages]);

  if (!props.bot) return <div></div>;

  return (
    <div>
      <Image
        className="z-0 w-full h-full object-cover fixed top-0"
        src={
          isUrl(props.bot.backgroundImage ?? "")
            ? (props.bot.backgroundImage as string)
            : makeDownloadPath(props.bot.backgroundImage as string)
        }
      />

      <div className="fixed left-0 bottom-14 md:w-full z-30">
        <ScrollShadow
          size={200}
          ref={containerRef}
          className="flex md:w-[500px] mx-auto flex-col p-5 gap-5 h-[400px] w-full z-[30] overflow-scroll"
        >
          {props.messages.map((message, index) => {
            const botName = props.bot!.characterName || _(msg`Them`);
            const userName = user?.name || _(msg`You`);
            const isBot = message.role === "BOT";

            return (
              <ChatMessage
                key={index}
                className={"z-[10]"}
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
      </div>
    </div>
  );
};

export default BotChat;
