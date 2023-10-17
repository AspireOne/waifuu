/**
 * Contains all paths/routes for the app.
 */
export const paths = {
  index: "/",
  home: "/home",
  RR: "/roulette",
  RRChat: "/roulette/chat",
  discover: "/discover",
  profile: "/profile",
  login: (redirect?: string) =>
    "/login" + (redirect ? `?redirect=${redirect}` : ""),
  botChatMainMenu: (botId: string) => `/character/${botId}`,
  createBot: "/character/create",
  userProfile: (username: string) => `/user/${username}`,
  botChat: (chatId: string, botId: string) => `/character/${chatId}/${botId}`,
  forumPost: (id: string) => `/forum/${id}`,
  forum: "/forum",
};
