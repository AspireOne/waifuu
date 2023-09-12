// TypeScript, using React
import { useEffect, useState } from "react";
import Pusher, { Channel } from "pusher-js";
import { Lobby, RoomChannel } from "~/pusherData";

type Message = {
  userId: string;
  message: string;
};

type Room = {
  id: string;
  topic: string;
};

const pusherClient =
  Pusher.instances.length > 0
    ? Pusher.instances[0]!
    : new Pusher("app-key", {
        wsHost: "127.0.0.1",
        wsPort: 6001,
        forceTLS: false, // idk?
        disableStats: true,
        enabledTransports: ["ws", "wss"], // For Socketi.
        cluster: "EU",
      });

let lobbyChannel: Channel | undefined;
let roomChannel: Channel | undefined;

export function useOmegleChat(userId: string) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [typing, setTyping] = useState<boolean>(false);
  const [status, setStatus] = useState<"finding" | "chatting" | "none">("none");
  const [room, setRoom] = useState<Room | null>(null);
  const [typingTimeout, setTypingTimeout] = useState<
    NodeJS.Timeout | undefined
  >(undefined);

  // Manage lobby connection.
  useEffect(() => {
    // If stopped finding, unsubscribe from lobby channel.
    if (status !== "finding" && lobbyChannel?.subscribed) {
      pusherClient.unsubscribe(Lobby.name);
    }

    // If started finding, subscribe to lobby channel.
    if (status === "finding" && !lobbyChannel?.subscribed) {
      if (lobbyChannel) {
        lobbyChannel.subscribe();
      } else {
        lobbyChannel = pusherClient.subscribe(Lobby.name);
        lobbyChannel.bind(Lobby.event.roomMatched, (data: any) => {
          setRoom({ id: data.roomId, topic: data.topic });
          setStatus("chatting");
        });
      }
    }

    return () => {
      lobbyChannel?.unsubscribe();
      lobbyChannel = undefined;
    };
  }, [status]);

  // Manage room connection.
  useEffect(() => {
    // If stopped chatting, unsubscribe from room channel.
    if (status !== "chatting" && roomChannel?.subscribed) {
      roomChannel.unsubscribe();
      roomChannel = undefined;
    }

    // If started chatting, subscribe to room channel.
    if (status === "chatting" && !roomChannel) {
      if (!room)
        throw new Error("Undefined state, chatting but room not defined.");
      roomChannel = pusherClient.subscribe(RoomChannel.name(room.id));
      bindRoomEvents(roomChannel);
    }

    return () => {
      roomChannel?.unsubscribe();
      roomChannel = undefined;
    };
  }, [status]);

  function leaveRoom() {
    if (room === null || !roomChannel?.subscribed) return;

    setStatus("none");
    setRoom(null);
  }

  function findRoom() {
    setStatus("finding");
    setMessages([]);
  }

  function bindRoomEvents(channel: Channel) {
    channel.bind("pusher:subscription_succeeded", () => {
      console.log("Successfully subscribed! (connected to room channel)");
    });

    channel.bind("new_message", (data: any) => {
      console.log("New room message received: ", data);
      setMessages((prev) => [...prev, data]);
    });

    channel.bind("user_typed", (data: any) => {
      if (data.userId === userId) return;

      clearTimeout(typingTimeout);

      if (data.isTyping) {
        setTyping(true);
        setTypingTimeout(
          setTimeout(() => {
            setTyping(false);
          }, 3000),
        );
      } else {
        setTyping(false);
      }
    });

    channel.bind("pusher:member_removed", () => {
      console.log(
        "A user has left the chat room. (pusher:member_removed from presence channel)",
      );
      leaveRoom();
    });
  }

  return {
    messages,
    typing,
    endChat: leaveRoom,
    findChat: findRoom,
    status,
  };
}

export default useOmegleChat;
