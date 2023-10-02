import type { NextApiRequest, NextApiResponse } from 'next'
import { promises as fs } from "fs";
import path from "path";
import * as formidable from 'formidable';
import * as minio from 'minio';
import { env } from '~/server/env';

type ProcessedFiles = Array<[string, formidable.File]>;

const MinioClient = new minio.Client({
  endPoint: '127.0.0.1',
  port: 9000,
  useSSL: false,
  accessKey: env.MINIO_ACCESS_KEY,
  secretKey: env.MINIO_SECRET_KEY,
});

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    let status = 200,
        resultBody = { status: 'ok', message: 'Files were uploaded successfully' };

    const files = await new Promise<ProcessedFiles | undefined>((resolve, reject) => {
        const form = new formidable.IncomingForm();
        const files: ProcessedFiles = [];

        form.on('file', function (field, file) {
            files.push([field, file]);
        });
        form.on('end', () => resolve(files));
        form.on('error', err => reject(err));
        form.parse(req, () => {
            if (!files.length) {
                status = 400;
                resultBody = {
                    status: 'fail', message: 'No files were uploaded'
                }
                reject();
            }
        });
    }).catch(e => {
        status = 500;
        resultBody = {
            status: 'fail', message: 'Upload error'
        }
    });

    if (files?.length) {
        const targetPath = path.join(process.cwd(), `/uploads/`);
        try {
            await fs.access(targetPath);
        } catch (e) {
            await fs.mkdir(targetPath);
        }

        for (const file of files) {
            const tempPath = file[1].filepath;
            await fs.rename(tempPath, targetPath + file[1].originalFilename);
            MinioClient.fPutObject(env.MINIO_DEFAULT_BUCKET, file[1].originalFilename as string, targetPath + file[1].originalFilename);
        }
    }

    res.status(status).json(resultBody);
}

export default handler;

export const config = {
  api: {
      bodyParser: false,
  }
};