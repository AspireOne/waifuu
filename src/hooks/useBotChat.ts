import { api } from "@/lib/api";
import { BotChatRole, Mood } from "@prisma/client";
import { useEffect, useState } from "react";

type MessageStatus = "error" | "temp";

export type Message = {
  role: BotChatRole;
  content: string;
  mood?: Mood;
  type?: MessageStatus;
  id: number;
};
// Create a map that will hold a cache of chat messages with cursor.
const chatCache = new Map<string, Message[]>();

/**
 * Allows interaction with a chatbot.
 *
 * @param chatId
 * @param {boolean} [enabled=true] - Flag indicating whether this is at all active. Can be used to postpone
 * querying or loading before the botId or botMode is available.
 * @returns An object containing chat messages and functions to interact with the chat.
 */
export default function useBotChat(chatId: string, enabled = true) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [shouldLoadMore, setShouldLoadMore] = useState<boolean>(false);
  const [cursor, setCursor] = useState<number | undefined>(undefined);

  const fetchMore = api.chat.messages.useMutation({
    onSuccess: async (data) => {
      setCursor(data.nextCursor);
      addMessages(data.messages);
    },
  });

  useEffect(() => {
    setMessages([]);
    setCursor(undefined);
    setShouldLoadMore(true);
  }, [chatId]);

  useEffect(() => {
    if (shouldLoadMore && !fetchMore.isLoading && !!chatId && enabled) {
      fetchMore.mutate({ chatId, cursor });
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

    onSuccess: (data) => {
      const updatedMessages = messages
        .filter((message) => message.id !== Number.MAX_SAFE_INTEGER)
        .concat([data.userMessage, data.message])
        .filter((value, index, self) => self.findIndex((m) => m.id === value.id) === index)
        .sort((a, b) => a.id - b.id);

      setMessages(updatedMessages);
    },
  });

  function addMessages(newMessages: Message[]) {
    // Concat, sort, and remove duplicates and keep the newer message data.
    const combinedArr = messages
      .concat(newMessages)
      .sort((a, b) => a.id - b.id)
      .reverse()
      .filter((value, index, self) => self.findIndex((m) => m.id === value.id) === index)
      .reverse();

    setMessages(() => combinedArr);
  }

  return {
    messages,
    postMessage: (message: string) => {
      if (!enabled || !chatId) return;
      replyMutation.mutate({
        chatId,
        message,
      });
    },
    loadingReply: replyMutation.isLoading,
    loadMore: () => setShouldLoadMore(true),
    loadingMore: fetchMore.isLoading,
  };
}
