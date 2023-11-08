import { Capacitor } from "@capacitor/core";
import { Button } from "@nextui-org/react";
import React, { useState } from "react";
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

  function submit() {
    if (props.disabled) return;
    if (!input.trim()) return;
    props.onSend(input.trim());
    setInput("");
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey && Capacitor.getPlatform() === "web") {
      e.preventDefault();
      submit();
    }
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
        onKeyDown={handleKeyDown}
        onChange={(e) => setInput(e.target.value)}
        placeholder={props.placeholder ?? "Message..."}
        className={twMerge(
          "flex-1 rounded-lg border-1 border-gray-400 bg-transparent p-3 text-white outline-none",
          props.inputClassname,
        )}
      />

      <Button
        isIconOnly
        disabled={props.disabled}
        className={twMerge(
          "h-12 w-16",
          props.disabled ? "bg-zinc-800 dark:bg-zinc-500" : "bg-black dark:bg-gray-200",
        )}
        onClick={submit}
      >
        <RiSendPlane2Fill size={30} color="black" />
      </Button>
    </div>
  );
};

export default ChatInput;
