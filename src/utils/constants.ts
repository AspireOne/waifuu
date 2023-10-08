import { Capacitor } from "@capacitor/core";

export class Constants {
  public static readonly SERVER_URL = "https://companion-red.vercel.app"; // "https://companion-red.vercel.app";
}

/**
 * Adds base API path in front of the given path.
 * @param path Path to append to base URL, e.g. "/api/bots"
 * @returns {string} The full API URL
 *
 * @example Constants.apiBase("/api/bots") // "https://companion-red.vercel.app/api/bots"
 * @example Constants.apiBase() // "https://companion-red.vercel.app/api"
 **/
export const apiBase = (path?: string): string => {
  const base = getBaseServerUrl() + "/api";
  if (!path) return base;

  if (path.startsWith("/api")) path = path.slice(4);
  if (path.startsWith("api")) path = path.slice(3);
  if (!path.startsWith("/")) path = "/" + path;

  return base + path;
};

const getBaseServerUrl = () => {
  // Mobile = use the hosted prod server instead of localhost.
  if (Capacitor.isNativePlatform()) {
    return Constants.SERVER_URL;
  }

  // Browser = relative URL.
  if (typeof window !== "undefined") return "";

  // Web Server - Production. (Can oly be web server - android/ios don't have backend and browser always has window).
  if (process.env.NODE_ENV === "production") {
    if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
    return Constants.SERVER_URL;
  }
  // Web Server - Development.
  return `http://localhost:${process.env.PORT ?? 3000}`; // Dev SSR should use localhost.
};
