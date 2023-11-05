import useBotChat from "@hooks/useBotChat";
import { Bot } from "@prisma/client";
import { useSession } from "@contexts/SessionProvider";
import { useRef } from "react";
import { useLingui } from "@lingui/react";
import { Image, ScrollShadow } from "@nextui-org/react";
import { isUrl, makeDownloadPath } from "@lib/utils";
import { msg } from "@lingui/macro";
import { ChatMessage } from "@components/bot-chat/ChatMessage";
import { ChatTypingIndicator } from "@components/bot-chat/ChatTypingIndicator";
import { useLoadMore } from "@components/BotChatContent/useLoadMore";
import { useScrollToLatest } from "@components/BotChatContent/useScrollToLatest";
import { useFixLoadMoreScrollJitter } from "@components/BotChatContent/useFixLoadMoreScrollJitter";

export const BotChatContent = (props: {
  chat: ReturnType<typeof useBotChat>;
  bot?: Bot;
}) => {
  const bottomRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useLoadMore({ containerRef, chat: props.chat });
  useScrollToLatest({ containerRef, bottomRef, chat: props.chat });
  useFixLoadMoreScrollJitter({ containerRef, chat: props.chat });

  const chat = props.chat;

  if (!props.bot) return <div />;

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
          className="flex md:w-[500px] mx-auto flex-col p-5 gap-5 h-[400px] w-full z-[30] overflow-scroll overscroll-auto"
        >
          <Messages chat={chat} bot={props.bot} />

          {chat.loadingReply && <ChatTypingIndicator className={"z-[30]"} />}

          <div ref={bottomRef} />
        </ScrollShadow>
      </div>
    </div>
  );
};

const Messages = (props: {
  chat: ReturnType<typeof useBotChat>;
  bot?: Bot;
}) => {
  const { user } = useSession();
  const { _ } = useLingui();
  const { chat } = props;

  return chat.messages
    .sort((a, b) => a.id - b.id)
    .map((message) => {
      const botName = props.bot?.characterName || _(msg`Them`);
      const userName = user?.name || _(msg`You`);
      const isBot = message.role === "BOT";

      return (
        <ChatMessage
          id={message.id}
          key={message.id}
          className={"z-[10]"}
          author={{
            bot: isBot,
            name: isBot ? botName : userName,
            avatar: isBot ? makeDownloadPath(props.bot?.avatar!) : user?.image,
          }}
          message={message.content}
          mood={message.mood}
        />
      );
    });
};
