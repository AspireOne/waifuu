import {paths} from "@/lib/paths";
import {AppPage} from "@components/AppPage";
import {UserProfileModal} from "@components/UserProfileModal";
import ChatInput from "@components/bot-chat/ChatInput";
import Title from "@components/ui/Title";
import {api} from "@lib/api";
import {getPusherClient} from "@lib/pusherClient";
import {msg} from "@lingui/macro";
import {useLingui} from "@lingui/react";
import {Card, CardBody} from "@nextui-org/card";
import {Avatar, Divider} from "@nextui-org/react";
import {Spinner} from "@nextui-org/spinner";
import {useSession} from "@providers/SessionProvider";
import {useEffect, useRef, useState} from "react";
import {BiSolidError} from "react-icons/bi";

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
  const {_} = useLingui();
  return (
    <AppPage title={_(msg`Public Chat`)} backPath={paths.discover}>
      <Chat/>
    </AppPage>
  );
}

function Chat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [onlineUsers, setOnlineUsers] = useState(0);
  const [showLoading, setShowLoading] = useState(true);
  const bottomRef = useRef<HTMLDivElement>(null);
  const {user} = useSession();

  useEffect(() => {
    bottomRef.current?.scrollIntoView({behavior: "smooth"});
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
    const newMessage: Message = {
      user: {
        id: user?.id || "",
        username: user?.username || "",
        avatar: user?.image || "",
      },
      content: message,
      timestamp: new Date().toISOString(),
    };

    sendMessageMutation.mutate({channel: "presence-global-chat", message: newMessage});
  }

  return (
    <div className="z-30 flex flex-col gap-8">
      {/*<Card className={"fixed left-2 right-2 z-30 text-center"}>
        <CardBody>
          <p>{onlineUsers} users online</p>
        </CardBody>
      </Card>*/}

      {showLoading && <LoadingScreen/>}

      {!showLoading && (
        <div className={"flex flex-col gap-4 max-w-[800px] w-full mx-auto"}>
          <Card className={"p-4"}>
            <Title size={"md"}>Welcome to the public chat!</Title>
            <p className={"text-lg"}>Here are the rules:</p>
            <ul className={"text-gray-300 my-2"}>
              <li>1. Behave yourself</li>
              <li>2. No NSFW content</li>
              <li>3. No spamming</li>
              <li>4. Be nice to each other!</li>
            </ul>
            <Divider className={"my-2"}/>
            <Card className={"bg-red-500/40 mt-2"}>
              <CardBody>
                <div className="flex items-center gap-2">
                  <BiSolidError className="text-xl"/>
                  <p>The public chat has been disabled indefinitely. Thank you for your support!</p>
                </div>
              </CardBody>
            </Card>
          </Card>
          <Messages data={messages}/>
          <div ref={bottomRef}/>
        </div>
      )}

      <div className="fixed bottom-0 left-0 right-0 p-3 z-30 bg-gradient-to-t from-black via-black/95 to-black/10">
        <ChatInput placeholder={"Send a message..."} onSend={handleSendMessage}/>
      </div>
    </div>
  );
}

function Messages(props: { data: Message[] }) {
  const [isProfileOpen, setProfileOpen] = useState<boolean>(false);
  return (
    <div className={"flex flex-col gap-4 mb-20 mt-24"}>
      {props.data.map((message, index) => (
        <Card
          key={message.timestamp}
          className={"bg-transparent border-content2 rounded-xl border shadow-none"}
        >
          <UserProfileModal
            username={message.user.username}
            isOpen={isProfileOpen}
            onOpenChange={setProfileOpen}
          />
          <CardBody>
            <div className="flex items-center gap-2">
              <Avatar
                onClick={() => setProfileOpen(true)}
                src={message.user?.avatar}
                alt="User Avatar"
                isBordered={true}
                className="w-8 h-8 rounded-full m-1"
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
      <Spinner/>
    </div>
  );
}
