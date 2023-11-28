import z from "zod";

/** Must not be imported from the client! */
export const envSchema = z.object({
  NODE_ENV: z.string().default("development"),
  IPINFO_TOKEN: z.string().min(1),
  // Local Postgres server (for local testing), OR remote postgres server for production.
  DATABASE_URL: z.string().url(),
  // The Firebase Admin SDK credentials. This should be an one-line JSON string.
  SERVICE_ACCOUNT_JSON: z.string().min(1),
  // Sentry.
  SENTRY_AUTH_TOKEN: z.string().min(1),
  NEXT_PUBLIC_BASE_URL: z.string().url(),
  NEXT_PUBLIC_CAPACITOR_BASE_URL: z.string().url(),

  // AI SERVICE API KEYSS
  REPLICATE_API_KEY: z.string().min(1),
  HUGGINGFACEHUB_API_KEY: z.string().min(1),

  // CROWDIN
  CROWDIN_API_TOKEN: z.string().min(1),
  CROWDIN_PROJECT_ID: z.string().min(1),

  // PUSHER
  // PUSHER_APP_ID: z.string(),
  // PUSHER_SECRET: z.string(),
  // NEXT_PUBLIC_PUSHER_APP_KEY: z.string(),
  // NEXT_PUBLIC_PUSHER_CLUSTER: z.string(),
  // NEXT_PUBLIC_PUSHER_HOST: z.string(),

  // MINIO
  MINIO_ROOT_USER: z.string(),
  MINIO_ROOT_PASSWORD: z.string(),
  MINIO_DEFAULT_BUCKET: z.string(),
  MINIO_ACCESS_KEY: z.string(),
  MINIO_SECRET_KEY: z.string(),

  REDIS_PASSWORD: z.string(),
  // EMAIL
  MAILGUN_API_KEY: z.string().min(1),
  MAILGUN_DOMAIN: z.string().min(1),
  NEXT_PUBLIC_MAILGUN_API_KEY: z.string().min(1),
  INFO_EMAIL: z.string().min(1).email(),

  // STRIPE
  NEXT_PUBLIC_STRIPE_PK: z.string().min(1),
  STRIPE_SK: z.string().min(1),
  STRIPE_SIGNING_SECRET: z.string().min(1),
});

export const env = envSchema.parse(process.env);
