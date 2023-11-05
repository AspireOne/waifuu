import { RefObject, useEffect } from "react";
import useBotChat from "@hooks/useBotChat";

/**
 * Scrolls to the latest message in the chat when it is received and the use is not scrolling in history.
 * @param props
 */
export const useScrollToLatest = (props: {
  containerRef: RefObject<HTMLDivElement | null>;
  bottomRef: RefObject<HTMLDivElement | null>;
  chat: ReturnType<typeof useBotChat>;
}) => {
  const { containerRef: container, bottomRef, chat } = props;

  useEffect(() => {
    if (!container.current) return;

    const currY = container.current.scrollTop;
    const maxY = container.current.scrollHeight - container.current.clientHeight - 1;

    if (maxY - currY < 220) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [chat.messages]);
};
