import * as minio from "minio";
import { NextApiRequest, NextApiResponse } from "next";
import { env } from "~/server/env";

const MinioClient = new minio.Client({
  endPoint: "127.0.0.1",
  port: 9000,
  useSSL: false,
  accessKey: env.MINIO_ACCESS_KEY,
  secretKey: env.MINIO_SECRET_KEY,
});

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    const { id } = req.query;
    
    const file = await MinioClient.getObject(env.MINIO_DEFAULT_BUCKET, id as string);
    return file.pipe(res);
};

export default handler;