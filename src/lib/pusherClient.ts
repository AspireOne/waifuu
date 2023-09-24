import Pusher from "pusher-js";
import { clientEnv } from "~/server/env";

const pusherClient =
  Pusher.instances.length > 0
    ? Pusher.instances[0]!
    : new Pusher(clientEnv().NEXT_PUBLIC_PUSHER_APP_KEY, {
        wsHost: clientEnv().NEXT_PUBLIC_PUSHER_HOST,
        wsPort: Number(clientEnv().NEXT_PUBLIC_PUSHER_PORT),
        forceTLS: false,
        disableStats: true,
        enabledTransports: ["ws", "wss"],
        cluster: "EU",
        authEndpoint: "/api/pusher/authenticate",
        // @ts-ignore
        userAuthentication: {
          endpoint: "/api/pusher/authenticate",
        },
        // @ts-ignore
        channelAuthorization: {
          endpoint: "/api/pusher/authorize",
        },
      });

pusherClient.signin();
export { pusherClient };
