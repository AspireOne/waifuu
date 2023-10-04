import { ChatMessage } from "~/components/chat/ChatMessage";
import { Image } from "@nextui-org/react";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import useBotChat, { Message } from "~/hooks/useBotChat";
import { BotMode } from "@prisma/client";
import Page from "~/components/Page";
import Skeleton from "react-loading-skeleton";
import { SettingsDropdown } from "~/components/chat/SettingsDropdown";
import { ShareDropdown } from "~/components/chat/ShareDropdown";
import { useBot } from "~/hooks/useBot";
import ChatGradientOverlay from "~/components/chat/ChatGradientOverlay";
import { Bot, BotChatMessage } from "@prisma/client";
import ChatInput from "~/components/chat/ChatInput";
import { ChatTypingIndicator } from "~/components/chat/ChatTypingIndicator";
import React, { useEffect } from "react";
import { makeDownloadPath } from "~/utils/paths";

const BotChat = () => {
  const router = useRouter();

  const chatId = router.query["chatId"] as string;
  const mode = (router.query.mode as string | undefined)?.toUpperCase();

  const { data: bot } = useBot("", mode, router.isReady);
  const chat = useBotChat(chatId, true);

  function handleScrollChange() {
    if (window.scrollY === 0) chat.loadMore();
  }

  React.useEffect(() => {
    window.addEventListener("scroll", handleScrollChange);
    // TODO: When I add a return unsubscribe, it does not work.
    //return window.removeEventListener("scroll", handleScrollChange);
  }, []);

  return (
    <Page metaTitle={bot?.name || "Loading..."}>
      {/*TODO: Add background to bot.*/}
      <BackgroundImage src={undefined} />
      {/*TODO: Make character image only the png of the char.*/}
      <CharacterImage src={"/api/images/download?id=" + bot?.avatar} />
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

const BackgroundImage = (props: { src?: string }) => (
  <Image
    alt="background"
    loading="eager"
    src={props.src ?? "/assets/background.png"}
    // TODO: This is hidden for now since users will not upload transparent bot images
    className="fixed hidden left-0 top-0 h-full w-full object-cover"
    width={1920}
    height={1080}
  />
);

const CharacterImage = (props: { src: string }) => (
  <Image
    alt="background"
    loading="eager"
    src={props.src}
    className="fixed bottom-0 left-[50%] h-[800px] w-full max-w-[500px] translate-x-[-50%] object-cover"
    width={1920}
    height={1080}
  />
);

const ChatMessages = (props: {
  messages: Message[];
  loadingReply: boolean;
  loadingHistory?: boolean;
  bot?: Bot;
}) => {
  const { data: session } = useSession();
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
    <div
      ref={containerRef}
      className="flex flex-col gap-4 h-full overflow-scroll overflow-x-visible z-[30] mt-32 mb-20"
    >
      {props.messages.map((message, _) => {
        const botName = props.bot!.name || "Them";
        const userName = session?.user?.name || "You";
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
                : session?.user?.image,
            }}
            message={message.content}
          />
        );
      })}
      {props.loadingReply && <ChatTypingIndicator className={"z-[30]"} />}
      <div ref={lastMsgRef} />
    </div>
  );
};

export default BotChat;
