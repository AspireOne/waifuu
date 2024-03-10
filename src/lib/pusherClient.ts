import { getIdToken } from "@/lib/firebase";
import { baseApiUrl } from "@/lib/paths";
import { isAnUrl } from "@lib/utils";
import Pusher from "pusher-js";

async function getPusherClient() {
  if (Pusher.instances.length > 0) return Pusher.instances[0]!;

  const idToken = await getIdToken();
  const port = Number(process.env.NEXT_PUBLIC_PUSHER_PORT) as number;
  const isUrl = isAnUrl(process.env.NEXT_PUBLIC_PUSHER_HOST as string);

  const pusher = new Pusher("app-key", {
    wsHost: process.env.NEXT_PUBLIC_PUSHER_HOST as string,
    wsPort: isUrl ? undefined : port,
    forceTLS: isUrl,
    disableStats: true,
    enabledTransports: ["ws", "wss"],
    cluster: "EU",
    //authEndpoint: baseApiUrl("/pusher/authenticate"),
    // @ts-ignore
    userAuthentication: {
      endpoint: baseApiUrl(`/pusher/authenticate?idToken=${idToken}`),
      headersProvider: async () => ({
        Authorization: `Bearer ${idToken}`,
      }),
    },
    // @ts-ignore
    channelAuthorization: {
      endpoint: baseApiUrl(`/pusher/authorize?idToken=${idToken}`),
      headersProvider: async () => ({
        Authorization: `Bearer ${idToken}`,
      }),
    },
  });

  pusher.signin();
  return pusher;
}

export { getPusherClient };
