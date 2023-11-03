import Replicate from "replicate";
import { env } from "@/server/env";

const globalForReplicate = globalThis as unknown as {
  replicate: Replicate | undefined;
};

/** Global replicate instance. */
export const replicate =
  globalForReplicate.replicate ??
  new Replicate({
    auth: env.REPLICATE_API_KEY,
  });

if (process.env.NODE_ENV !== "production")
  globalForReplicate.replicate = replicate;
