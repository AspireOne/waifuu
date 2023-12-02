import { global } from "@/server/global";
import { IPThrottler } from "@/server/lib/IPThrottler";

// biome-ignore lint/suspicious/noAssignInExpressions: off.
export const ipThrottler = (global.ipThrottler ??= new IPThrottler());
