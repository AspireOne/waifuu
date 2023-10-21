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
  contact: "/contact",
  login: (redirect?: string) =>
    "/login" + (redirect ? `?redirect=${redirect}` : ""),
  userProfile: (username: string) => `/user/${username}`,
  createBot: "/character/create",
  botChatMainMenu: (botId: string) => `/character/${botId}`,
  botChat: (chatId: string, botId: string) => `/character/${chatId}/${botId}`,
  forumPost: (id: string) => `/forum/${id}`,
  forum: "/forum",
};

/**
 * Contains paths that have a specific meaning.
 */
export const semanticPaths = {
  appIndex: paths.discover,
};
