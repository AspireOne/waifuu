import {signIn, signOut, useSession} from "next-auth/react";
import Head from "next/head";
import {api} from "~/utils/api";
import React, {useRef} from "react";
import Replicate from "replicate";
import {Card, CardBody, CardFooter, CardHeader} from "@nextui-org/card";
import {Textarea} from "@nextui-org/input";
import {useAutoAnimate} from "@formkit/auto-animate/react";


type Message = {
  isUser?: boolean,
  isError?: boolean,
  text: string
}

export default function Home() {
  /*const {data: sessionData} = useSession();

  const {data: secretMessage} = api.example.getSecretMessage.useQuery(
    undefined,
    {enabled: sessionData?.user !== undefined}
  );

  const hello = api.example.hello.useQuery({text: "from tRPC"});*/

  return (
    <>
      <Head>
        <title>Companion</title>
        <meta name="description" content=""/>
        <link rel="icon" href="/favicon.ico"/>
      </Head>

      <div>
        <Chat></Chat>
      </div>
    </>
  );
}

function Chat(props: {}) {
  const [input, setInput] = React.useState<string>("")
  const [messages, setMessages] = React.useState<Message[]>([]);
  const [submitting, setSubmitting] = React.useState<boolean>(false);
  const [animationParent] = useAutoAnimate()

  const responseMutation = api.example.genAiResponse.useMutation({
    onSuccess: (data) => {
      setMessages([...messages, {isUser: false, text: data.trim()}]);
    },

    onError: (error) => {
      setMessages([...messages, {isUser: false, text: "Something went wrong.", isError: true}]);
      console.log(error);
    },

    onSettled: (data, error, variables, context) => {
      setSubmitting(false);
    }
  });

  function handleSubmit() {
    console.log("submitting");
    setSubmitting(true);
    const newMessages = [...messages, {isUser: true, text: input.trim()}];
    setMessages(newMessages);
    setInput("");

    responseMutation.mutate(newMessages);
  }

  async function onKeyDown(e: any) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (!submitting) handleSubmit();
      return;
    }
  }

  return (
    <Card className={"max-w-xl mx-auto mt-6"}>
      <CardHeader>
        Here you can try our chat!
      </CardHeader>
      <CardBody>
        <div ref={animationParent}>
          {
            messages.map((message, index) => {
                const color = message.isUser ? "bg-gray-200" : (message.isError ? "bg-red-200" : "bg-blue-100");
                console.log(message.isUser);
                return (
                  <div className={"rounded-2xl p-4 my-2 " + color}>
                    {formatText(message.text)}
                  </div>
                )
              }
            )
          }
        </div>
      </CardBody>
      <CardFooter className={"flex flex-row gap-4 items-end"}>
        <Textarea value={input} onValueChange={setInput} onKeyDown={onKeyDown} variant={"faded"}/>
      </CardFooter>
    </Card>
  )
}

function formatText(text: string): React.ReactNode[] {
  return text.split('*').map((part, index) => {
    // Every second piece of text (starting from 0) is outside of the asterisks
    if (index % 2 === 0) {
      return part;
    } else {
      // Add newline characters before and after the italic text
      return (
        <>

          <div className="italic my-[4px]">*{part}*</div>

        </>
      );
    }
  });
}