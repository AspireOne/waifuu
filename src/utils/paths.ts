import { BotMode } from "@prisma/client";

export default {
  index: "/",
  explore: "/explore",
  botChatMainMenu: (botId: string) => `/chat/${botId}`,
  botChat: (botId: string, botMode: BotMode) => `/chat/${botId}/${botMode}`,
};
