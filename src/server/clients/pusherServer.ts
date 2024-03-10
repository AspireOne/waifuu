import { isAnUrl } from "@/lib/utils";
import { global } from "@/server/global";
import PusherServer from "pusher";

// biome-ignore lint/suspicious/noAssignInExpressions: off.
const isUrl = isAnUrl(process.env.NEXT_PUBLIC_PUSHER_HOST! as string);

const arePropsSame =
  global.pusher?.appId === process.env.NEXT_PUBLIC_PUSHER_APP_ID &&
  global.pusher?.key === process.env.NEXT_PUBLIC_PUSHER_APP_KEY &&
  global.pusher?.secret === process.env.PUSHER_SECRET &&
  global.pusher?.host === process.env.NEXT_PUBLIC_PUSHER_HOST &&
  global.pusher?.port === process.env.NEXT_PUBLIC_PUSHER_PORT;

let instance: PusherServer;

if (arePropsSame && global.pusher?.instance) {
  instance = global.pusher.instance;
} else {
  instance = new PusherServer({
    appId: process.env.NEXT_PUBLIC_PUSHER_APP_ID as string,
    key: process.env.NEXT_PUBLIC_PUSHER_APP_KEY as string,
    secret: process.env.PUSHER_SECRET as string,
    host: process.env.NEXT_PUBLIC_PUSHER_HOST as string,
    // we probably should not need to specify port in case of using a domain.
    port: isUrl ? undefined : (process.env.NEXT_PUBLIC_PUSHER_PORT as string),
    // use TLS if using a domain.
    useTLS: isUrl,
    cluster: "eu",
  });

  global.pusher = {
    instance,
    appId: process.env.NEXT_PUBLIC_PUSHER_APP_ID as string,
    key: process.env.NEXT_PUBLIC_PUSHER_APP_KEY as string,
    secret: process.env.PUSHER_SECRET as string,
    host: process.env.NEXT_PUBLIC_PUSHER_HOST as string,
    port: isUrl ? undefined : (process.env.NEXT_PUBLIC_PUSHER_PORT as string),
  };
}

export default instance;
