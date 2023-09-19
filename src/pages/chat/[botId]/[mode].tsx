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
import ChatMessagesContainer from "~/components/chat/ChatMessagesContainer";
import { BotChatMessage } from ".prisma/client";
import ChatInput from "~/components/chat/ChatInput";

const BotChat = () => {
  // Data from URL.
  const router = useRouter();
  const botId = router.query.botId as string | undefined;
  const mode = (router.query.mode as string | undefined)?.toUpperCase();

  const { data: bot } = useBot(botId, mode, router.isReady);
  const chat = useBotChat(botId, mode as BotMode, router.isReady);

  const message: BotChatMessage = {
    id: 1,
    userId: "asdasd",
    botId: "asdasdasdas",
    botMode: "ADVENTURE",
    content: "Hello, I am a bot!",
    role: "BOT",
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  return (
    <Page protected={true} metaTitle={bot?.name || "Loading..."}>
      <BackgroundImage />
      <CharacterImage />
      <ChatGradientOverlay />

      <ChatHeader name={bot?.name} username={"@fauna_hot"} />

      <div className="fixed bottom-3 left-3 right-3 z-30 space-y-8">
        <ChatMessages
          loadingReply={true}
          messages={[
            message,
            message,
            message,
            message,
            message,
            message,
            message,
            message,
            message,
          ]}
          botName={bot?.name}
        />
        <ChatInput />
      </div>
    </Page>
  );
};

const BackgroundImage = () => (
  <Image
    alt="background"
    loading="eager"
    src={"/assets/background.png"}
    className="fixed left-0 top-0 h-full w-full object-cover"
    width={1920}
    height={1080}
  />
);

const CharacterImage = () => (
  <Image
    alt="background"
    loading="eager"
    src={"/assets/character.png"}
    className="fixed bottom-0 left-[50%] h-[800px] w-full max-w-[500px] translate-x-[-50%] object-cover"
    width={1920}
    height={1080}
  />
);

const ChatHeader = (props: { name?: string; username?: string }) => (
  <div className="fixed z-30 w-full">
    <div className="mx-auto mt-5 flex w-[75%] flex-row rounded-lg bg-black bg-opacity-80 p-3">
      <div>
        <Image
          height={50}
          width={50}
          loading="eager"
          src={"/assets/default_user.jpg"}
          alt="botavatar"
        />
      </div>

      <div className="ml-3">
        <h3 className="text-white">{props.name || <Skeleton />}</h3>
        <h6 className="text-gray-400">{props.username}</h6>
      </div>

      <div className="align-center mx-auto mr-2 flex flex-row gap-2">
        <SettingsDropdown />
        <ShareDropdown />
      </div>
    </div>
  </div>
);

const ChatMessages = (props: {
  messages: Message[];
  loadingReply: boolean;
  botName?: string;
}) => {
  const { data: session } = useSession();

  return (
    <ChatMessagesContainer typing={props.loadingReply}>
      {props.messages.map((message, index) => {
        const botName = props.botName || "Them";
        const userName = session?.user?.name || "You";

        return (
          <ChatMessage
            key={message.id}
            author={{
              bot: message.role === "BOT",
              name: message.role === "BOT" ? botName : userName,
              avatar: "/assets/default_user.jpg",
            }}
            message={message.content}
          />
        );
      })}
    </ChatMessagesContainer>
  );
};

export default BotChat;
