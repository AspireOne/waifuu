import { useMemo } from "react";
import { ChatMessageProps } from "./types";
import Image from "next/image";
import { BsThreeDotsVertical } from "react-icons/bs";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownSection,
  DropdownItem,
  Button,
} from "@nextui-org/react";

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
    <div
      className={`flex ${
        author.bot ? "ml-0" : "mr-0 flex-row"
      } mx-auto w-fit gap-2`}
    >
      <Dropdown className="flex-none">
        <DropdownTrigger>
          <button>
            <BsThreeDotsVertical size={24} color="white" />
          </button>
        </DropdownTrigger>
        <DropdownMenu aria-label="Static Actions">
          <DropdownItem key="edit">Edit</DropdownItem>
          <DropdownItem key="delete" className="text-danger" color="danger">
            Delete
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>

      <p
        className={`${
          author.bot ? "bg-white" : "bg-white bg-opacity-20 text-white"
        } max-w-[70%] rounded-lg p-3`}
        dangerouslySetInnerHTML={{ __html: formattedMessage }}
      />

      <Image
        src="/assets/defaultuser.jpg"
        alt="profile-picture"
        height={50}
        width={50}
        className="h-10 w-10 rounded-full"
      />
    </div>
  );
};

export { ChatMessage };
