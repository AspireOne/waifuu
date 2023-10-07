import { Capacitor } from "@capacitor/core";

export class Constants {
  // TODO: Create a script for this and ENSURE IT IS NEVER LOCALHOST.
  public static readonly SERVER_HOST_URL = "http://192.168.100.179:3000"; // "https://companion-red.vercel.app";
}

// A wrapper for logging.
export const getBaseServerUrl = () => {
  const url = _getBaseServerUrl();
  return url;
};

export const _getBaseServerUrl = () => {
  // If on mobile, use the hosted prod server instead of localhost.
  if (Capacitor.isNativePlatform()) {
    return Constants.SERVER_HOST_URL;
  }

  // Browser = relative URL.
  if (typeof window !== "undefined") return "";

  // Production (Can be only WEB SERVER - android/ios don't have backend and browser always has window).
  if (process.env.NODE_ENV === "production") return Constants.SERVER_HOST_URL;

  // Development (can be only WEB SERVER).
  return `http://localhost:${process.env.PORT ?? 3000}`; // Dev SSR should use localhost.
};
