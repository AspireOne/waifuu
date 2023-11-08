import useBotChat from "@hooks/useBotChat";
import { MutableRefObject, useEffect, useState } from "react";

/**
 * Fix scroll position when loading more messages (so that it stays relatively on the same place, even
 * when new messages are added).
 * @param props
 */
export const useFixLoadMoreScrollJitter = (props: {
  containerRef: MutableRefObject<HTMLDivElement | null>;
  chat: ReturnType<typeof useBotChat>;
}) => {
  const [scrollPosBeforeLoad, setScrollPosBeforeLoad] = useState<number>(0);
  const { containerRef: container, chat } = props;

  useEffect(() => {
    if (!container.current) return;

    const maxY = container.current.scrollHeight - container.current.clientHeight;

    if (chat.loadingMore) {
      setScrollPosBeforeLoad(maxY);
    } else {
      container.current.scrollTop = maxY - scrollPosBeforeLoad;
    }
  }, [chat.loadingMore]);
};
