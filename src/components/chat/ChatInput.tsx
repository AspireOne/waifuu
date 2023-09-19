import { twMerge } from "tailwind-merge";
import { Button } from "@nextui-org/react";
import { RiSendPlane2Fill } from "react-icons/ri";

const ChatInput = (props: {
  placeholder?: string;
  className?: string;
  inputClassname?: string;
}) => (
  <div
    className={twMerge(
      "mx-auto flex w-full flex-row gap-2 sm:w-[400px] md:w-[500px] lg:w-[700px]",
      props.className,
    )}
  >
    <input
      placeholder={props.placeholder ?? "Your message..."}
      className={twMerge(
        "flex-1 rounded-lg border-1 border-white bg-transparent p-3 text-white outline-none",
        props.inputClassname,
      )}
      type="text"
    />

    <Button isIconOnly className={"h-12 w-16 bg-white"}>
      <RiSendPlane2Fill size={30} color="black" />
    </Button>
  </div>
);

export default ChatInput;
