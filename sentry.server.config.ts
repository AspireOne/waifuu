import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: "https://34c0748d79396ead34402eaea3d846c0@o4506082747482112.ingest.sentry.io/4506082817212416",
  tracesSampleRate: 1,
});
