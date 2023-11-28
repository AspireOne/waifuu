import * as Sentry from "@sentry/nextjs";

if (process.env.NODE_ENV !== "development") {
  Sentry.init({
    dsn: "https://34c0748d79396ead34402eaea3d846c0@o4506082747482112.ingest.sentry.io/4506082817212416",
    tracesSampleRate: 1,
    sampleRate: 1,
  });
}
