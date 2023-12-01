import { env } from '@/server/env';
import { prisma } from '@/server/lib/db';
import metaHandler from '@/server/lib/metaHandler';
import { S3Client, DeleteObjectCommand } from '@aws-sdk/client-s3';

type ResponseCode = 200 | 400 | 401 | 405;

type Response = {
  status: ResponseCode;
  message: string;
};

const s3Client = new S3Client({
  region: env.S3_REGION,
  credentials: {
    accessKeyId: env.S3_ACCESS_KEY,
    secretAccessKey: env.S3_SECRET_KEY,
  },
});

export default metaHandler.protected(async (req, res, ctx) => {
  if (req.method !== 'DELETE') return res.status(405).send('Method not allowed');

  const params: Partial<{ id: string }> = req.query;

  if (!params.id) {
    return res.status(400).json({ status: 400, message: 'Please provide a valid image id' });
  }

  if (ctx.user?.id !== params.id) {
    return res.status(401).json({ status: 401, message: 'Unauthorized: You can only delete your own images' });
  }

  try {
    // Use the S3 SDK to delete the object
    const deleteParams = {
      Bucket: env.S3_DEFAULT_BUCKET,
      Key: params.id,
    };
    await s3Client.send(new DeleteObjectCommand(deleteParams));

    // Delete the record from the database
    const item = await prisma.asset.delete({
      where: {
        id: params.id,
      },
    });

    return res.status(200).json({ status: 200, message: item });
  } catch (error) {
    return res.status(500).json({ status: 500, message: 'Error deleting image' });
  }
});

export const config = {
  bodyParser: false,
};
