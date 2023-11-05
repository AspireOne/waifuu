import { MutableRefObject, useEffect, useState } from "react";
import useBotChat from "@hooks/useBotChat";

/**
 * This hook is used to load more messages when the user scrolls to the top of the chat.
 * It calls the loadMore function directly.
 * @param props
 */
export const useLoadMore = (props: {
  containerRef: MutableRefObject<HTMLDivElement | null>;
  chat: ReturnType<typeof useBotChat>;
}) => {
  const [lastLoadMoreTime, setLastLoadMoreTime] = useState<number>(0);
  const [loadBuffered, setLoadBuffered] = useState<boolean>(false);

  const { chat, containerRef: container } = props;

  useEffect(() => {
    const ref = container.current;
    if (!ref) return;

    const handleScroll = () => {
      if (
        container.current?.scrollTop != null &&
        container.current.scrollTop <= 5 &&
        !chat.loadingMore &&
        chat.hasMore
      ) {
        if (loadBuffered) return;

        if (Date.now() - lastLoadMoreTime > 1000) {
          loadMore();
          return;
        }

        setLoadBuffered(true);
        setTimeout(() => {
          setLoadBuffered(false);
          loadMore();
        }, 1000);
      }
    };

    const loadMore = () => {
      setLastLoadMoreTime(Date.now());
      chat.loadMore();
    };

    ref.addEventListener("scroll", handleScroll);

    return () => ref.removeEventListener("scroll", handleScroll);
  }, [chat.loadMore, container.current]);
};
