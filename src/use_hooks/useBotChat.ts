import {useEffect, useState} from "react";
import {$Enums as enums} from '@prisma/client'
import {api} from "~/utils/api";
import {useQueryClient} from "@tanstack/react-query";
import generateUUID from "~/utils/utils";
import {toast} from "react-toastify";

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
    // Concat, sort and remove duplicates.
    const combinedArr = messages
      .concat(newMessages)
      .sort((a, b) => a.id - b.id)
      .reverse()
      .filter((value, index, self) => self.findIndex(m => m.id === value.id) === index)
      .reverse();

    setMessages(() => combinedArr);
  }

  function removeMessage(id: number) {
    const updatedMessages = messages.filter(message => message.id !== id);
    setMessages(updatedMessages);
    return updatedMessages;
  }

  const fetchMore = api.bots.infiniteMessages.useMutation({
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
        // Add a placeholder message.
        addMessages([{role: "USER", content: variables.message, id: 1000000000}]);
      },

      onError: (error) => {
        toast("Something went wrong.", {
          position: "top-center",
          type: "error",
        });
        console.error(error);
      },

      onSettled: async (data) => {
        if (!data) return;
        console.log(data.userMessage);
        console.log("VVVVVV");

        const updatedMessages = messages.filter(message => message.id !== 1000000000)
          .concat([data.userMessage, data.botMessage])
          .filter((value, index, self) => self.findIndex(m => m.id === value.id) === index)
          .sort((a, b) => a.id - b.id);

        //removeMessage(1000000000);
        setMessages(updatedMessages)
        //setTimeout(() => setMessages(updatedMessages), 1000);
      },
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