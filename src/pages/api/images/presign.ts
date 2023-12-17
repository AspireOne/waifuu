import { s3Client, s3DefaultBucket } from "@/server/clients/s3Client";
import * as S3PresignedPost from "@aws-sdk/s3-presigned-post";
import metaHandler from "@/server/lib/metaHandler";
import { prisma } from "@/server/clients/db";
import { randomUUID } from "crypto";

const isAnImage = (file: string) => {
  const type = file.split("/")[0];
  return type === "image";
};

export default metaHandler.protected(async (req, res, ctx) => {
  const { contentType } = req.body;
  if (!contentType || !isAnImage(contentType))
    return res.status(400).send("Invalid file type");

  const { id } = await prisma.asset.create({
    data: {
      authorId: ctx.user.id,
      id: randomUUID(),
    },
  });

  try {
    const presignedData = await S3PresignedPost.createPresignedPost(s3Client, {
      Bucket: s3DefaultBucket,
      Key: id,
      Expires: 180,
    });

    return res.status(200).send({
      ...presignedData,
      id,
    });
  } catch (err) {
    return res
      .status(500)
      .send(`Failed to create presigned post request: ${err}`);
  }
});
