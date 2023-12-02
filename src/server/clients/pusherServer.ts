import { global } from "@/server/global";
import PusherServer from "pusher";

// biome-ignore lint/suspicious/noAssignInExpressions: off.
export default (global.pusher ??= new PusherServer({
  appId: "app-id",
  key: "app-key",
  secret: "app-secret",
  //cluster: "EU",
  host: process.env.NEXT_PUBLIC_PUSHER_HOST as string,
  port: "6001",
  useTLS: false, // idk? TODO: SOCKETI_SSL_CERT? https://docs.soketi.app/getting-started/ssl-configuration
}));
