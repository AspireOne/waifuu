import { useSession } from "next-auth/react";
import { api } from "~/utils/api";
import React, { useEffect } from "react";
import { Card, CardBody, CardHeader } from "@nextui-org/card";
import Page from "~/components/Page";
import { useOmegleChatConnection } from "~/use-hooks/useOmegleChatConnection";
import { Button } from "@nextui-org/react";
import useOmegleChatMessages from "~/use-hooks/useOmegleChatMessages";

export default function Home() {
  const { data: session } = useSession();

  return (
    <Page metaTitle={"Main Page"} protected={true}>
      <Chat />
    </Page>
  );
}

function Chat(props: {}) {
  const [channelName, setChannelName] = React.useState<string | null>(null);
  const [textStatus, setTextStatus] = React.useState<string | null>();
  const { status: connStatus, channel } = useOmegleChatConnection(channelName);
  const { messages, clearMessages, sendMessage } =
    useOmegleChatMessages(channel);

  let channelNameRef = React.useRef(channelName);
  let connStatusRef = React.useRef(connStatus);
  React.useEffect(() => {
    channelNameRef.current = channelName;
  }, [channelName]);

  React.useEffect(() => {
    connStatusRef.current = connStatus;
  }, [connStatus]);

  useEffect(() => {
    if (connStatus === "subscribing") {
      setTextStatus("Subscribing - Channel: " + channelName);
    }

    if (connStatus === "subscribe-failed") {
      setTextStatus("Failed to subscribe - Channel: " + channelName);
      setChannelName(null);
    }

    if (connStatus === "subscribed-no-user") {
      setTextStatus("Subscribed - no user connected yet.");
    }

    if (connStatus === "subscribed-w-user") {
      setTextStatus("Subscribed - user connected.");
    }

    if (connStatus === "subscribed-user-left") {
      setTextStatus("Subscribed - user left.");
      endChat();
    }
  }, [connStatus]);

  function endChat() {
    setChannelName(null);
  }

  const searchUserMutation = api.omegleChat.searchUser.useMutation({
    onMutate: () => {
      setChannelName(null);
      setTextStatus("Searching...");
    },
    onSuccess: async (data) => {
      if (!data?.channel) {
        setTextStatus("Not found.");
        return;
      } else {
        setTextStatus("Found channel. Connecting to: " + data?.channel);
      }

      setChannelName(data?.channel);
      const _channelName = data?.channel;

      await new Promise((resolve) => setTimeout(resolve, 2000));

      setTimeout(() => {
        if (
          channelNameRef.current === _channelName &&
          connStatusRef.current === "subscribed-no-user"
        ) {
          console.log("No user connected. Reverting.");
          setTextStatus("No user connected.");
          setChannelName(null);
        }
      }, 3000);
    },
    onError: (error) => {
      setTextStatus("Error finding channel: " + error.message);
      setChannelName(null);
    },
  });

  return (
    <Card className={"mx-auto mt-6 max-w-xl"}>
      <div className={"flex flex-col gap-4"}>
        <Button onClick={() => searchUserMutation.mutate()}>
          test search user
        </Button>
        <Button
          onClick={() => {
            if (!channelName) {
              setTextStatus("Cannot send message, because no channel.");
              return;
            }
            sendMessage("some message");
          }}
        >
          test send message
        </Button>

        {messages.map((message) => {
          return (
            <Card key={message.id}>
              <CardHeader>{message.user.info.username}</CardHeader>
              <CardBody>{message.content}</CardBody>
            </Card>
          );
        })}

        <div>Status: {textStatus}</div>
      </div>
    </Card>
  );
}
