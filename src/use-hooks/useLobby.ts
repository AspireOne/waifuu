import Pusher, { Channel } from "pusher-js";
import { useEffect } from "react";

const pusherClient =
  Pusher.instances.length > 0
    ? Pusher.instances[0]!
    : new Pusher("app-key", {
        wsHost: "127.0.0.1",
        wsPort: 6001,
        forceTLS: false,
        disableStats: true,
        enabledTransports: ["ws", "wss"],
        cluster: "EU",
      });
    
let lobbyChannel: Channel | undefined;

const useLobby = () => {
    useEffect(() => {
        if(lobbyChannel) return;

        lobbyChannel = pusherClient.subscribe("lobby");

        lobbyChannel.bind("room_matched", () => {
            alert("room matched");
        });
    }, []);
}

export { useLobby };