import React, { useEffect } from "react";
import { Card, CardBody } from "@nextui-org/card";
import Page from "~/components/Page";
import { ConnectionStatus, useRRConnection } from "~/hooks/useRRConnection";
import useRRChannelConnector, {
  RRChannelSearchStatus,
} from "~/hooks/useRRChannelConnector";
import { Spinner } from "@nextui-org/spinner";
import useRRMessages from "~/hooks/useRRMessages";
import RRInput from "~/components/character-roulette/Input";
import RRMessages from "~/components/character-roulette/Messages";
import RRUserHeader from "~/components/character-roulette/UserHeader";
import paths from "~/utils/paths";
import { twMerge } from "tailwind-merge";

// "RR". Stands for Roleplay Roulette.
export default function RoleplayRoulette() {
  return (
    <Page metaTitle={"Character Roulette"} header={{ back: paths.RR }}>
      <Chat />
    </Page>
  );
}

function Chat(props: {}) {
  const channel = useRRChannelConnector();
  const conn = useRRConnection(channel.data?.name);
  const chat = useRRMessages(conn.channel);

  function handleSearchClick() {
    channel.reset();
    channel.search();
  }

  // Connection management.
  useEffect(() => {
    if (conn.status === "no-channel" && conn.lastUser) {
      chat.addSystemMessage("The user has left the chat...");
    }

    if (conn.status === "subscribed-w-user") {
      chat.addSystemMessage(channel.data?.topic || "");
    }

    if (conn.status === "subscribe-failed") channel.reset();
    if (conn.status === "subscribed-user-left") channel.reset();
  }, [conn.status]);

  // Channel search management.
  useEffect(() => {
    if (channel.status === "not-found") channel.reset();

    // If channel found, wait x seconds and check if the other user is connected yet. If not, disconnect.
    if (channel.status === "found") {
      const _channelName = channel.data?.name;
      setTimeout(() => {
        if (
          channel.datRef.current?.name === _channelName &&
          conn.statusRef.current === "subscribed-no-user"
        ) {
          console.log("No user connected. Reverting.");
          channel.reset();
        }
      }, 2000);
    }
  }, [channel.status]);

  const showLoading =
    channel.status === "searching" || conn.status === "subscribing";

  // Show header when user is successfully connected.
  const showUserHeader =
    conn.lastUser &&
    conn.status !== "subscribing" &&
    channel.status !== "searching" &&
    channel.status !== "not-found";

  return (
    <div className="z-30 flex flex-col gap-8">
      <div className={"fixed left-2 right-2 z-30"}>
        {showUserHeader ? (
          <RRUserHeader
            className={"border border-default-200 shadow"}
            user={conn.lastUser!}
          />
        ) : (
          <StatusHeader
            className={"border border-default-200 shadow"}
            status={getStatusStr(conn.status, channel.status)}
          />
        )}
      </div>

      {showLoading && <LoadingScreen />}

      {!showLoading && (
        <div className={"flex flex-col gap-4 mb-20 mt-28"}>
          <RRMessages messages={chat.messages} />
        </div>
      )}

      <RRInput
        isFirstChat={!conn.lastUser}
        onStop={channel.reset}
        onSearch={handleSearchClick}
        onSend={chat.sendMessage}
        inChat={conn.status === "subscribed-w-user"}
        isSearching={channel.status === "searching"}
      />
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

function StatusHeader(props: { status: string; className?: string }) {
  return (
    <Card className={twMerge("h-24", props.className)}>
      <CardBody className={"text-center justify-center items-center text-lg"}>
        {props.status}
      </CardBody>
    </Card>
  );
}

function getStatusStr(
  connStatus: ConnectionStatus,
  searchStatus: RRChannelSearchStatus,
) {
  if (searchStatus === "searching") return "Searching...";
  if (searchStatus === "not-found") return "No available room found!";
  if (connStatus === "subscribing") return "Connecting...";
  if (connStatus === "subscribed-no-user") return "Waiting for user...";
  if (connStatus === "subscribe-failed") return "Failed to connect.";
  if (connStatus === "subscribed-user-left") return "User left.";
  if (connStatus === "subscribed-w-user") return "Connected.";
  return "Click search button to chat.";
}
