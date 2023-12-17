import { global } from "@/server/global";
import RateLimiter from "@/server/lib/RateLimiter";

// biome-ignore lint/suspicious/noAssignInExpressions: off.
export const rateLimiter = (global.rateLimiter ??= new RateLimiter());
