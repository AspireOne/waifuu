import { api } from "@/lib/api";
import { ChatRole, Mood, Place } from "@prisma/client";
import { useEffect, useState } from "react";

type MessageStatus = "error" | "temp";

export type Message = {
  role: ChatRole;
  content: string;
  mood?: Mood;
  place?: Place | undefined;
  type?: MessageStatus;
  id: number;
};

// TODO: CACHING.
/**
 * Allows interaction with a chatbot.
 *
 * @param chatId
 * @param {boolean} [enabled=true] - Flag indicating whether this is at all active. Can be used to postpone
 * querying or loading before the botId or chatMode is available.
 * @returns An object containing chat messages and functions to interact with the chat.
 */
export default function useBotChat(chatId: string, enabled = true) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [shouldLoadMore, setShouldLoadMore] = useState<boolean>(false);
  const [cursor, setCursor] = useState<number | undefined>(undefined);

  const fetchMore = api.chat.messages.useMutation({
    onSuccess: async (data) => {
      setCursor(data.nextCursor);
      addMessages((data.messages as Message[]).reverse());
    },
  });

  useEffect(() => {
    setMessages([]);
    setCursor(undefined);
    setShouldLoadMore(true);
  }, [chatId]);

  useEffect(() => {
    if (shouldLoadMore && !fetchMore.isLoading && !!chatId && enabled) {
      fetchMore.mutate({
        chatId,
        cursor,
      });
      setShouldLoadMore(false);
    }
  }, [shouldLoadMore, fetchMore.isLoading, chatId, enabled]);

  const replyMutation = api.chat.genReply.useMutation({
    onMutate: async (variables) => {
      addMessages([
        {
          role: "USER",
          type: "temp",
          content: variables.message,
          id: Number.MAX_SAFE_INTEGER,
        },
      ]);
    },

    onError: (error) => {
      // setMessages(prevMessages => {
      //   return produce(prevMessages, draft => {
      //     if (draft.length === 0) return;
      //     const lastMessage = draft[draft.length - 1];
      //     lastMessage!.type = "error";
      //   });
      // });
    },

    onSuccess: (data: unknown) => {
      setMessages((prevState) => {
        const messageMap: Map<number, Message> = new Map();

        const messageData = prevState
          .filter((message) => message.id !== Number.MAX_SAFE_INTEGER)
          .concat([
            (data as { userMessage: Message }).userMessage,
            (data as { message: Message }).message,
          ]);

        for (const message of messageData) {
          messageMap.set(message.id, message);
        }

        return Array.from(messageMap.values());
      });
    },
  });

  function addMessages(newMessages: Message[]): void {
    setMessages((prevState) => {
      const messageMap: Map<number, Message> = new Map();

      for (const message of [...prevState, ...newMessages]) {
        messageMap.set(message.id, message);
      }

      return Array.from(messageMap.values());
    });
  }

  return {
    messages,
    id: chatId,
    loadingMore: fetchMore.isLoading,
    hasMore: cursor !== undefined,
    loadingReply: replyMutation.isLoading,
    postMessage: (message: string) => {
      if (!enabled || !chatId) return;
      replyMutation.mutate({
        chatId,
        message,
      });
    },
    loadMore: () => setShouldLoadMore(true),
  };
}
