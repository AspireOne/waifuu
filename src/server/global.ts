// This file contains all variables/objects/arrays etc. that will be
// preserved between requests - persistent global variables.
// Why? We keep it in one file to keep track of them, because there is a danger of accidentally
// forgetting them and having memory issues.

import { IPThrottler } from "@/server/lib/IPThrottler";

const ipThrottler = new IPThrottler();

export const global = {
  ipThrottler,
};
