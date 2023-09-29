import { Capacitor } from "@capacitor/core";

export const getBaseServerUrl = () => {
  if (Capacitor.isNativePlatform()) {
    const serverUrl = "https://companion-red.vercel.app";
    console.log(
      `Native project, using hardcoded external hosted server url (${serverUrl}).`,
    );
    return serverUrl; // TODO: Change this when we have a real domain.
  }

  if (typeof window !== "undefined") return ""; // Browser should use relative url.

  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  // prettier-ignore
  if (process.env.RAILWAY_PUBLIC_DOMAIN) return `https://${process.env.RAILWAY_PUBLIC_DOMAIN}`;

  if (process.env.DOMAIN) return `https://${process.env.PUBLIC_DOMAIN}`;

  return `http://localhost:${process.env.PORT ?? 3000}`; // Dev SSR should use localhost.
};

export const constants = {};
