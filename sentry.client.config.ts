// This file configures the initialization of Sentry on the client.
// The config you add here will be used whenever a users loads a page in their browser.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from "@sentry/nextjs";

if (process.env.NEXT_PUBLIC_DEVELOPMENT !== "1") {
  Sentry.init({
    dsn: "https://34c0748d79396ead34402eaea3d846c0@o4506082747482112.ingest.sentry.io/4506082817212416",

    // https://docs.sentry.io/platforms/javascript/guides/capacitor/
    release: "waifuu@1.0.0", // TODO: Put this in an env variable or smthng...
    //dist: "1",

    // 10%.
    replaysSessionSampleRate: 0.1,
    // 100% because our user base is small.
    tracesSampleRate: 1.0,
    replaysOnErrorSampleRate: 1.0,

    // You can remove this option if you're not planning to use the Sentry Session Replay feature:
    integrations: [
      new Sentry.Replay({
        // Additional Replay configuration goes in here, for example:
        maskAllText: false,
        blockAllMedia: true,
      }),
    ],
  });
}
