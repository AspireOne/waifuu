import { Card, CardBody } from "@nextui-org/card";
import { Avatar } from "@nextui-org/react";
import { Mood } from "@prisma/client";
import { useMemo } from "react";
import { twMerge } from "tailwind-merge";

type Props = {
  message: string;
  className?: string;
  id?: number;
  author: {
    bot: boolean;
    avatar?: string | null;
    name: string;
  };
  mood?: Mood;
};

const ChatMessage = ({ author, message, className, mood, id }: Props) => {
  const formattedMessage = useMemo(() => {
    return message
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      .replace(/\*(.*?)\*/g, "<em>$1</em>")
      .replace(/__(.*?)__/g, "<strong>$1</strong>")
      .replace(/_(.*?)_/g, "<em>$1</em>")
      .replace(/@@(.*?)@@/g, "<s>$1</s>")
      .replace(/`(.*?)`/g, "<code>$1</code>")
      .replace(/```(.*?)```/g, "<pre>$1</pre>");
  }, [message]);

  return (
    <div
      className={twMerge(
        "flex mx-auto w-full gap-2",
        author.bot ? "ml-0" : "mr-0 flex-row",
        className,
      )}
    >
      <Card className={twMerge("w-full rounded-lg p-3")}>
        {/*Comment this out for now, because it is not needed.*/}
        {/*<MsgDropdown/>*/}

        <CardBody className={"p-1 flex flex-row gap-4"}>
          <Avatar
            src={author.avatar ?? undefined}
            alt="avatar"
            className="w-[40px] h-[40px] min-w-[40px] rounded-full aspect-square"
          />

          <div>
            <p className={"font-bold"}>{author.name}</p>
            <p
              className="max-w-xs overflow-ellipsis overflow-hidden"
              // biome-ignore lint/security/noDangerouslySetInnerHtml: Fix this later!
              dangerouslySetInnerHTML={{ __html: formattedMessage }}
            />
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

export { ChatMessage };
