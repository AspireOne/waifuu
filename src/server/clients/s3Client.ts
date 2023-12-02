import { env } from "@/server/env";
import { global } from "@/server/global";
import { S3Client } from "@aws-sdk/client-s3";

// biome-ignore lint/suspicious/noAssignInExpressions: off.
export const s3Client = (global.s3Client ??= new S3Client({
  region: env.S3_REGION,
  credentials: {
    accessKeyId: env.S3_ACCESS_KEY,
    secretAccessKey: env.S3_SECRET_KEY,
  },
}));
