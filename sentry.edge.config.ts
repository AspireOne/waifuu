// This file configures the initialization of Sentry for edge features (middleware, edge routes, and so on).
// The config you add here will be used whenever one of the edge features is loaded.
// Note that this config is unrelated to the Vercel Edge Runtime and is also required when running locally.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: "https://34c0748d79396ead34402eaea3d846c0@o4506082747482112.ingest.sentry.io/4506082817212416",

  // Adjust this value in production, or use tracesSampler for greater control
  tracesSampleRate: 0.8, // TODO

  // Setting this option to true will print useful information to the console while you're setting up Sentry.
  debug: process.env.NODE_ENV === "development", // TODO: Change this to false once you've set up Sentry.
});
