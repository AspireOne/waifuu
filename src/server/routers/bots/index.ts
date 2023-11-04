import { createTRPCRouter } from "@/server/lib/trpc";
import createBot from "@/server/routers/bots/createBot";
import getAllBots from "@/server/routers/bots/getAllBots";
import getAllUsedBots from "@/server/routers/bots/getAllUsedBots";
import getBot from "@/server/routers/bots/getBot";
import getBotByChatId from "@/server/routers/bots/getBotByChatId";
import getPopularTags from "@/server/routers/bots/getPopularTags";
import getUserBots from "@/server/routers/bots/getUserBots";

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
