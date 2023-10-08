import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import { prisma } from "~/server/lib/db";
import * as minio from 'minio';
import { env } from "~/server/env";

const MinioClient = new minio.Client({
    endPoint: '127.0.0.1',
    port: 9000,
    useSSL: false,
    accessKey: env.MINIO_ACCESS_KEY,
    secretKey: env.MINIO_SECRET_KEY,
});

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method !== 'DELETE') return res.status(405).send('Method not allowed');

    const session = await getSession({ req });
    const params: Partial<{ id: string }> = req.query;

    if (!params.id) return res.status(400).send('Please provide a valid image id');
    if (session?.user.id !== params.id) return res.status(401).send('You are not authorized to manipulate this file');

    const item = await prisma.asset.delete({
        where: {
            id: params.id,
        }
    });
    await MinioClient.removeObject(env.MINIO_DEFAULT_BUCKET, params.id);

    return res.status(200).json(item);
};

export default handler;

export const config = {
    bodyParser: false,
};