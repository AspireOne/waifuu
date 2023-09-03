import z from "zod";

export const envSchema = z.object({
  NODE_ENV: z.string().default("development"),

  // Your local Postgres server (for local testing), or remote postgres for prod.
  DATABASE_URL: z.string().url(),
  REPLICATE_API_TOKEN: z.string(),

  // Auth.
  NEXTAUTH_URL: z.string().url().default("http://localhost:3000"),
  NEXTAUTH_SECRET: z.string(),
  GOOGLE_CLIENT_ID: z.string(),
  GOOGLE_CLIENT_SECRET: z.string(),
});

export const env = envSchema.parse(process.env);
