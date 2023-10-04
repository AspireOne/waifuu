import { useEffect, useState } from "react";
import { BotChatRole, BotMode } from "@prisma/client";
import { api } from "~/utils/api";
import { toast } from "react-toastify";

type MessageStatus = "error" | "temp";
export type Message = {
  role: BotChatRole;
  content: string;
  type?: MessageStatus;
  id: number;
};
// Create a map that will hold a cache of chat messages with cursor.
const chatCache = new Map<string, Message[]>();

/**
 * Allows interaction with a chatbot.
 *
 * @param {boolean} [enabled=true] - Flag indicating whether this is at all active. Can be used to postpone
 * querying or loading before the botId or botMode is available.
 * @returns {Object} An object containing chat messages and functions to interact with the chat.
 */
export default function useBotChat(chatId: string, enabled: boolean = true) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [shouldLoadMore, setShouldLoadMore] = useState<boolean>(false);
  const [cursor, setCursor] = useState<number | undefined>(undefined);

  const fetchMore = api.bots.messages.useMutation({
    onSuccess: async (data) => {
      // setCursor(data.nextCursor);
      // addMessages(data.messages);
    },

    onSettled: async () => {
      setShouldLoadMore(false);
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
    }
  }, [shouldLoadMore, fetchMore.isLoading, chatId, enabled]);

  const replyMutation = api.bots.genReply.useMutation({
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
      toast("Something went wrong.", {
        position: "top-center",
        type: "error",
      });
      console.error(error);

      /*setMessages(prevMessages => {
          return produce(prevMessages, draft => {

            if (draft.length === 0) return;
            const lastMessage = draft[draft.length - 1];
            lastMessage!.type = "error";
          });
        });*/
    },

    onSuccess: (data, variables, context) => {
      const updatedMessages = messages
        .filter((message) => message.id !== Number.MAX_SAFE_INTEGER)
        .concat([data.userMessage, data.botChatMessage])
        .filter(
          (value, index, self) =>
            self.findIndex((m) => m.id === value.id) === index,
        )
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
      .filter(
        (value, index, self) =>
          self.findIndex((m) => m.id === value.id) === index,
      )
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
