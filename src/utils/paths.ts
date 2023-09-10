import { BotMode } from "@prisma/client";

export default {
  index: "/",
  explore: "/explore",
  botChatMainMenu: (botId: string) => `/chat/${botId}`,
  userProfile: (username: string) => `/user/${username}`,
  botChat: (botId: string, botMode: BotMode) => `/chat/${botId}/${botMode}`,
};
