import { ScrollShadow } from "@nextui-org/react";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { PropsWithChildren } from "react";
import { ChatTypingIndicator } from "~/components/chat/ChatTypingIndicator";

export default function ChatMessagesContainer(
  props: PropsWithChildren<{ typing?: boolean }>,
) {
  const [chatParent] = useAutoAnimate();

  return (
    <ScrollShadow className="flex h-32 flex-col gap-7 overflow-scroll overflow-x-visible scrollbar scrollbar-track-transparent scrollbar-thumb-gray-700">
      <div ref={chatParent}>{props.children}</div>
      {props.typing && <ChatTypingIndicator />}
    </ScrollShadow>
  );
}
