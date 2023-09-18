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
    switch (connStatus) {
      case "subscribing":
        setTextStatus("Connecting...");
        break;
      case "subscribe-failed":
        setTextStatus("Failed to connect.");
        resetChannelData();
        break;
      case "subscribed-no-user":
        setTextStatus("Waiting for the other user to connect.");
        break;
      case "subscribed-w-user":
        setTextStatus("Connected.");
        break;
      case "subscribed-user-left":
        setTextStatus("User left.");
        endChat();
        break;
      default:
        break;
    }
  }, [connStatus]);

  useEffect(() => {
    if (searchStatus === "searching") {
      setTextStatus("Searching...");
    }
    if (searchStatus === "not-found") {
      setTextStatus("No room found :( Please try again later.");
      resetChannelData();
    }
    if (searchStatus === "found") {
      const _channelName = channelData?.name;
      setTimeout(() => {
        if (
          channelDataRef.current?.name === _channelName &&
          connStatusRef.current === "subscribed-no-user"
        ) {
          console.log("No user connected. Reverting.");
          setTextStatus("No user has connected.");
          resetChannelData();
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
