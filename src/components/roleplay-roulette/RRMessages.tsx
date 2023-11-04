import { RRMessage, RRMessagesType, RRSystemMessage } from "@/hooks/useRRMessages";
import { applyMarkdown } from "@lib/utils";
import { Avatar } from "@nextui-org/avatar";
import { Card, CardBody, CardHeader } from "@nextui-org/card";

export default function RRMessages(props: { messages: RRMessagesType }) {
  if (props.messages.length === 0) return undefined;

  return props.messages.map((message, i) => {
    // prettier-ignore
    return message.type === "message" ? (
      <Message message={message} />
    ) : (
      <SystemMessage message={message} />
    );
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
