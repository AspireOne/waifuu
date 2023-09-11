import { createTRPCProxyClient, createWSClient, wsLink } from "@trpc/client";
import { AppRouter } from "~/server/api/root";
import superjson from "superjson";
// create persistent WebSocket connection
const wsClient = createWSClient({
  url: `ws://localhost:3001`, // TODO: url?
});
// configure TRPCClient to use WebSockets transport
const client = createTRPCProxyClient<AppRouter>({
  links: [
    wsLink({
      client: wsClient,
    }),
  ],
  transformer: superjson,
});
