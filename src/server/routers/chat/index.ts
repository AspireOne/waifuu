import { createTRPCRouter } from "@/server/lib/trpc";
import getOrCreate from "@/server/routers/chat/getOrCreate";
import genReply from "@/server/routers/chat/genReply";
import messages from "@/server/routers/chat/messages";

export const chatRouter = createTRPCRouter({
  messages,
  genReply,
  getOrCreate,
});
