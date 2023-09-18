import { useEffect, useState } from "react";
import { api } from "~/utils/api";
import { PresenceChannel } from "pusher-js";
import PresenceChannelMember from "~/server/types/presenceChannelMember";

export type OmegleChatMessage = {
  content: string;
  id: number;
  user: PresenceChannelMember;
};

let msgId = 0;

export default function useOmegleChatMessages(channel: PresenceChannel | null) {
  const [prevChannelName, setPrevChannelName] = useState<string | null>(null);
  const [messages, setMessages] = useState<OmegleChatMessage[]>([]);

  const sendMsgMutation = api.omegleChat.sendMessage.useMutation({
    onMutate: () => {
      // Check the ID of the last message, and add this message with an id one number higher.
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

  function addMessage(content: string, user: PresenceChannelMember) {
    setMessages((prev) => [
      ...prev,
      {
        content: content,
        id: msgId++,
        user: user,
      },
    ]);
  }

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

    addMessage(content, channel.members.me);
    sendMsgMutation.mutate({ channel: channel.name, message: content });
  }

  function clearMessages() {
    setMessages([]);
  }

  useEffect(() => {
    if (!channel?.name) return;
    if (prevChannelName === channel.name) return;

    setPrevChannelName(channel.name);
    setMessages([]);

    channel.bind("message", (data: any) => {
      const user: PresenceChannelMember = channel.members.get(data.from);
      const me: PresenceChannelMember = channel.members.me;

      if (me.id === user.id) return;

      console.log(JSON.stringify(data));

      addMessage(data.message, user);
    });
  }, [channel]);

  return { messages, sendMessage, clearMessages };
}
