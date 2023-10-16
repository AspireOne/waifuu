import z from "zod";

export const envSchema = z.object({
  NODE_ENV: z.string().default("development"),

  // Your local Postgres server (for local testing), or remote postgres for prod.
  DATABASE_URL: z.string().url(),
  REPLICATE_API_TOKEN: z.string(),

  // PUSHER_APP_ID: z.string(),
  // PUSHER_SECRET: z.string(),
  // NEXT_PUBLIC_PUSHER_APP_KEY: z.string(),
  // NEXT_PUBLIC_PUSHER_CLUSTER: z.string(),
  // NEXT_PUBLIC_PUSHER_HOST: z.string(),

  MINIO_ROOT_USER: z.string(),
  MINIO_ROOT_PASSWORD: z.string(),
  DEFAULT_BUCKET: z.string(),
  MINIO_ACCESS_KEY: z.string(),
  MINIO_SECRET_KEY: z.string(),

  // The Firebase Admin SDK credentials. This should be an one-line JSON string.
  SERVICE_ACCOUNT_JSON: z.string().min(10),
});

export const env = envSchema.parse(process.env);
