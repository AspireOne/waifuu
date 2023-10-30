import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { PresenceChannel } from "pusher-js";
import PresenceChannelMember from "@/server/shared/presenceChannelMember";

export type RRMessage = {
  content: string;
  id: number;
  user: PresenceChannelMember;
  type: "message";
};

export type RRSystemMessageType = "error" | "success" | "info" | "";
export type RRSystemMessage = {
  title?: string;
  content: string;
  id: number;
  messageType?: RRSystemMessageType;
  type: "system-message";
};

export type RRMessagesType = (RRMessage | RRSystemMessage)[];

let msgId = 0;
/**
 * Manages messages (fetching, sending, etc.) for a specific channel. Exposes functions to manipulate the messages.
 */
export default function useRRMessages(channel: PresenceChannel | null) {
  const [prevChannelName, setPrevChannelName] = useState<string | null>(null);
  const [messages, setMessages] = useState<RRMessagesType>([]);

  const sendMsgMutation = api.RRChat.sendMessage.useMutation({
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
        type: "message",
      },
    ]);
  }

  function addSystemMessage(
    content: string,
    title?: string,
    type?: RRSystemMessageType,
  ) {
    setMessages((prev) => [
      ...prev,
      {
        title: title,
        content: content,
        id: msgId++,
        type: "system-message",
        messageType: type,
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

    setPrevChannelName(channel.name);
    clearMessages();

    channel.bind("message", (data: any) => {
      const user: PresenceChannelMember = channel.members.get(data.from);
      const me: PresenceChannelMember = channel.members.me;

      if (me.id === user.id) return;
      addMessage(data.message, user);
    });
  }, [channel?.name]);

  return { messages, sendMessage, addSystemMessage, clearMessages };
}
