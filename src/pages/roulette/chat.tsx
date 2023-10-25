import React, { useEffect } from "react";
import { Card, CardBody } from "@nextui-org/card";
import Page from "@/components/Page";
import { ConnectionStatus, useRRConnection } from "@/hooks/useRRConnection";
import useRRChannelConnector, {
  RRChannelSearchStatus,
} from "@/hooks/useRRChannelConnector";
import { Spinner } from "@nextui-org/spinner";
import useRRMessages from "@/hooks/useRRMessages";
import { RRInput } from "@/components/roleplay-roulette/RRInput";
import RRMessages from "@/components/roleplay-roulette/RRMessages";
import RRUserHeader from "@/components/roleplay-roulette/RRUserHeader";
import { paths } from "@/lib/paths";
import { twMerge } from "tailwind-merge";
import { msg, t } from "@lingui/macro";
import { useLingui } from "@lingui/react";

// "RR". Stands for Roleplay Roulette.
export default function RoleplayRoulette() {
  const { _ } = useLingui();
  return (
    <Page title={_(msg`Character Roulette`)} backPath={paths.RR}>
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
          (conn.statusRef.current === "subscribed-no-user" ||
            conn.statusRef.current === "subscribing")
        ) {
          console.log("No user connected. Reverting.");
          channel.reset();
        }
      }, 2500);
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
  if (searchStatus === "searching") return t`Searching...`;
  if (searchStatus === "not-found") return t`No available room found!`;
  if (connStatus === "subscribing") return t`Connecting...`;
  if (connStatus === "subscribed-no-user") return t`Waiting for user...`;
  if (connStatus === "subscribe-failed") return t`Failed to connect.`;
  if (connStatus === "subscribed-user-left") return t`User left.`;
  if (connStatus === "subscribed-w-user") return t`Connected.`;
  return t`Click search button to chat.`;
}
