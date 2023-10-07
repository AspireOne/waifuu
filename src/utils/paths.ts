import { BotMode } from "@prisma/client";

export default {
  index: "/",
  home: "/home",
  RR: "/roulette",
  RRChat: "/roulette/chat",
  discover: "/discover",
  profile: "/profile",
  login: (redirect?: string) =>
    "/login" + (redirect ? `?redirect=${redirect}` : ""),
  botChatMainMenu: (botId: string) => `/character/${botId}`,
  userProfile: (username: string) => `/user/${username}`,
  botChat: (chatId: string, botId: string) => `/character/${chatId}/${botId}`,
};

export function addQueryParams(
  path: string,
  ...params: [key: string, value: string][]
) {
  const url = new URL(path, window.location.origin);

  params.forEach((param) => {
    url.searchParams.append(param[0], param[1]);
  });

  return url.pathname + url.search;
}

export function normalizePath(path: string, keepSlash: boolean = true): string {
  if (keepSlash) return path.endsWith("/") ? path : path + "/";
  else return path.endsWith("/") ? path.slice(0, -1) : path;
}

export function makeDownloadPath(id: string): string {
  return `/api/images/download?id=${id}`;
}
