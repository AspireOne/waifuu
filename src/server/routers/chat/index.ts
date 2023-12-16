import { createTRPCRouter } from "@/server/lib/trpc";
import genReply from "@/server/routers/chat/genReply";
import getOrCreate from "@/server/routers/chat/getOrCreate";
import logFeedback from "@/server/routers/chat/logFeedback";
import messages from "@/server/routers/chat/messages";

export const chatRouter = createTRPCRouter({
  messages,
  genReply,
  getOrCreate,
  logFeedback,
});
