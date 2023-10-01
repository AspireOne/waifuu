import { Capacitor } from "@capacitor/core";

export class Constants {
  static readonly SERVER_HOST_URL = "https://companion-red.vercel.app";
}

// A wrapper for logging.
export const getBaseServerUrl = () => {
  const url = _getBaseServerUrl();
  console.log("Requested base server url:", url);
  return url;
};

export const _getBaseServerUrl = () => {
  // If on mobile OR if building for mobile, use the hosted prod server instead of localhost.
  if (Capacitor.isNativePlatform() || !!process.env.NEXT_PUBLIC_NATIVE)
    return Constants.SERVER_HOST_URL;

  if (typeof window !== "undefined") return ""; // Browser should use relative url.

  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  // prettier-ignore
  if (process.env.RAILWAY_PUBLIC_DOMAIN) return `https://${process.env.RAILWAY_PUBLIC_DOMAIN}`;

  // TODO: Implement this on our server.
  if (process.env.DOMAIN) return `https://${process.env.PUBLIC_DOMAIN}`;

  return `http://localhost:${process.env.PORT ?? 3000}`; // Dev SSR should use localhost.
};
