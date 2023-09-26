import PusherServer from "pusher";

const globalForPusher = globalThis as unknown as {
  pusher: PusherServer | undefined;
};

const pusher =
  globalForPusher.pusher ??
  new PusherServer({
    appId: "app-id",
    key: "app-key",
    secret: "app-secret",
    //cluster: "EU",
    host: process.env.NEXT_PUBLIC_PUSHER_HOST! as string,
    port: "6001",
    useTLS: false, // idk? TODO: SOCKETI_SSL_CERT? https://docs.soketi.app/getting-started/ssl-configuration
  });

if (process.env.NODE_ENV !== "production") globalForPusher.pusher = pusher;
export default pusher;

// Trigger an event
//pusherServer.trigger(channel, event, data)
