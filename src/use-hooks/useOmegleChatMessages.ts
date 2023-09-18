import { useEffect, useState } from "react";
import { api } from "~/utils/api";

export type OmegleChatMessage = {
  content: string;
  id: number;
  user: any;
};

export default function useOmegleChatMessages(
  channelName: string | null,
  bindEvent: ((ev: string, callback: (e: string) => void) => void) | null,
) {
  const [prevChannelName, setPrevChannelName] = useState<string | null>(null);
  const [messages, setMessages] = useState<OmegleChatMessage[]>([]);

  const sendMsgMutation = api.omegleChat.sendMessage.useMutation({
    onMutate: () => {
      // Check the ID of the last message, and add this message with an id one number higher.
      console.log("Sending Message - Channel: " + channelName);
    },
    onSuccess: (data) => {
      console.log("Message sent.");
    },
    onError: (error) => {
      console.log(error.data);
      console.log("Error sending message: " + error.message);
    },
  });

  function sendMessage(content: string) {
    content = content.trim();
    if (!channelName) {
      console.error("Attempted to send a message with no channel specified.");
      return;
    }
    if (!content) {
      console.error("Attempted to send an empty message.");
      return;
    }

    sendMsgMutation.mutate({ channel: channelName, message: content });
  }

  function clearMessages() {
    setMessages([]);
  }

  useEffect(() => {
    if (!channelName) return;
    if (prevChannelName === channelName) return;

    setPrevChannelName(channelName);
    setMessages([]);

    if (!bindEvent)
      throw new Error(
        "Channel name supplied, but bind event not. This should not happen.",
      );
    bindEvent("message", (data: any) => {
      // add id to the message.
      console.log(data);
      console.log(JSON.stringify(data));
    });
  }, [channelName]);

  return { messages, sendMessage, clearMessages };
}
