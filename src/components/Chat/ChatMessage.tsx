import { useMemo } from "react";
import { ChatMessageProps } from "./types";
import Image from "next/image";
import { BsThreeDotsVertical } from "react-icons/bs";

const ChatMessage = ({ author, message }: ChatMessageProps) => {
  const formattedMessage = useMemo(() => {
    return message
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      .replace(/\*(.*?)\*/g, "<em>$1</em>")
      .replace(/__(.*?)__/g, "<strong>$1</strong>")
      .replace(/_(.*?)_/g, "<em>$1</em>")
      .replace(/~~(.*?)~~/g, "<s>$1</s>")
      .replace(/`(.*?)`/g, "<code>$1</code>")
      .replace(/```(.*?)```/g, "<pre>$1</pre>");
  }, [message]);
  return (
    <div className={`flex ${author.bot ? "ml-0" : "mr-0 flex-row"} mx-auto w-fit gap-2`}>
      <div>
        <BsThreeDotsVertical size={24} color="white" />
      </div>

      <p
        className={`${
          author.bot ? "bg-white" : "bg-white bg-opacity-20 text-white"
        } max-w-[70%] rounded-lg p-3`}
        dangerouslySetInnerHTML={{ __html: formattedMessage }}
      />

      <div>
        <Image
          src="/assets/defaultuser.jpg"
          alt="profile-picture"
          height={50}
          width={50}
          className="h-10 w-10 rounded-full"
        />
      </div>
    </div>
  );
};

export { ChatMessage };
