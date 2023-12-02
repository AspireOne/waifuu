import { promises as fs } from "fs";
import path from "path";
import { prisma } from "@/server/clients/db";
import { env } from "@/server/env";
import metaHandler from "@/server/lib/metaHandler";
import { PutObjectCommand } from "@aws-sdk/client-s3";

import { s3Client } from "@/server/clients/s3Client";
import * as formidable from "formidable";

type ProcessedFiles = [string, formidable.File][];
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

export const config = {
  api: {
    bodyParser: false,
  },
};

export default metaHandler.protected(async (req, res, ctx) => {
  let status = 200;
  let resultBody: Response = { status: ResponseCode.OK, message: null };

  const files = await new Promise<ProcessedFiles | undefined>((resolve, reject) => {
    const form = new formidable.IncomingForm();
    const files: ProcessedFiles = [];

    form.on("file", (field, file) => {
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
  }).catch(() => {
    status = 500;
    resultBody = {
      status: ResponseCode.SERVER_ERROR,
      message: "Upload error",
    };
    throw new Error("Upload error");
  });

  if (!files?.length) return res.status(status).json(resultBody);

  const targetPath = path.join(process.cwd(), "/uploads/");
  try {
    await fs.access(targetPath);
  } catch (e) {
    await fs.mkdir(targetPath);
  }

  const result: ResultData[] = [];
  for (const file of files) {
    if (!file[1].originalFilename) return;

    const objectName = convertToS3Name(file[1].originalFilename);

    const tempPath = file[1].filepath;
    const targetFilePath = targetPath + file[1].originalFilename;

    await fs.rename(tempPath, targetFilePath);

    const uploadParams = {
      Bucket: env.S3_DEFAULT_BUCKET,
      Key: objectName,
      Body: await fs.readFile(targetFilePath),
    };

    await s3Client.send(new PutObjectCommand(uploadParams));

    result.push({
      fileName: file[1].originalFilename,
      id: objectName, // Use the generated object name as the ID
    });
  }

  await prisma.asset.createMany({
    data: result.map((item) => ({
      id: item.id,
      authorId: ctx.user.id,
    })),
  });

  resultBody = {
    status: ResponseCode.OK,
    message: result,
  };

  return res.status(status).json(resultBody);
});

function convertToS3Name(inputString: string): string {
  const sanitizedString = inputString
    .replace(/[^a-zA-Z0-9\-_.~]/g, "") // sanitize.
    .replace(/(^[-_~.]+|[-_~.]+$)/g, ""); // Trims leading and trailing special characters.

  if (Buffer.from(sanitizedString).length > 1024) {
    throw new Error("Object name exceeds the maximum length of 1024 bytes.");
  }

  return sanitizedString;
}
