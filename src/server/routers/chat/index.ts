import { createTRPCRouter } from "@/server/lib/trpc";
import messages from "@/server/routers/chat/messages";
import genReply from "@/server/routers/chat/genReply";
import create from "@/server/routers/chat/create";

export const chatRouter = createTRPCRouter({
  messages,
  genReply,
  create,
});
