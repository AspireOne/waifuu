import { global } from "@/server/global";
import Redis from "ioredis";
import { env } from "../env";

// biome-ignore lint/suspicious/noAssignInExpressions: off.
export const ioredis = (global.ioredis ??= new Redis({
  password: env.REDIS_PASSWORD,
  autoResubscribe: true,
  autoResendUnfulfilledCommands: false,
}));
