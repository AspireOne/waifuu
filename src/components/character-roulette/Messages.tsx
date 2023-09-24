import { RRMessage, RRMessages, RRSystemMessage } from "~/hooks/useRRMessages";
import { Card, CardBody, CardHeader } from "@nextui-org/card";
import React from "react";
import { Avatar } from "@nextui-org/avatar";

export default function RRMessages(props: { messages: RRMessages }) {
  if (props.messages.length === 0) return undefined;

  return props.messages.map((message, i) => {
    // prettier-ignore
    return message.type === "message"
      ? <Message message={message}/>
      : <SystemMessage message={message}/>
  });
}

const Message = (props: { message: RRMessage }) => (
  <Card key={props.message.id}>
    <CardHeader>
      <div className={"flex flex-row gap-4 items-center"}>
        <Avatar
          src={props.message.user.info.image ?? undefined}
          name={props.message.user.info.username}
        />
        <p className={"font-semibold"}>{props.message.user.info.username}</p>
      </div>
    </CardHeader>
    <CardBody className={"whitespace-pre-line max-h-none overflow-y-visible"}>
      <p>{applyMarkdown(props.message.content)}</p>
    </CardBody>
  </Card>
);

const SystemMessage = (props: { message: RRSystemMessage }) => (
  <Card key={props.message.id} className={"bg-secondary-200"}>
    {props.message.title && (
      <CardHeader>
        <p className={"text-xl font-semibold"}>{props.message.title}</p>
      </CardHeader>
    )}
    <CardBody>
      <p className={"italic"}>{props.message.content}</p>
    </CardBody>
  </Card>
);

/**
 * Takes in a string and applies markdown: *italic*, **bold**, `code`.
 * @example "Hello *world*! I am **Kate**" -> ["Hello ", <i>world</i>, "!", " I am ", <b>Kate</b>]
 */
export function applyMarkdown(text: string): React.ReactNode[] {
  let result: (string | React.ReactNode)[] = [];

  if (!text) return result;

  // Regular expression to match *, **, ` and the text between them
  let regex = /(\*\*[^*]*\*\*)|(\*[^*]*\*)|(`[^`]*`)/g;
  let splits = text.split(regex);

  for (let split of splits) {
    if (!split) continue;

    if (split.startsWith("**") && split.endsWith("**")) {
      result.push(<b key={split}>{split.slice(2, -2)}</b>);
    } else if (split.startsWith("*") && split.endsWith("*")) {
      result.push(
        <i className={"text-foreground-500"} key={split}>
          {"\n"}
          {split.slice(1, -1)}
          {"\n"}
        </i>,
      );
    } else if (split.startsWith("`") && split.endsWith("`")) {
      result.push(<code key={split}>{split.slice(1, -1)}</code>);
    } else {
      // Keep the string as it is if it's not surrounded by special characters
      result.push(split);
    }
  }

  return result;
}
