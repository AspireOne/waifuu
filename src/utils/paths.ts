import { BotMode } from "@prisma/client";

export default {
  index: "/",
  discover: "/discover",
  botChatMainMenu: (botId: string) => `/chat/${botId}`,
  userProfile: (username: string) => `/user/${username}`,
  botChat: (botId: string, botMode: BotMode) => `/chat/${botId}/${botMode}`,
};
