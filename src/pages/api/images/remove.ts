import { prisma } from "@/server/lib/db";
import minio from "minio";
import { env } from "@/server/env";
import metaHandler from "@/server/lib/metaHandler";

const MinioClient = new minio.Client({
  endPoint: "127.0.0.1",
  port: 9000,
  useSSL: false,
  accessKey: env.MINIO_ACCESS_KEY,
  secretKey: env.MINIO_SECRET_KEY,
});

export default metaHandler.protected(async (req, res, ctx) => {
  if (req.method !== "DELETE")
    return res.status(405).send("Method not allowed");

  const params: Partial<{ id: string }> = req.query;

  if (!params.id) {
    return res.status(400).send("Please provide a valid image id");
  }

  if (ctx.user?.id !== params.id)
    return res
      .status(401)
      .send("Unauthorized: You can only delete your own images");

  const item = await prisma.asset.delete({
    where: {
      id: params.id,
    },
  });
  await MinioClient.removeObject(env.MINIO_DEFAULT_BUCKET, params.id);

  return res.status(200).json(item);
});

export const config = {
  bodyParser: false,
};
