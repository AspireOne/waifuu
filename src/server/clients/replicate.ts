import { env } from "@/server/env";
import { global } from "@/server/global";
import Replicate from "replicate";

// biome-ignore lint/suspicious/noAssignInExpressions: off.
export const replicate = (global.replicate ??= new Replicate({
  auth: env.REPLICATE_API_KEY,
}));
