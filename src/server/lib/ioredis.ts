import Redis from "ioredis";
import { env } from "../env";

export const ioredis = new Redis({
  password: env.REDIS_PASSWORD,
  autoResubscribe: true,
  autoResendUnfulfilledCommands: false,
});
