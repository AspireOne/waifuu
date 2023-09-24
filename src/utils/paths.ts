import { BotMode } from "@prisma/client";

export default {
  index: "/",
  discover: "/discover",
  botChatMainMenu: (botId: string) => `/character/${botId}`,
  userProfile: (username: string) => `/user/${username}`,
  botChat: (botId: string, botMode: BotMode) =>
    `/character/${botId}/${botMode}`, // todo
};
