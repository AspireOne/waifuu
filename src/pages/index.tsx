import { useSession } from "next-auth/react";
import { api } from "~/utils/api";
import React, { useEffect } from "react";
import { Card } from "@nextui-org/card";
import Page from "~/components/Page";
import { useOmegleChatConnection } from "~/use-hooks/useOmegleChatConnection";
import { Button } from "@nextui-org/react";

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
  const { status: chatStatus } = useOmegleChatConnection(channelName);

  useEffect(() => {
    if (chatStatus === "subscribing") {
      setTextStatus("Subscribing - Channel: " + channelName);
    }

    if (chatStatus === "subscribe-failed") {
      setTextStatus("Failed to subscribe - Channel: " + channelName);
      setChannelName(null);
    }

    if (chatStatus === "subscribed-no-user") {
      setTextStatus("Subscribed - no user connected yet.");
    }

    if (chatStatus === "subscribed-w-user") {
      setTextStatus("Subscribed - user connected.");
    }

    if (chatStatus === "subscribed-user-left") {
      setTextStatus("Subscribed - user left.");
    }
  }, [chatStatus]);

  const sendMsgMutation = api.omegleChat.sendMessage.useMutation({
    onMutate: () => {
      setTextStatus("Sending Message - Channel: " + channelName);
    },
    onSuccess: (data) => {
      setTextStatus("Message sent.");
    },
    onError: (error) => {
      console.log(error.data);
      setTextStatus("Error sending message: " + error.message);
    },
  });

  const searchUserMutation = api.omegleChat.searchUser.useMutation({
    onMutate: () => {
      setChannelName(null);
      setTextStatus("Searching...");
    },
    onSuccess: (data) => {
      if (!data?.channel) {
        setTextStatus("Not found.");
        return;
      } else {
        setTextStatus("Found channel. Connecting to: " + data?.channel);
      }

      setChannelName(data?.channel);
      const _channelName = data?.channel;

      setTimeout(() => {
        console.log("set timeout triggered, " + chatStatus);
        if (
          channelName === _channelName &&
          chatStatus === "subscribed-no-user"
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
            sendMsgMutation.mutate({
              channel: channelName!,
              message: "some message",
            });
          }}
        >
          test send message
        </Button>

        <div>Status: {textStatus}</div>
      </div>
    </Card>
  );
}
