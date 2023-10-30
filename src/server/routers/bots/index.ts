import { createTRPCRouter } from "@/server/lib/trpc";
import getAllBots from "@/server/routers/bots/getAllBots";
import getBot from "@/server/routers/bots/getBot";
import getAllUsedBots from "@/server/routers/bots/getAllUsedBots";
import getUserBots from "@/server/routers/bots/getUserBots";
import getBotByChatId from "@/server/routers/bots/getBotByChatId";
import createBot from "@/server/routers/bots/createBot";
import getPopularTags from "@/server/routers/bots/getPopularTags";

export const botsRouter = createTRPCRouter({
  getAllBots,
  getBot,
  getAllUsedBots,
  getUserBots,
  getBotByChatId,
  create: createBot,
  getPopularTags,
});

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
