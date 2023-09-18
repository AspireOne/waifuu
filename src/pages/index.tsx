import { useSession } from "next-auth/react";
import { api } from "~/utils/api";
import React, { useEffect } from "react";
import { Card, CardBody, CardHeader } from "@nextui-org/card";
import Page from "~/components/Page";
import { useOmegleChatConnection } from "~/use-hooks/useOmegleChatConnection";
import { Button } from "@nextui-org/react";
import useOmegleChatMessages from "~/use-hooks/useOmegleChatMessages";
import { ChannelData } from "~/server/api/routers/omegleChat";

export default function Home() {
  const { data: session } = useSession();

  return (
    <Page metaTitle={"Main Page"} protected={true}>
      <Chat />
    </Page>
  );
}

function Chat(props: {}) {
  const [channelData, setChannelData] = React.useState<ChannelData | null>(
    null,
  );
  const [textStatus, setTextStatus] = React.useState<string | null>();
  const { status: connStatus, channel } = useOmegleChatConnection(
    channelData?.name,
  );
  const { messages, clearMessages, sendMessage } =
    useOmegleChatMessages(channel);

  // This is here so that I can setTimeout (to check member connection) and use fresh data.
  let channelDataRef = React.useRef(channelData);
  let connStatusRef = React.useRef(connStatus);
  React.useEffect(() => {
    channelDataRef.current = channelData;
  }, [channelData]);

  React.useEffect(() => {
    connStatusRef.current = connStatus;
  }, [connStatus]);

  useEffect(() => {
    if (connStatus === "subscribing") {
      setTextStatus("Subscribing - Channel: " + channelData);
    }

    if (connStatus === "subscribe-failed") {
      setTextStatus("Failed to subscribe - Channel: " + channelData);
      setChannelData(null);
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
    setChannelData(null);
  }

  const searchUserMutation = api.omegleChat.searchUser.useMutation({
    onMutate: () => {
      setChannelData(null);
      setTextStatus("Searching...");
    },
    onSuccess: async (channelData) => {
      if (!channelData) {
        setTextStatus("Not found.");
        return;
      } else {
        setTextStatus("Found channel. Connecting to: " + channelData.name);
      }

      setChannelData(channelData);
      const _channelName = channelData?.name;

      setTimeout(() => {
        if (
          channelDataRef.current?.name === _channelName &&
          connStatusRef.current === "subscribed-no-user"
        ) {
          console.log("No user connected. Reverting.");
          setTextStatus("No user connected.");
          setChannelData(null);
        }
      }, 2200);
    },
    onError: (error) => {
      setTextStatus("Error finding channel: " + error.message);
      setChannelData(null);
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
            if (!channelData) {
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
