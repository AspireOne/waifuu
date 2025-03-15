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
  SENTRY_DSN: z.string().min(1),
  NEXT_PUBLIC_SENTRY_DSN: z.string().min(1),

  NEXT_PUBLIC_BASE_URL: z.string().url(),
  NEXT_PUBLIC_CAPACITOR_BASE_URL: z.string().url(),

  // AI SERVICE API KEYSS
  REPLICATE_API_KEY: z.string().min(1),

  // MINIO
  S3_ACCESS_KEY: z.string().min(1),
  S3_SECRET_KEY: z.string().min(1),
  S3_REGION: z.string().min(1),
  S3_DEFAULT_BUCKET: z.string().min(1),
  S3_DEFAULT_DEV_BUCKET: z.string().min(1),
  NEXT_PUBLIC_S3_BASE_PATH: z.string().url(),

  MAIL_HOST: z.string().min(1),
  MAIL_PORT: z.string().min(1),
  MAIL_USERNAME: z.string().min(1),
  MAIL_PASSWORD: z.string().min(1),
  MAIL_ENCRYPTION: z.string().min(3),
  MAIL_INFO_ADDRESS: z.string().min(1).email("Invalid email address"),

  // STRIPE
  NEXT_PUBLIC_STRIPE_PK: z.string().min(1),
  STRIPE_SK: z.string().min(1),
  STRIPE_SIGNING_SECRET: z.string().min(1),

  OPENROUTER_API_KEY: z.string().min(1),
  NEXT_PUBLIC_HMAC_SHARED_KEY: z.string().min(1),

  LANGFUSE_SK: z.string().min(1),
  NEXT_PUBLIC_LANGFUSE_PK: z.string().min(1),
  NEXT_PUBLIC_FIREBASE_CONFIG: z.string().min(1),
});

export const env = envSchema.parse(process.env);
