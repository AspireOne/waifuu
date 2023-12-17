import { TRPCError } from "@/server/lib/TRPCError";

type LimitWindow = {
  ms: number;
  maxHits: number;
};

type IncrementParams = {
  id: string;
  userId?: string;
  ip?: string;
  userLimits?: LimitWindow[];
  /**
   * If set to "user-factor", the IP limit windows will be calculated by multiplying the user limit.
   * */
  ipLimits?: LimitWindow[] | "user-factor";
  /**
   * @default true
   * */
  autoIncrement?: boolean;
};

class RateLimiter {
  public static readonly IP_LIMIT_MULTIPLIER: number = 5;
  private static readonly MAX_ARRAY_LENGTH: number = 10_000;
  private hits: Map<string, Map<string, Map<number, number[]>>>; // id -> (userId or ip) -> (ms -> timestamps)

  constructor() {
    this.hits = new Map();
  }

  ensureWithinLimitOrThrow(params: IncrementParams) {
    const { id, userId, ip, userLimits, autoIncrement = true } = params;
    let { ipLimits } = params;

    const now = Date.now();

    // Calculate the IP limit windows if set to "user-factor"
    if (ipLimits === "user-factor") {
      if (!userLimits) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: 'User limits must be provided if IP limits are set to "user-factor".',
        });
      }

      ipLimits = userLimits.map((limit) => ({
        ms: limit.ms,
        maxHits: limit.maxHits * RateLimiter.IP_LIMIT_MULTIPLIER,
      }));
    }

    // Check and increment hits for the user if provided
    if (userId && userLimits) {
      this.checkAndIncrementHits(id, userId, now, userLimits, autoIncrement);
    }

    // Check and increment hits for the IP if provided
    if (ip && ipLimits) {
      this.checkAndIncrementHits(id, ip, now, ipLimits, autoIncrement);
    }
  }

  /*  increment(params: IncrementParams) {
    const { id, userId, ip } = params;
    const now = Date.now();

    if (userId) {
      this.manualIncrement(id, userId, now);
    }

    if (ip) {
      this.manualIncrement(id, ip, now);
    }
  }

  private manualIncrement(id: string, identifier: string, now: number) {
    if (!this.hits.has(id)) {
      this.hits.set(id, new Map());
    }
    const identifierHits = this.hits.get(id)!.get(identifier) || new Map();

    identifierHits.forEach((windowHits, ms) => {
      // Enforce the 10,000-item limit
      if (windowHits.length >= RateLimiter.MAX_ARRAY_LENGTH) {
        windowHits.shift(); // Remove the oldest timestamp
      }
      windowHits.push(now); // Add the new timestamp
      identifierHits.set(ms, windowHits);
    });

    this.hits.get(id)!.set(identifier, identifierHits);
  }*/

  private checkAndIncrementHits(
    id: string,
    identifier: string,
    now: number,
    limitWindows: LimitWindow[],
    increment: boolean,
  ) {
    const identifierHits = this.hits.get(id)?.get(identifier) || new Map();

    for (const limitWindow of limitWindows) {
      const windowHits = identifierHits.get(limitWindow.ms) || [];
      const windowStartTimestamp = now - limitWindow.ms;

      // Filter out hits outside the current window
      const hitsWithinWindow = windowHits.filter(
        (timestamp: number) => timestamp > windowStartTimestamp,
      );

      // Enforce the 10,000-item limit
      while (hitsWithinWindow.length >= RateLimiter.MAX_ARRAY_LENGTH) {
        hitsWithinWindow.shift(); // Remove the oldest timestamp
      }

      // Check if the limit has been reached for this window
      if (hitsWithinWindow.length >= limitWindow.maxHits) {
        throw new TRPCError({
          message: "Rate limit exceeded.",
          code: "TOO_MANY_REQUESTS",
          toastType: "error",
          toast:
            "Too many requests. Please try again later. If you think this is a mistake, please contact us or submit feedback.",
        });
      }

      if (increment) {
        hitsWithinWindow.push(now);
        identifierHits.set(limitWindow.ms, hitsWithinWindow);
      }

      console.log(
        `[RateLimiter] Checking limits:\n  id: '${identifier}'\n ${hitsWithinWindow.length}/${
          limitWindow.maxHits
        } hits\n  Window: ${limitWindow.ms / 60000} minutes`,
      );
    }

    // Update the hits map only if autoIncrement is true
    if (increment) {
      if (!this.hits.has(id)) {
        this.hits.set(id, new Map());
      }
      this.hits.get(id)!.set(identifier, identifierHits);
    }
  }
}

export default RateLimiter;
