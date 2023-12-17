import { NextApiRequest } from "next";

const MAX_MESSAGES = 100; // 32k can handle up to 280 messages
const ratio = 140;

export const tokensToMessages = (tokens: number) => {
  let value = tokens / ratio;
  if (value > MAX_MESSAGES) {
    value = MAX_MESSAGES;
  }
  return Math.round(value);
};

export function retrieveIp(req?: NextApiRequest | null) {
  let ip = req?.headers["x-forwarded-for"] || req?.socket?.remoteAddress;

  // 'x-forwarded-for' can return a list of IPs. The client's IP is the first one.
  if (Array.isArray(ip)) ip = ip[0];
  else if (typeof ip === "string") ip = ip.split(",")?.[0]?.trim();

  if (!ip) console.warn(`Could not retrieve IP from request. (${ip})`);

  return ip || undefined;
}
