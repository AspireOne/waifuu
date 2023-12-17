import { global } from "@/server/global";
import RateLimiterClass from "@/server/lib/RateLimiterClass";

// biome-ignore lint/suspicious/noAssignInExpressions: off.
export const rateLimiter = (global.rateLimiter ??= new RateLimiterClass());
