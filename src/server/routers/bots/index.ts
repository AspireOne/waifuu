import { createTRPCRouter } from "@/server/lib/trpc";
import createBot from "@/server/routers/bots/createBot";
import getAllBots from "@/server/routers/bots/getAllBots";
import getAllUsedBots from "@/server/routers/bots/getAllUsedBots";
import getBot from "@/server/routers/bots/getBot";
import getBotByChatId from "@/server/routers/bots/getBotByChatId";
import getPopularTags from "@/server/routers/bots/getPopularTags";
import getUsedChatModes from "@/server/routers/bots/getUsedChatModes";
import getUserBots from "@/server/routers/bots/getUserBots";
import markView from "@/server/routers/bots/markView";
import rateBot from "@/server/routers/bots/rateBot";

export const botsRouter = createTRPCRouter({
  getAllBots,
  getBot,
  getAllUsedBots,
  getUserBots,
  getBotByChatId,
  create: createBot,
  getPopularTags,
  getUsedChatModes,
  markView,
  rateBot,
});

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
