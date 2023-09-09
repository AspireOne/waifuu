import { signIn, signOut, useSession } from "next-auth/react";
import Head from "next/head";
import { api } from "~/utils/api";
import React, { useEffect, useRef } from "react";
import Replicate from "replicate";
import { Card, CardBody, CardFooter, CardHeader } from "@nextui-org/card";
import { Textarea } from "@nextui-org/input";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import Page from "~/components/Page";
import useBotChat from "~/use-hooks/useBotChat";
import { Button } from "@nextui-org/react";
import { BotMode } from "@prisma/client";

export default function Home() {
  const { data: session } = useSession();
  //const {data: bots} = api.bots.getBots.useQuery();

  return (
    <Page metaTitle={"Main Page"} protected={true}>
      <Chat />
    </Page>
  );
}

function Chat(props: {}) {
  const [input, setInput] = React.useState<string>("");
  const chat = useBotChat("official-public", BotMode.ROLEPLAY);
  const bots = api.bots.getAllBots.useQuery();
  const [animationParent] = useAutoAnimate();

  function handleSubmit() {
    chat.postMessage(input);
    setInput("");
  }

  async function onKeyDown(e: any) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (!chat.loadingReply) handleSubmit();
      return;
    }
  }

  return (
    <Card className={"mx-auto mt-6 max-w-xl"}>
      <CardHeader>Here you can try our chat!</CardHeader>
      <CardBody>
        <Button
          isDisabled={chat.loadingMore}
          isLoading={chat.loadingMore}
          onClick={() => chat.loadMore()}
        >
          Load more
        </Button>
        <div ref={animationParent}>
          {chat.messages.reverse().map((message, index) => {
            //const color = message.role === "USER" ? "bg-gray-200" : (message.error ? "bg-red-200" : "bg-blue-100");
            return (
              <Card className={"my-2"} key={message.id}>
                <CardBody>{formatText(message.content)}</CardBody>
              </Card>
            );
          })}
        </div>
      </CardBody>
      <CardFooter className={"flex flex-row items-end gap-4"}>
        <Textarea
          value={input}
          onValueChange={setInput}
          onKeyDown={onKeyDown}
          variant={"faded"}
        />
      </CardFooter>
    </Card>
  );
}

function formatText(text: string): React.ReactNode[] {
  return text.split("*").map((part, index) => {
    // Every second piece of text (starting from 0) is outside of the asterisks
    if (index % 2 === 0) {
      return part;
    } else {
      // Add newline characters before and after the italic text
      return (
        <>
          <div className="my-[4px] italic">*{part}*</div>
        </>
      );
    }
  });
}
