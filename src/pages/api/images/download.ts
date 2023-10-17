import * as minio from "minio";
import { env } from "@/server/env";
import metaHandler from "@/pages/api/metaHandler";

const MinioClient = new minio.Client({
  endPoint: "127.0.0.1",
  port: 9000,
  useSSL: false,
  accessKey: env.MINIO_ACCESS_KEY,
  secretKey: env.MINIO_SECRET_KEY,
});

export default metaHandler.public(async (req, res, ctx) => {
  const { id } = req.query;

  const file = await MinioClient.getObject(
    env.MINIO_DEFAULT_BUCKET,
    id as string,
  );
  return file.pipe(res);
});
