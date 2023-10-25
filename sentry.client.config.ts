// This file configures the initialization of Sentry on the client.
// The config you add here will be used whenever a users loads a page in their browser.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from "@sentry/nextjs";
import {BrowserTracing} from "@sentry/nextjs";

Sentry.init({
  dsn: "https://34c0748d79396ead34402eaea3d846c0@o4506082747482112.ingest.sentry.io/4506082817212416",
  // Setting this option to true will print useful information to the console while you're setting up Sentry.
  debug: false,

  // https://docs.sentry.io/platforms/javascript/guides/capacitor/
  release: "companion@1.0.0", // TODO: Put this in an env variable or smthng...
  //dist: "1",


  // This sets the sample rate to be 10%. You may want this to be 100% while
  // in development and sample at a lower rate in production.
  replaysSessionSampleRate: 0.1,
  // Adjust this value in production, or use tracesSampler for greater control
  tracesSampleRate: 0.8,
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
