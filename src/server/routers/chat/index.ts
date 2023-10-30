import { createTRPCRouter } from "@/server/lib/trpc";
import getInitialMessage from "@/server/routers/chat/getInitialMessage";
import messages from "@/server/routers/chat/messages";
import genReply from "@/server/routers/chat/genReply";
import create from "@/server/routers/chat/create";

export const chatRouter = createTRPCRouter({
  getInitialMessage,
  messages,
  genReply,
  create,
});
