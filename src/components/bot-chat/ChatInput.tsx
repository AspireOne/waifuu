import { Button } from "@nextui-org/react";
import { useState } from "react";
import { RiSendPlane2Fill } from "react-icons/ri";
import TextareaAutosize from "react-textarea-autosize";
import { twMerge } from "tailwind-merge";

const ChatInput = (props: {
  placeholder?: string;
  className?: string;
  inputClassname?: string;
  disabled?: boolean;
  onSend: (content: string) => void;
}) => {
  const [input, setInput] = useState<string>("");

  function handleClick() {
    if (props.disabled) return;
    if (!input.trim()) return;
    props.onSend(input.trim());
    setInput("");
  }

  return (
    <div
      className={twMerge(
        "mx-auto flex flex-row w-full items-end gap-2 sm:w-[400px] md:w-[500px] lg:w-[700px]",
        props.className,
      )}
    >
      {/*TODO: Style this like Kuba wanted to (transparent bg, border)*/}
      <TextareaAutosize
        rows={1}
        minRows={1}
        maxRows={4}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder={props.placeholder ?? "Your message..."}
        className={twMerge(
          "flex-1 rounded-lg border-1 border-white bg-transparent p-3 text-white outline-none",
          props.inputClassname,
        )}
      />

      <Button
        isIconOnly
        className={twMerge(
          "h-12 w-16",
          props.disabled ? "bg-zinc-800 dark:bg-zinc-500" : "bg-black dark:bg-white",
        )}
        onClick={handleClick}
      >
        <RiSendPlane2Fill size={30} color="black" />
      </Button>
    </div>
  );
};

export default ChatInput;
