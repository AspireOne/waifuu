import { ChatMessage } from "~/components/chat/ChatMessage";
import { Image } from "@nextui-org/react";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import useBotChat, { Message } from "~/use-hooks/useBotChat";
import { BotMode } from "@prisma/client";
import Page from "~/components/Page";
import Skeleton from "react-loading-skeleton";
import { ShareDropdown } from "~/components/chat/ShareDropdown";
import { SettingsDropdown } from "~/components/chat/SettingsDropdown";
import { useBot } from "~/use-hooks/useBot";
import ChatGradientOverlay from "~/components/chat/ChatGradientOverlay";
import { Bot, BotChatMessage } from ".prisma/client";
import ChatInput from "~/components/chat/ChatInput";
import { ChatTypingIndicator } from "~/components/chat/ChatTypingIndicator";
import React, { useEffect } from "react";

const mockMessage: BotChatMessage = {
  id: 1,
  userId: "asdasd",
  botId: "asdasdasdas",
  botMode: "ADVENTURE",
  content: "Hello, I am a bot!",
  role: "BOT",
  createdAt: new Date(),
  updatedAt: new Date(),
};

const BotChat = () => {
  // Data from URL.
  const router = useRouter();
  const botId = router.query.botId as string | undefined;
  const mode = (router.query.mode as string | undefined)?.toUpperCase();

  const { data: bot } = useBot(botId, mode, router.isReady);
  const chat = useBotChat(botId, mode as BotMode, router.isReady);

  function handleScrollChange() {
    if (window.scrollY === 0) chat.loadMore();
  }

  React.useEffect(() => {
    window.addEventListener("scroll", handleScrollChange);
    // TODO: When I add a return unsubscribe, it does not work.
    //return window.removeEventListener("scroll", handleScrollChange);
  }, []);

  return (
    <Page protected={true} metaTitle={bot?.name || "Loading..."}>
      {/*TODO: Add background to bot.*/}
      <BackgroundImage src={undefined} />
      {/*TODO: Make character image only the png of the char.*/}
      <CharacterImage src={bot?.img ?? "/assets/character.png"} />
      <ChatGradientOverlay />

      <ChatHeader bot={bot ?? undefined} />

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
    className="fixed left-0 top-0 h-full w-full object-cover"
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

const ChatHeader = (props: { bot?: Bot }) => (
  <div className="fixed z-20 left-5 right-5 top-6 flex flex-row gap-3 rounded-lg bg-black/90 p-3 max-w-[500px] mx-auto">
    <Image
      height={50}
      width={50}
      className={"aspect-square"} // Needed.
      loading="eager"
      isLoading={!props.bot}
      src={props.bot?.img || "/assets/default_user.jpg"}
      alt="bot avatar"
    />

    <div className={"flex-1"}>
      <h3 className="">{props.bot?.name || <Skeleton width={"50%"} />}</h3>
      <h6 className="text-gray-400 line-clamp-1">
        {props.bot?.description || <Skeleton width={"80%"} />}
      </h6>
    </div>

    <div className="ml-auto flex flex-row gap-2">
      <SettingsDropdown />
      <ShareDropdown />
    </div>
  </div>
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
      {props.messages.map((message, index) => {
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
              avatar: isBot ? props.bot!.img : session?.user?.image,
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
