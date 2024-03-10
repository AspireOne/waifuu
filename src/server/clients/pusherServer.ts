import { global } from "@/server/global";
import PusherServer from "pusher";

// biome-ignore lint/suspicious/noAssignInExpressions: off.
export default (global.pusher ??= new PusherServer({
  appId: process.env.NEXT_PUBLIC_PUSHER_APP_ID as string,
  key: process.env.NEXT_PUBLIC_PUSHER_APP_KEY as string,
  secret: process.env.PUSHER_SECRET as string,
  host: process.env.NEXT_PUBLIC_PUSHER_HOST as string,
  port: process.env.NEXT_PUBLIC_PUSHER_PORT as string,
  useTLS: true,
  //encrypted: true,
  cluster: "eu",
}));
