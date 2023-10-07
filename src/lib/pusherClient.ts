import Pusher from "pusher-js";
import { apiBase } from "~/utils/constants";

const pusherClient =
  Pusher.instances.length > 0
    ? Pusher.instances[0]!
    : new Pusher("app-key", {
        wsHost: process.env.NEXT_PUBLIC_PUSHER_HOST! as string,
        wsPort: 6001,
        forceTLS: false,
        disableStats: true,
        enabledTransports: ["ws", "wss"],
        cluster: "EU",
        authEndpoint: apiBase("/api/pusher/authenticate"),
        // @ts-ignore
        userAuthentication: {
          endpoint: apiBase("/api/pusher/authenticate"),
        },
        // @ts-ignore
        channelAuthorization: {
          endpoint: apiBase("/api/pusher/authorize"),
        },
      });

pusherClient.signin();
export { pusherClient };
