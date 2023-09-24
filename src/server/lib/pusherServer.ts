import PusherServer from "pusher";
import { env } from "~/server/env";

const globalForPusher = globalThis as unknown as {
  pusher: PusherServer | undefined;
};

const pusher =
  globalForPusher.pusher ??
  new PusherServer({
    appId: env().NEXT_PUBLIC_PUSHER_APP_ID,
    key: env().NEXT_PUBLIC_PUSHER_APP_KEY,
    secret: env().PUSHER_SECRET,
    cluster: "EU",
    host: env().NEXT_PUBLIC_PUSHER_HOST,
    port: env().NEXT_PUBLIC_PUSHER_PORT,
    useTLS: false, // idk? TODO: SOCKETI_SSL_CERT? https://docs.soketi.app/getting-started/ssl-configuration
  });

if (process.env.NODE_ENV !== "production") globalForPusher.pusher = pusher;
export default pusher;

// Trigger an event
//pusherServer.trigger(channel, event, data)
