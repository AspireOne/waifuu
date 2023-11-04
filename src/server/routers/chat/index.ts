import { createTRPCRouter } from "@/server/lib/trpc";
import create from "@/server/routers/chat/create";
import genReply from "@/server/routers/chat/genReply";
import messages from "@/server/routers/chat/messages";

export const chatRouter = createTRPCRouter({
  messages,
  genReply,
  create,
});
