import crypto from "crypto";
import { env } from "@/server/env";
import { global } from "@/server/global";
import parse from "parse-duration";

const MAX_TIME_DIFF = parse("10s")!;

export const verifyHmac = (
  body: object,
  nonce: string,
  timestamp: string,
  providedSignature: string,
) => {
  const msg = nonce + timestamp;

  // Verify the timestamp
  if (!timestampValid(timestamp)) return false;

  // Calculate the HMAC signature
  if (!signatureValid(msg, providedSignature)) return false;

  // Verify nonce.
  if (!global.nonces) global.nonces = [];

  if (global.nonces.includes(nonce)) return false;
  global.nonces.push(nonce);

  // remove x oldest nonces
  if (global.nonces.length > 300) global.nonces.splice(0, 20);
  return true;
};

const signatureValid = (msg: string, providedSignature: string) => {
  const calcSignature = crypto
    .createHmac("sha256", env.NEXT_PUBLIC_HMAC_SHARED_KEY)
    .update(msg)
    .digest("base64");

  return providedSignature === calcSignature;
};

const timestampValid = (timestamp: string) => {
  const currentTime = Math.floor(Date.now() / 1000);
  const timeDiff = Math.abs(currentTime - Number(timestamp));

  return timeDiff <= MAX_TIME_DIFF;
};
