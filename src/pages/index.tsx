import {signIn, signOut, useSession} from "next-auth/react";
import Head from "next/head";
import {api} from "~/utils/api";
import React from "react";
import Replicate from "replicate";
import {Card, CardBody, CardFooter, CardHeader} from "@nextui-org/card";
import {Textarea} from "@nextui-org/input";


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

  const responseMutation = api.example.genAiResponse.useMutation({
    onSuccess: (data) => {
      setMessages([...messages, {isUser: false, text: data}]);
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
    const newMessages = [...messages, {isUser: true, text: input}];
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
        {
          messages.map((message, index) =>
            <Textarea key={index} isReadOnly value={message.text} className={"" && (message.isUser && "bg-blue-300")}/>
          )
        }
      </CardBody>
      <CardFooter className={"flex flex-row gap-4 items-end"}>
        <Textarea value={input} onValueChange={setInput} onKeyDown={onKeyDown} variant={"faded"}/>
      </CardFooter>
    </Card>
  )
}