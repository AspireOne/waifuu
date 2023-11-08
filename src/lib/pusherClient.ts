import { apiBase } from "@/lib/api";
import { getIdToken } from "@/lib/firebase";
import Pusher from "pusher-js";

const pusherClient =
  Pusher.instances.length > 0
    ? // biome-ignore lint/style/noNonNullAssertion: Will not be null.
      Pusher.instances[0]!
    : new Pusher("app-key", {
        wsHost: process.env.NEXT_PUBLIC_PUSHER_HOST as string,
        wsPort: 6001,
        forceTLS: false,
        disableStats: true,
        enabledTransports: ["ws", "wss"],
        cluster: "EU",
        authEndpoint: apiBase("/api/pusher/authenticate"),
        // @ts-ignore
        userAuthentication: {
          endpoint: apiBase("/api/pusher/authenticate"),
          headersProvider: async () => ({
            Authorization: `Bearer ${await getIdToken()}`,
          }),
        },
        // @ts-ignore
        channelAuthorization: {
          endpoint: apiBase("/api/pusher/authorize"),
          headersProvider: async () => ({
            Authorization: `Bearer ${await getIdToken()}`,
          }),
        },
      });

pusherClient.signin();
export { pusherClient };
