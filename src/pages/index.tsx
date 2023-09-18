import React, { useEffect } from "react";
import { Card, CardBody, CardHeader } from "@nextui-org/card";
import Page from "~/components/Page";
import { useOmegleChatConnection } from "~/use-hooks/useOmegleChatConnection";
import { Button } from "@nextui-org/react";
import useOmegleChatMessages from "~/use-hooks/useOmegleChatMessages";
import useOmegleChatSearch from "~/use-hooks/useOmegleChatSearch";

export default function Home() {
  return (
    <Page metaTitle={"Main Page"} protected={true}>
      <Chat />
    </Page>
  );
}

function Chat(props: {}) {
  const {
    search,
    channelData,
    channelDataRef,
    resetChannelData,
    status: searchStatus,
  } = useOmegleChatSearch();
  const [textStatus, setTextStatus] = React.useState<string | null>();
  // prettier-ignore
  const {status: connStatus, statusRef: connStatusRef, channel} = useOmegleChatConnection(channelData?.name);
  // prettier-ignore
  const {messages, clearMessages, sendMessage} = useOmegleChatMessages(channel);

  useEffect(() => {
    if (connStatus === "subscribing") {
      setTextStatus("Subscribing - Channel: " + channelData);
    }

    if (connStatus === "subscribe-failed") {
      setTextStatus("Failed to subscribe - Channel: " + channelData);
      endChat();
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

  useEffect(() => {
    if (searchStatus === "found") {
      const _channelName = channelData?.name;
      setTimeout(() => {
        if (
          channelDataRef.current?.name === _channelName &&
          connStatusRef.current === "subscribed-no-user"
        ) {
          console.log("No user connected. Reverting.");
          setTextStatus("No user has connected.");
          endChat();
        }
      }, 2000);
    }
  }, [searchStatus]);

  function endChat() {
    resetChannelData();
  }

  return (
    <Card className={"mx-auto mt-6 max-w-xl"}>
      <div className={"flex flex-col gap-4"}>
        <Button onClick={search}>test search user</Button>
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
