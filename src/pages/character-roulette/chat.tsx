import React, { useEffect } from "react";
import { Card, CardBody, CardHeader } from "@nextui-org/card";
import Page from "~/components/Page";
import {
  ConnectionStatus,
  useOmegleChatConnection,
} from "~/use-hooks/useOmegleChatConnection";
import useOmegleChatMessages, {
  OmegleChatMessage,
} from "~/use-hooks/useOmegleChatMessages";
import useOmegleChatSearch, {
  SearchStatus,
} from "~/use-hooks/useOmegleChatSearch";
import { twMerge } from "tailwind-merge";
import { Button, Image, Textarea } from "@nextui-org/react";
import { RiSendPlane2Fill } from "react-icons/ri";
import { BsFillStopCircleFill } from "react-icons/bs";
import { LuRefreshCcw } from "react-icons/lu";
import PresenceChannelMember from "~/server/types/presenceChannelMember";
import { BiDotsVerticalRounded } from "react-icons/bi";
import { Spinner } from "@nextui-org/spinner";

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

  const conn = useOmegleChatConnection(channelData?.name);
  const chat = useOmegleChatMessages(conn.channel);

  function handleSearchClick() {
    resetChannelData();
    search();
  }

  // Connection management.
  useEffect(() => {
    if (conn.status === "subscribe-failed") resetChannelData();
    if (conn.status === "subscribed-user-left") resetChannelData();
  }, [conn.status]);

  // Search management.
  useEffect(() => {
    if (searchStatus === "not-found") resetChannelData();

    // If channel found, wait x seconds and check if the other user is connected yet. If not, disconnect.
    if (searchStatus === "found") {
      const _channelName = channelData?.name;
      setTimeout(() => {
        if (
          channelDataRef.current?.name === _channelName &&
          conn.statusRef.current === "subscribed-no-user"
        ) {
          console.log("No user connected. Reverting.");
          resetChannelData();
        }
      }, 2000);
    }
  }, [searchStatus]);

  const showLoading =
    searchStatus === "searching" || conn.status === "subscribing";

  return (
    <div className="z-30 flex flex-col gap-8">
      <div className={"fixed top-2 left-2 right-2 z-30"}>
        {conn.lastUser &&
        conn.status !== "subscribing" &&
        searchStatus !== "searching" &&
        searchStatus !== "not-found" ? (
          <UserHeader user={conn.lastUser} />
        ) : (
          <StatusHeader status={getStatus(conn.status, searchStatus)} />
        )}
      </div>

      {showLoading && <LoadingScreen />}
      {!showLoading && (
        <div className={"flex h-[90vh] flex-col gap-4 mb-20 mt-28"}>
          <p className={"text-lg font-semibold"}>Topic: {channelData?.topic}</p>
          <Messages messages={chat.messages} />
          {conn.status === "no-channel" && !!conn.lastUser && (
            <SystemMessage content={"The user has left the chat..."} />
          )}
        </div>
      )}

      <Input
        onStop={resetChannelData}
        onSearch={handleSearchClick}
        onSend={chat.sendMessage}
        inChat={conn.status === "subscribed-w-user"}
        isSearching={searchStatus === "searching"}
      />
    </div>
  );
}

function SystemMessage(props: { content: string }) {
  return <Card className={"p-1 italic bg-transparent"}>{props.content}</Card>;
}

function Messages(props: { messages: OmegleChatMessage[] }) {
  if (props.messages.length > 0) {
    return props.messages.map((message, i) => {
      return (
        <Card key={i}>
          <CardHeader>{message.user.info.username}</CardHeader>
          <CardBody>{message.content}</CardBody>
        </Card>
      );
    });
  }

  return undefined;
}

function LoadingScreen() {
  return (
    <div className={"flex h-[90vh] justify-center items-center"}>
      <Spinner />
    </div>
  );
}

function StatusHeader(props: { status: string }) {
  return (
    <Card className={"h-24"}>
      <CardBody
        className={
          "flex flex-row gap-4 text-center flex flex-col justify-center items-center text-lg"
        }
      >
        {props.status}
      </CardBody>
    </Card>
  );
}

function UserHeader(props: {
  className?: string;
  user: PresenceChannelMember;
}) {
  // TODO: Handle image onClick
  return (
    <Card className={"h-24"}>
      <CardBody className={twMerge("flex flex-row gap-4", props.className)}>
        {/*@ts-ignore*/}
        <Image
          referrerpolicy="no-referrer"
          onClick={() => {}}
          src={props.user.info.image!}
          className={"h-12 w-12 aspect-square rounded-full"}
          alt="avatar"
        />
        <div className="flex flex-col flex-1">
          <h3 className="text-white">{props.user.info.username}</h3>
          <h6 className="text-gray-400 line-clamp-1">
            {props.user.info.bio || "No bio."}
          </h6>
        </div>

        <div className="flex flex-row gap-2 ml-auto">
          <Button isIconOnly className={"h-12 w-16 bg-transparent"}>
            <BiDotsVerticalRounded size={30} />
          </Button>
        </div>
      </CardBody>
    </Card>
  );
}

function Input(props: {
  onStop: () => void;
  onSearch: () => void;
  onSend: (content: string) => void;
  inChat?: boolean;
  isSearching?: boolean;
  placeholder?: string;
  className?: string;
}) {
  const [input, setInput] = React.useState<string>("");

  useEffect(() => {
    if (!props.inChat) {
      setInput("");
    }
  }, [props.inChat]);

  function handleButtonClicked() {
    if (props.inChat) props.onStop();
    else props.onSearch();
  }

  function handleSendClicked() {
    props.onSend(input);
    setInput("");
  }

  let ActionButtons;

  if (input.length > 0 && props.inChat) {
    ActionButtons = (
      <Button
        disabled={!props.inChat}
        isIconOnly
        className={"p-1 bg-transparent"}
        onClick={handleSendClicked}
      >
        <RiSendPlane2Fill size={30} />
      </Button>
    );
  } else {
    ActionButtons = (
      <Button
        disabled={props.isSearching}
        isIconOnly
        className={"p-1 bg-transparent"}
        onClick={handleButtonClicked}
      >
        {props.inChat ? (
          <BsFillStopCircleFill size={30} />
        ) : (
          <LuRefreshCcw
            size={30}
            className={twMerge("", props.isSearching && "animate-spin")}
          />
        )}
      </Button>
    );
  }

  return (
    <div
      className={twMerge(
        "flex flex-row items-center w-full gap-2 sm:w-[400px] md:w-[500px] lg:w-[700px] fixed bottom-0 left-0 right-0 p-2 z-30 bg-gradient-to-t via-black/95 from-black",
        props.className,
      )}
    >
      <Textarea
        rows={2}
        maxRows={2}
        value={input}
        onValueChange={setInput}
        disabled={!props.inChat}
        placeholder={props.placeholder ?? "Your message..."}
        variant={"bordered"}
        className={"flex-1"}
        type="text"
      />

      <div className={"absolute right-4"}>{ActionButtons}</div>
    </div>
  );
}

function getStatus(connStatus: ConnectionStatus, searchStatus: SearchStatus) {
  if (searchStatus === "searching") return "Searching...";
  if (searchStatus === "not-found") return "No available room found!";
  if (connStatus === "subscribing") return "Connecting...";
  if (connStatus === "subscribed-no-user") return "Waiting for user...";
  if (connStatus === "subscribe-failed") return "Failed to connect.";
  if (connStatus === "subscribed-user-left") return "User left.";
  if (connStatus === "subscribed-w-user") return "Connected.";
  return "Click search button to chat.";
}
