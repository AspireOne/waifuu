import { useMemo } from "react";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Image,
} from "@nextui-org/react";
import { twMerge } from "tailwind-merge";
import { Card, CardBody } from "@nextui-org/card";
import { BsThreeDotsVertical } from "react-icons/bs";

type Props = {
  message: string;
  className?: string;
  key: any;
  author: {
    bot: boolean;
    avatar?: string | null;
    name: string;
  };
};

const ChatMessage = ({ author, message, key, className }: Props) => {
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
      key={key}
      className={twMerge(
        `flex mx-auto w-full gap-2`,
        author.bot ? "ml-0" : "mr-0 flex-row",
        className,
      )}
    >
      <Card className={twMerge("w-full rounded-lg p-3")}>
        {/*Comment this out for now, because it is not needed.*/}
        {/*<MsgDropdown/>*/}

        <CardBody className={"p-1 flex flex-row gap-4"}>
          <Image
            referrerPolicy="no-referrer"
            src={author.avatar ?? "/assets/default_user.jpg"}
            alt="profile-picture"
            className="w-10 rounded-full aspect-square"
          />

          <div>
            <p className={"font-bold"}>{author.name}</p>
            <p dangerouslySetInnerHTML={{ __html: formattedMessage }} />
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

function MsgDropdown() {
  return (
    <Dropdown className="flex-none">
      <DropdownTrigger>
        <button>
          <BsThreeDotsVertical size={24} color="white" />
        </button>
      </DropdownTrigger>
      <DropdownMenu aria-label="Static Actions">
        <DropdownItem className="text-white" key="edit">
          Edit
        </DropdownItem>
        <DropdownItem key="delete" className="text-danger" color="danger">
          Delete
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
}

export { ChatMessage };
