import type { NextApiRequest, NextApiResponse } from "next";
import { promises as fs } from "fs";
import path from "path";
import * as formidable from "formidable";
import * as minio from "minio";
import { env } from "~/server/env";
import generateUUID from "~/utils/utils";
import { prisma } from "~/server/lib/db";
import { getUser } from "~/pages/api/utils";

type ProcessedFiles = Array<[string, formidable.File]>;
type ResultData = {
  fileName: string;
  id: string;
};
enum ResponseCode {
  OK = 200,
  UNAUTHORIZED = 401,
  BAD_REQUEST = 400,
  SERVER_ERROR = 500,
}
type Response = {
  status: ResponseCode;
  message: unknown;
};

const MinioClient = new minio.Client({
  endPoint: "127.0.0.1",
  port: 9000,
  useSSL: false,
  accessKey: env.MINIO_ACCESS_KEY,
  secretKey: env.MINIO_SECRET_KEY,
});

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  let status = 200;
  let resultBody: Response = { status: ResponseCode.OK, message: null };

  const user = await getUser(req);
  if (!user) return res.status(401).send("Unauthorized");

  const files = await new Promise<ProcessedFiles | undefined>(
    (resolve, reject) => {
      const form = new formidable.IncomingForm();
      const files: ProcessedFiles = [];

      form.on("file", function (field, file) {
        files.push([field, file]);
      });
      form.on("end", () => resolve(files));
      form.on("error", (err) => reject(err));
      form.parse(req, () => {
        if (!files.length) {
          status = 400;
          resultBody = {
            status: ResponseCode.BAD_REQUEST,
            message: "No files were uploaded",
          };
          reject();
        }
      });
    },
  ).catch(() => {
    status = 500;
    resultBody = {
      status: ResponseCode.SERVER_ERROR,
      message: "Upload error",
    };
  });

  if (files?.length) {
    const targetPath = path.join(process.cwd(), `/uploads/`);
    try {
      await fs.access(targetPath);
    } catch (e) {
      await fs.mkdir(targetPath);
    }

    const result: ResultData[] = [];
    for (const file of files) {
      if (!file[1].originalFilename) return;

      const uuid = generateUUID();

      const tempPath = file[1].filepath;
      const targetFilePath = targetPath + file[1].originalFilename;

      await fs.rename(tempPath, targetFilePath);

      MinioClient.fPutObject(env.MINIO_DEFAULT_BUCKET, uuid, targetFilePath);

      result.push({
        fileName: file[1].originalFilename,
        id: uuid,
      });
    }

    await prisma.asset.createMany({
      data: result.map((item) => ({
        id: item.id,
        authorId: user.id,
      })),
    });

    resultBody = {
      status: ResponseCode.OK,
      message: result,
    };
  }

  return res.status(status).json(resultBody);
};

export default handler;

export const config = {
  api: {
    bodyParser: false,
  },
};
