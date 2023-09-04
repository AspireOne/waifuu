import { Button, Input } from "@nextui-org/react";
import { RiSendPlane2Fill } from "react-icons/ri";

const ChatInput = () => {
  return (
    <div className="flex flex-row gap-2">
      <input
        placeholder="Your message..."
        className="w-full rounded-lg border-2 border-white bg-transparent p-3 text-white outline-none"
        type="text"
      />

      <button className="w-13 h-13 rounded-lg bg-white p-2">
        <RiSendPlane2Fill size={30} color="black" />
      </button>
    </div>
  );
};

export { ChatInput };
