import React, { useEffect } from "react";
import { Card, CardBody, CardHeader } from "@nextui-org/card";
import Page from "~/components/Page";
import {
  ConnectionStatus,
  useOmegleChatConnection,
} from "~/use-hooks/useOmegleChatConnection";
import useOmegleChatMessages from "~/use-hooks/useOmegleChatMessages";
import useOmegleChatSearch from "~/use-hooks/useOmegleChatSearch";

export default function CharacterRoulette() {
  return (
    <Page metaTitle={"Character Roulette"} protected={true}>
      <OmegleChat />
    </Page>
  );
}

function OmegleChat(props: {}) {
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

  // Connection management.
  useEffect(() => {
    setTextStatus(connStatusToText(connStatus));
    if (connStatus === "subscribe-failed") resetChannelData();
    if (connStatus === "subscribed-user-left") resetChannelData();
  }, [connStatus]);

  // Search management.
  useEffect(() => {
    if (searchStatus === "searching") setTextStatus("Searching...");
    if (searchStatus === "not-found") {
      setTextStatus("No room found :( Please try again later.");
      resetChannelData();
    }

    // If channel found, wait x seconds and check if the other user is connected yet. If not, disconnect.
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

  return (
    <Card className={"mx-auto mt-6 max-w-xl"}>
      {messages.map((message) => {
        return (
          <Card key={message.id}>
            <CardHeader>{message.user.info.username}</CardHeader>
            <CardBody>{message.content}</CardBody>
          </Card>
        );
      })}
    </Card>
  );
}

function connStatusToText(connStatus: ConnectionStatus) {
  switch (connStatus) {
    case "subscribing":
      return "Connecting...";
    case "subscribe-failed":
      return "Failed to connect.";
    case "subscribed-no-user":
      return "Waiting for the other user to connect.";
    case "subscribed-w-user":
      return "Connected.";
    case "subscribed-user-left":
      return "User left.";
  }
}
