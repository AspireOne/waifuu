import * as Sentry from "@sentry/nextjs";
import {env} from "@/server/env";

if (process.env.NODE_ENV !== "development") {
  Sentry.init({
    dsn: env.NEXT_PUBLIC_SENTRY_DSN,
    tracesSampleRate: 1,
    sampleRate: 1,
  });
}
