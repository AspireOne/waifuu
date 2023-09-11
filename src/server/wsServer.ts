import { applyWSSHandler } from "@trpc/server/adapters/ws";
import { appRouter } from "~/server/api/root";
import { createWsContext } from "~/server/api/trpc";
import ws from "ws";

const wss = new ws.Server({
  port: 3001,
});
const handler = applyWSSHandler({
  wss,
  router: appRouter,
  createContext: createWsContext,
});

wss.on("error", (err) => {
  console.error("❌ WebSocket Server error", err);
});

wss.on("connection", (ws) => {
  console.log(`➕➕ Connection (${wss.clients.size})`);
  ws.once("close", () => {
    console.log(`➖➖ Connection (${wss.clients.size})`);
  });
});
console.log("✅ WebSocket Server listening on ws://localhost:3001");

process.on("SIGTERM", () => {
  console.log("SIGTERM");
  handler.broadcastReconnectNotification();
  wss.close();
});
