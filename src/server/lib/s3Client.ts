import { env } from "@/server/env";
import { S3Client } from "@aws-sdk/client-s3";

const globalForS3Client = globalThis as unknown as {
  client: S3Client | undefined;
};

export const s3Client =
  globalForS3Client.client ??
  new S3Client({
    region: env.S3_REGION,
    credentials: {
      accessKeyId: env.S3_ACCESS_KEY,
      secretAccessKey: env.S3_SECRET_KEY,
    },
  });

globalForS3Client.client = s3Client;
