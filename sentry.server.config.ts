// This file configures the initialization of Sentry on the server.
// The config you add here will be used whenever the server handles a request.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: "https://34c0748d79396ead34402eaea3d846c0@o4506082747482112.ingest.sentry.io/4506082817212416",

  // Adjust this value in production, or use tracesSampler for greater control
  tracesSampleRate: 0.8,

  // Setting this option to true will print useful information to the console while you're setting up Sentry.
  debug: process.env.NODE_ENV === "development", // TODO: Change this to false once you've set up Sentry.
});
