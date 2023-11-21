import parse from "parse-duration";

// Request limits.
const LIMIT_PER_HOUR = 5000;
const LIMIT_PER_MINUTE = 200;
const LIMIT_PER_SECOND = 20;
const MAX_STORED_ACCESSES = 1000;

export class IPThrottler {
  private readonly IPAccesses: Record<string, number[]>;
  private static instance: IPThrottler;

  constructor() {
    if (IPThrottler.instance) throw new Error("IPThrottler can only be instantiated once.");
    IPThrottler.instance = this;

    this.IPAccesses = {};
  }

  public addAccess(ip: string): void {
    const timestamp = Date.now();

    if (!this.IPAccesses[ip]) {
      this.IPAccesses[ip] = [];
    }

    const accesses = this.IPAccesses[ip]!;
    accesses.push(timestamp);

    // Cleanup if the stored accesses exceed a certain limit
    while (accesses.length > 0 && accesses[0]! <= timestamp - parse("1h")!) {
      accesses.shift();
    }
  }

  public isAboveLimit(ip: string): boolean {
    const now = Date.now();
    const timestamps = this.IPAccesses[ip] || [];
    let accessesPerHour = 0;
    let accessesPerMinute = 0;
    let accessesPerSecond = 0;

    // Since we're interested in the most recent accesses, start from the end of the array.
    for (let i = timestamps.length - 1; i >= 0; i--) {
      const age = now - timestamps[i]!;

      if (age < parse("1s")!) {
        accessesPerSecond++;
        accessesPerMinute++;
        accessesPerHour++;
      } else if (age < parse("1m")!) {
        accessesPerMinute++;
        accessesPerHour++;
      } else if (age < parse("1h")!) {
        accessesPerHour++;
      } else {
        // Since timestamps are in chronological order, no need to check older timestamps.
        break;
      }

      // Early exit if any of the limits are reached.
      if (
        accessesPerSecond > LIMIT_PER_SECOND ||
        accessesPerMinute > LIMIT_PER_MINUTE ||
        accessesPerHour > LIMIT_PER_HOUR
      ) {
        return true;
      }
    }

    return false;
  }
}
