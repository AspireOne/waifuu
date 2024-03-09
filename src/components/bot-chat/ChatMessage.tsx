import { makeDownloadUrl } from "@/lib/utils";
import { api } from "@lib/api";
import { Card, CardBody } from "@nextui-org/card";
import { Avatar, Button } from "@nextui-org/react";
import { Feedback, Mood } from "@prisma/client";
import { useLongPress } from "@react-aria/interactions";
import Markdown from "markdown-to-jsx";
import { PropsWithChildren, useState } from "react";
import { AiFillDislike, AiFillLike } from "react-icons/ai";
import { toast } from "react-toastify";
import { twMerge } from "tailwind-merge";

type Props = {
  message: string;
  messageId: number;
  chatId: string;
  feedback?: Feedback;
  className?: string;
  author: {
    bot: boolean;
    avatar?: string | null;
    name: string;
  };
  mood?: Mood;

  selected?: boolean;
  onClick?: () => void;
  onLongClick?: () => void;
};

const ChatMessage = ({
  author,
  message,
  className,
  mood,
  messageId,
  chatId,
  feedback,
  selected,
  onClick,
  onLongClick,
}: Props) => {
  const logFeedbackMutation = api.chat.logFeedback.useMutation({
    onSuccess: (data, variables, context) => {
      console.log("Feedback logged!");
      if (variables.feedback === null) return;
      toast("Thank you for your feedback!", {
        type: "success",
        autoClose: 1500,
        position: "top-center",
      });
    },
  });

  const [currFeedback, setCurrFeedback] = useState<Feedback | undefined>(undefined);

  function handleFeedback(type: Feedback) {
    if (type === currFeedback) setCurrFeedback(undefined);
    else setCurrFeedback(type);

    logFeedbackMutation.mutate({
      messageId,
      feedback: type === currFeedback ? null : type,
      chatId,
    });
  }

  const getFeedbackColor = (type: Feedback) => {
    if (currFeedback === undefined) return "text-default-300";
    if (currFeedback === type) return "text-primary-400/80";
    if (currFeedback !== type) return "text-default-200";
  };

  const { longPressProps } = useLongPress({
    accessibilityDescription: "Long press to activate hyper speed",
    onLongPressStart: () => {},
    onLongPressEnd: () => {},
    onLongPress: () => {
      onLongClick?.();
    },
  });

  return (
    <div
      className={twMerge(
        "flex mx-auto w-full gap-2",
        author.bot ? "ml-0" : "mr-0 flex-row",
        className,
      )}
      {...longPressProps}
      onClick={onClick}
    >
      <Card
        className={twMerge(
          "w-full rounded-lg p-3 bg-neutral-900/80 backdrop-blur-lg relative",
          selected && "bg-primary-500/20",
        )}
      >
        <div
          className={twMerge(
            "absolute flex flex-row right-0 top-0 z-10",
            !author.bot && "hidden",
          )}
        >
          <Button isIconOnly variant={"light"} onClick={() => handleFeedback(Feedback.LIKE)}>
            <AiFillLike size={20} className={getFeedbackColor(Feedback.LIKE)} />
          </Button>
          <Button
            isIconOnly
            variant={"light"}
            onClick={() => handleFeedback(Feedback.DISLIKE)}
          >
            <AiFillDislike size={20} className={getFeedbackColor(Feedback.DISLIKE)} />
          </Button>
        </div>
        <CardBody className={"p-1 flex flex-row gap-4"}>
          <Avatar
            src={makeDownloadUrl(author.avatar) ?? undefined}
            alt="avatar"
            className="w-[40px] h-[40px] min-w-[40px] rounded-full aspect-square"
          />
          <div>
            <p className={"font-bold"}>{author.name}</p>
            <Markdown
              className="max-w-xs overflow-ellipsis overflow-hidden whitespace-pre-line"
              options={{
                forceBlock: true,
                overrides: {
                  em: {
                    component: (props: PropsWithChildren) => (
                      <em className="italic block text-foreground-600">{props.children}</em>
                    ),
                  },
                },
              }}
            >
              {message}
            </Markdown>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

export { ChatMessage };
