import { Capacitor } from "@capacitor/core";
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
  // Browser = relative URL.
  if (typeof window !== "undefined") return "";

  if (process.env.NEXT_PUBLIC_BASE_URL) {
    return process.env.NEXT_PUBLIC_BASE_URL.endsWith("/")
      ? process.env.NEXT_PUBLIC_BASE_URL.slice(0, -1)
      : process.env.NEXT_PUBLIC_BASE_URL;
  }

  if (Capacitor.isNativePlatform()) {
    // TODO: Check if the env variables are saved in a capacitor build.
    if (!process.env.NEXT_PUBLIC_CAPACITOR_SERVER_URL) {
      console.error("NEXT_PUBLIC_CAPACITOR_SERVER_URL is not set!");
      toast("NEXT_PUBLIC_CAPACITOR_SERVER_URL is not set!", { type: "error" });
      return null;
    }

    return process.env.NEXT_PUBLIC_CAPACITOR_SERVER_URL.endsWith("/")
      ? process.env.NEXT_PUBLIC_CAPACITOR_SERVER_URL.slice(0, -1)
      : process.env.NEXT_PUBLIC_CAPACITOR_SERVER_URL;
  }
};

/**
 * Adds base API path in front of the given path.
 * @param path Path to append to base URL, e.g. "/api/bots"
 * @returns {string} The full API URL
 *
 * @example apiBase("/api/bots") // "https://companion-red.vercel.app/api/bots"
 * @example apiBase() // "https://companion-red.vercel.app/api"
 **/
export const baseApiUrl = (path?: string): string => {
  const base = `${baseUrl()}/api`;
  if (!path) return base;

  if (path.startsWith("/api")) path = path.slice(4);
  if (path.startsWith("api")) path = path.slice(3);
  if (!path.startsWith("/")) path = `/${path}`;

  return base + path;
};
