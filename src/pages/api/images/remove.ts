import { prisma } from "@/server/clients/db";
import { s3Client, s3DefaultBucket } from "@/server/clients/s3Client";
import { env } from "@/server/env";
import metaHandler from "@/server/lib/metaHandler";
import { DeleteObjectCommand, S3Client } from "@aws-sdk/client-s3";

export default metaHandler.protected(async (req, res, ctx) => {
  if (req.method !== "DELETE") return res.status(405).send("Method not allowed");

  const params: Partial<{ id: string }> = req.query;

  if (!params.id) {
    return res.status(400).json({ status: 400, message: "Please provide a valid image id" });
  }

  if (ctx.user?.id !== params.id) {
    return res
      .status(401)
      .json({ status: 401, message: "Unauthorized: You can only delete your own images" });
  }

  try {
    const deleteParams = {
      Bucket: s3DefaultBucket,
      Key: params.id,
    };
    await s3Client.send(new DeleteObjectCommand(deleteParams));

    const item = await prisma.asset.delete({
      where: {
        id: params.id,
      },
    });

    return res.status(200).json({ status: 200, message: item });
  } catch (error) {
    return res.status(500).json({ status: 500, message: "Error deleting image" });
  }
});

export const config = {
  bodyParser: false,
};
