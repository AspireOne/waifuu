import { paths } from "@/lib/paths";
import { AppPage } from "@components/AppPage";
import ChatInput from "@components/bot-chat/ChatInput";
import Title from "@components/ui/Title";
import { api } from "@lib/api";
import { getPusherClient } from "@lib/pusherClient";
import { msg } from "@lingui/macro";
import { useLingui } from "@lingui/react";
import { Card, CardBody } from "@nextui-org/card";
import { Spinner } from "@nextui-org/spinner";
import { useSession } from "@providers/SessionProvider";
import { useEffect, useRef, useState } from "react";

type Message = {
  user: {
    id: string;
    username: string;
    avatar: string;
  };
  content: string;
  timestamp: string;
};

export default function RoleplayRoulette() {
  const { _ } = useLingui();
  return (
    <AppPage title={_(msg`Character Roulette`)} backPath={paths.RR}>
      <Chat />
    </AppPage>
  );
}

function Chat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [onlineUsers, setOnlineUsers] = useState(0);
  const [showLoading, setShowLoading] = useState(true);
  const bottomRef = useRef<HTMLDivElement>(null);
  const { user } = useSession();

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessageMutation = api.RRChat.sendMessage.useMutation({
    onSuccess: (data, variables, context) => {
      console.log("Message sent!");
    },
  });

  useEffect(() => {
    const connectToPusher = async () => {
      const pusher = await getPusherClient();

      const channel = pusher.subscribe("presence-global-chat");

      channel.bind("user-joined", (data: any) => {
        console.log(data);
        console.log("user joined");
        setOnlineUsers(data.count);
      });

      channel.bind("user-left", (data: { count: number }) => {
        setOnlineUsers(data.count);
      });

      channel.bind("message", (data: { from: string; message: Message }) => {
        console.log("A", data);
        setMessages((prevMessages) => {
          if (prevMessages.some((msg) => msg.timestamp === data.message.timestamp))
            return prevMessages;
          return [...prevMessages, data.message];
        });
      });

      setShowLoading(false);

      return () => {
        pusher.unsubscribe("presence-global-chat");
        pusher.disconnect();
      };
    };

    connectToPusher();
  }, []);

  async function handleSendMessage(message: string) {
    const pusher = await getPusherClient();

    const newMessage: Message = {
      user: {
        id: user?.id || "",
        username: user?.username || "",
        avatar: user?.image || "",
      },
      content: message,
      timestamp: new Date().toISOString(),
    };

    sendMessageMutation.mutate({ channel: "presence-global-chat", message: newMessage });
  }

  return (
    <div className="z-30 flex flex-col gap-8">
      {/*<Card className={"fixed left-2 right-2 z-30 text-center"}>
        <CardBody>
          <p>{onlineUsers} users online</p>
        </CardBody>
      </Card>*/}

      {showLoading && <LoadingScreen />}

      {!showLoading && (
        <div className={"flex flex-col gap-4"}>
          <Card className={"p-4"}>
            <Title size={"md"}>Welcome to the public chat!</Title>
            <p className={"text-lg"}>Here are the rules:</p>
            <ul className={"text-gray-300 my-2"}>
              <li>1. Behave yourself</li>
              <li>2. No NSFW content</li>
              <li>3. No spamming</li>
              <li>4. Be nice to each other!</li>
            </ul>
            <p className={"text-lg text-primary"}>Say hello!</p>
          </Card>
          <Messages data={messages} />
          <div ref={bottomRef} />
        </div>
      )}

      <div className="fixed bottom-0 left-0 right-0 p-3 z-30 bg-gradient-to-t from-black via-black/95 to-black/10">
        <ChatInput placeholder={"Send a message..."} onSend={handleSendMessage} />
      </div>
    </div>
  );
}

function Messages(props: { data: Message[] }) {
  return (
    <div className={"flex flex-col gap-4 mb-20 mt-28"}>
      {props.data.map((message, index) => (
        <Card key={message.timestamp}>
          <CardBody>
            <div className="flex items-center gap-2">
              <img
                src={message.user?.avatar}
                alt="User Avatar"
                className="w-8 h-8 rounded-full"
              />
              <p className="font-bold">{message.user.username}</p>
              <p className="text-gray-500 text-sm">
                {new Date(message.timestamp).toLocaleString()}
              </p>
            </div>
            <p>{message.content}</p>
          </CardBody>
        </Card>
      ))}
    </div>
  );
}

function LoadingScreen() {
  return (
    <div className={"flex justify-center h-[90dvh] items-center"}>
      <Spinner />
    </div>
  );
}
