import { PresenceChannel } from "pusher-js";
import { useEffect, useState } from "react";
import { api } from "~/utils/api";

export type OmegleChatMessage = {
  content: string;
  user: any;
};

export default function useOmegleChatMessages(channel: PresenceChannel | null) {
  const [prevChannelName, setPrevChannelName] = useState<string | null>(null);
  const [messages, setMessages] = useState<OmegleChatMessage[]>([]);

  const sendMsgMutation = api.omegleChat.sendMessage.useMutation({
    onMutate: () => {
      console.log("Sending Message - Channel: " + channel?.name);
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
    if (!channel?.name) {
      console.error("Attempted to send a message with no channel specified.");
      return;
    }
    if (!content) {
      console.error("Attempted to send an empty message.");
      return;
    }

    sendMsgMutation.mutate({ channel: channel.name, message: content });
  }

  function clearMessages() {
    setMessages([]);
  }

  // TODO: Odepsat bertovi.
  useEffect(() => {
    if (!channel) return;
    if (prevChannelName === channel.name) return;

    setPrevChannelName(channel.name);
    setMessages([]);

    channel.bind("message", (data: any) => {
      console.log(data);
      console.log(JSON.stringify(data));
    });
  }, [channel]);

  return { messages, sendMessage, clearMessages };
}
