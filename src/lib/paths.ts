import { Capacitor } from "@capacitor/core";
import { t } from "@lingui/macro";
import { toast } from "react-toastify";

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
  pricing: "/pricing",
  createBot: "/character/create",
  forum: "/forum",
  subscriptionSuccess: "/pricing", // TODO: Success page.
  subscriptionCancel: "/pricing", // TODO: Cancel page.
  login: (redirect?: string) => `/login${redirect ? `?redirect=${redirect}` : ""}`,
  userProfile: (username: string) => `/user/${username}`,
  botChatMainMenu: (botId: string) => `/character/${botId}`,
  botChat: (chatId: string, botId: string) => `/character/${chatId}/${botId}`,
  forumPost: (id: string) => `/forum/${id}`,
};

export const publicNavbarPaths = [
  { title: t`Home`, href: paths.index },
  { title: t`Pricing`, href: paths.pricing },
  /*{ title: t`Forum`, href: paths.forum },*/
  { title: t`Contact`, href: paths.contact },
];

/**
 * Contains paths that have a specific meaning.
 */
export const semanticPaths = {
  appIndex: paths.discover,
};

export const fullUrl = (path: string) => {
  // ensure path contains a / at the end.
  if (!path.startsWith("/")) path = `/${path}`;
  return `${baseUrl()}${path}`;
};

/** Returns the base path of the website/server (same thing) with NO trailing "/". e.g. "https://www.example.com" */
export const baseUrl = () => {
  // This must be BEFORE window/browser check below!
  if (Capacitor.isNativePlatform()) {
    if (!process.env.NEXT_PUBLIC_CAPACITOR_BASE_URL) {
      toast("NEXT_PUBLIC_CAPACITOR_BASE_URL is not set!", { type: "error" });
      throw new Error("NEXT_PUBLIC_CAPACITOR_BASE_URL is not set!");
    }

    return process.env.NEXT_PUBLIC_CAPACITOR_BASE_URL.endsWith("/")
      ? process.env.NEXT_PUBLIC_CAPACITOR_BASE_URL.slice(0, -1)
      : process.env.NEXT_PUBLIC_CAPACITOR_BASE_URL;
  }

  // Browser = relative URL.
  if (typeof window !== "undefined") return "";

  if (process.env.NEXT_PUBLIC_BASE_URL) {
    return process.env.NEXT_PUBLIC_BASE_URL.endsWith("/")
      ? process.env.NEXT_PUBLIC_BASE_URL.slice(0, -1)
      : process.env.NEXT_PUBLIC_BASE_URL;
  }

  throw new Error("NEXT_PUBLIC_BASE_URL is not set!");
};

/**
 * Adds base API path in front of the given path.
 * @param path Path to append to base URL, e.g. "/api/bots"
 * @returns {string} The full API URL
 *
 * @example apiBase("/api/bots") // "https://waifuu.com/api/bots"
 * @example apiBase() // "https://waifuu.com/api"
 **/
export const baseApiUrl = (path?: string): string => {
  const base = `${baseUrl()}/api`;
  if (!path) return base;

  if (path.startsWith("/api")) path = path.slice(4);
  if (path.startsWith("api")) path = path.slice(3);
  if (!path.startsWith("/")) path = `/${path}`;

  return base + path;
};
