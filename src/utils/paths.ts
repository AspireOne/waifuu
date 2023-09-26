import { BotMode } from "@prisma/client";

export default {
  index: "/",
  home: "/home",
  RR: "/roulette",
  discover: "/discover",
  profile: "/profile",
  botChatMainMenu: (botId: string) => `/character/${botId}`,
  userProfile: (username: string) => `/user/${username}`,
  botChat: (botId: string, botMode: BotMode) =>
    `/character/${botId}/${botMode}`, // todo
};
