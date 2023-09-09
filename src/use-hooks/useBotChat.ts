import {useEffect, useState} from "react";
import {$Enums as enums} from '@prisma/client'
import {api} from "~/utils/api";
import {useQueryClient} from "@tanstack/react-query";
import generateUUID from "~/utils/utils";
import {toast} from "react-toastify";
import {produce} from "immer";

type MessageType = "error" | "temp";
export type Message = { role: "USER" | "BOT", content: string, type?: MessageType, id: number };
// Create a map that will hold a cache of chat messages with cursor.
const chatCache = new Map<string, Message[]>();

// TODO: Change botType to enum from prisma. Currently it checks out, but it is hardcoded.
export default function useBotChat(botId: string, botMode: "ROLEPLAY" | "ADVENTURE" | "CHAT") {
  const [messages, setMessages] = useState<Message[]>([]);
  const [shouldLoadMore, setShouldLoadMore] = useState<boolean>(false);
  const [cursor, setCursor] = useState<number | undefined>(undefined);

  useEffect(() => {
    setMessages([]);
    setCursor(undefined);
    setShouldLoadMore(true);
  }, [botId, botMode]);

  useEffect(() => {
    if (shouldLoadMore && !fetchMore.isLoading) {
      fetchMore.mutate({botId, botMode, cursor});
    }
  }, [shouldLoadMore]);

  function addMessages(newMessages: Message[]) {
    // Concat, sort, and remove duplicates and keep the newer message data.
    const combinedArr = messages
      .concat(newMessages)
      .sort((a, b) => a.id - b.id)
      .reverse()
      .filter((value, index, self) => self.findIndex(m => m.id === value.id) === index)
      .reverse();

    setMessages(() => combinedArr);
  }

  const fetchMore = api.bots.messages.useMutation({
    onSuccess: async (data) => {
      setCursor(data.nextCursor);
      addMessages(data.messages);
    },

    onSettled: async () => {
      setShouldLoadMore(false);
    }
  });

  const replyMutation = api.bots.genReply.useMutation({
      onMutate: async (variables) => {
        addMessages([{role: "USER", type: "temp", content: variables.message, id: Number.MAX_SAFE_INTEGER}]);
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
          .filter(message => message.id !== Number.MAX_SAFE_INTEGER)
          .concat([data.userMessage, data.botChatMessage])
          .filter((value, index, self) => self.findIndex(m => m.id === value.id) === index)
          .sort((a, b) => a.id - b.id);

        setMessages(updatedMessages)
      }
    }
  )

  return {
    messages,

    postMessage: (message: string) => replyMutation.mutate({botId, botMode, message}),
    loadingReply: replyMutation.isLoading,

    loadMore: () => setShouldLoadMore(true),
    loadingMore: fetchMore.isLoading,
  };
}