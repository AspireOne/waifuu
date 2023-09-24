import z from "zod";

const publicEnvSchema = z.object({
  NEXT_PUBLIC_PUSHER_APP_KEY: z.string(),
  NEXT_PUBLIC_PUSHER_APP_ID: z.string(),
  NEXT_PUBLIC_PUSHER_CLUSTER: z.string(),
  NEXT_PUBLIC_PUSHER_HOST: z.string(),
  NEXT_PUBLIC_PUSHER_PORT: z.string(),
});

const privateEnvSchema = z.object({
  NODE_ENV: z.string().default("development"),

  // Your local Postgres server (for local testing), or remote postgres for prod.
  DATABASE_URL: z.string().url(),
  REPLICATE_API_TOKEN: z.string(),

  // Auth.
  NEXTAUTH_URL: z.string().url().default("http://localhost:3000"),
  NEXTAUTH_SECRET: z.string(),
  GOOGLE_CLIENT_ID: z.string(),
  GOOGLE_CLIENT_SECRET: z.string(),

  PUSHER_SECRET: z.string(),

  // For soketi docker.
  SOKETI_DEFAULT_APP_ID: z.string(),
  SOKETI_DEFAULT_APP_KEY: z.string(),
  SOKETI_DEFAULT_APP_SECRET: z.string(),
  SOKETI_DEBUG: z.number().optional(),
});

export function env() {
  return publicEnvSchema.merge(privateEnvSchema).parse(process.env);
}

export function clientEnv() {
  return publicEnvSchema.parse(process.env);
}
