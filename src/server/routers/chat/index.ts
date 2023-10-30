import { createTRPCRouter } from "@/server/lib/trpc";
import getInitialMessage from "@/server/routers/chat/getInitialMessage";
import messages from "@/server/routers/chat/messages";
import genReply from "@/server/routers/chat/genReply";
import createBotChat from "@/server/routers/chat/createBotChat";

export const chatRouter = createTRPCRouter({
  getInitialMessage,
  messages,
  genReply,
  createBotChat,
});
