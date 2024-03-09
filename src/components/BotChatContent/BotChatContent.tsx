import { useSession } from "@/providers/SessionProvider";
import { MessageSelection } from "@components/BotChatContent/MessageSelection";
import { useFixLoadMoreScrollJitter } from "@components/BotChatContent/useFixLoadMoreScrollJitter";
import { useLoadMore } from "@components/BotChatContent/useLoadMore";
import { useScrollToLatest } from "@components/BotChatContent/useScrollToLatest";
import { ChatMessage } from "@components/bot-chat/ChatMessage";
import { ChatTypingIndicator } from "@components/bot-chat/ChatTypingIndicator";
import Title from "@components/ui/Title";
import useBotChat from "@hooks/useBotChat";
import { makeDownloadUrl } from "@lib/utils";
import { Button, Image, ScrollShadow } from "@nextui-org/react";
import { Tooltip } from "@nextui-org/tooltip";
import { Bot } from "@prisma/client";
import { atom, useAtom } from "jotai";
import { useRef } from "react";
import { IoCloseOutline } from "react-icons/io5";

export const selectedMessagesAtom = atom<number[]>([]);

export const BotChatContent = (props: {
  chat: ReturnType<typeof useBotChat>;
  bot?: Bot;
}) => {
  const bottomRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useLoadMore({ containerRef, chat: props.chat });
  useScrollToLatest({ containerRef, bottomRef, chat: props.chat });
  useFixLoadMoreScrollJitter({ containerRef, chat: props.chat });

  const [selectedMessages] = useAtom(selectedMessagesAtom);

  const chat = props.chat;

  if (!props.bot) return <div />;

  return (
    <div className={"relative"}>
      <Image
        className="z-0 w-full h-full object-cover fixed top-0"
        src={makeDownloadUrl(props.bot.backgroundImage)}
      />

      {selectedMessages.length > 0 && <SelectionToolbar />}

      <div className="fixed left-0 bottom-14 md:w-full z-30">
        <ScrollShadow
          size={90}
          offset={-5} // fixes the shadow being cut off.
          ref={containerRef}
          className="flex md:w-[500px] mx-auto flex-col p-5 gap-5 h-[430px] w-full z-[30] overflow-scroll overscroll-auto pt-10 no-scrollbar"
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
  bot: Bot;
}) => {
  const { user } = useSession();
  const { chat } = props;

  const [selectedMessages, setSelectedMessages] = useAtom(selectedMessagesAtom);

  const handleSelectionChange = (selectedMessages: number[]) => {
    console.log(selectedMessages);
    setSelectedMessages(selectedMessages);
  };

  return (
    <MessageSelection onSelectionChange={handleSelectionChange}>
      {chat.messages
        .sort((a, b) => a.id - b.id)
        .map((message) => {
          const isBot = message.role === "BOT";
          const username = user?.name ?? "";

          return (
            <ChatMessage
              messageId={message.id}
              chatId={chat.id}
              key={message.id}
              className={"z-[10] my-2"}
              author={{
                bot: isBot,
                name: isBot ? props.bot.name : username,
                avatar: isBot ? makeDownloadUrl(props.bot.avatar) : user?.image,
              }}
              message={message.content}
              mood={message.mood}
            />
          );
        })}
    </MessageSelection>
  );
};

function SelectionToolbar() {
  const [selectedMessages, setSelectedMessages] = useAtom(selectedMessagesAtom);

  const handleDeselect = () => {
    setSelectedMessages([]);
  };

  const handleExport = () => {
    // Export logic here
    console.log("Exporting selected messages:", selectedMessages);
  };

  return (
    <div className="fixed left-0 right-0 bottom-0 z-50 mx-auto p-3 flex items-center justify-between bg-content1 shadow">
      <Title size={"sm"} as={"p"} className={"m-0"}>
        Selected {selectedMessages.length}{" "}
        {selectedMessages.length === 1 ? "message" : "messages"}
      </Title>
      <div className={"flex flex-row gap-4"}>
        <Tooltip content={"Deselect"}>
          <button onClick={handleDeselect}>
            <IoCloseOutline className={""} size={"38px"} />
          </button>
        </Tooltip>
        <Button color={"secondary"} onClick={handleExport}>
          Export
        </Button>
      </div>
    </div>
  );
}
