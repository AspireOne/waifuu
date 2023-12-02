import { getIdToken } from "@/lib/firebase";
import { baseApiUrl } from "@/lib/paths";
import Pusher from "pusher-js";

const pusherClient =
  Pusher.instances.length > 0
    ? Pusher.instances[0]!
    : new Pusher("app-key", {
        wsHost: process.env.NEXT_PUBLIC_PUSHER_HOST as string,
        wsPort: 6001,
        forceTLS: false,
        disableStats: true,
        enabledTransports: ["ws", "wss"],
        cluster: "EU",
        authEndpoint: baseApiUrl("/pusher/authenticate"),
        // @ts-ignore
        userAuthentication: {
          endpoint: baseApiUrl("/pusher/authenticate"),
          headersProvider: async () => ({
            Authorization: `Bearer ${await getIdToken()}`,
          }),
        },
        // @ts-ignore
        channelAuthorization: {
          endpoint: baseApiUrl("/pusher/authorize"),
          headersProvider: async () => ({
            Authorization: `Bearer ${await getIdToken()}`,
          }),
        },
      });

pusherClient.signin();
export { pusherClient };
