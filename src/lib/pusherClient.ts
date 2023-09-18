import Pusher from "pusher-js";

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
