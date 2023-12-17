import { promises as fs } from "fs";
import path from "path";
import { prisma } from "@/server/clients/db";
import metaHandler from "@/server/lib/metaHandler";
import { PutObjectCommand } from "@aws-sdk/client-s3";

import { s3Client, s3DefaultBucket } from "@/server/clients/s3Client";
import * as formidable from "formidable";
import { randomUUID } from "crypto";

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

const fileType = (buffer: Buffer) => {
  // File signatures (magic numbers) for common image formats
  const signatures = {
    "89504E47": "image/png",
    "47494638": "image/gif",
    "25504446": "application/pdf",
    FFD8FFE0: "image/jpeg",
    FFD8FFE1: "image/jpeg",
    FFD8FFE2: "image/jpeg",
    FFD8FFE3: "image/jpeg",
    FFD8FFE8: "image/jpeg",
    "89504E46": "image/webp", // WebP
    // Add more signatures as needed
  };

  // Get the first few bytes as a hex string
  const hexSignature = buffer.toString("hex", 0, 4).toUpperCase();

  // Check if the hex signature matches any known file types
  for (const [signature, type] of Object.entries(signatures)) {
    if (hexSignature.startsWith(signature)) {
      return type;
    }
  }

  // If no match is found, return null or a default type
  return null;
};

export default metaHandler.protected(async (req, res, ctx) => {
  let status = 200;
  let resultBody: Response = { status: ResponseCode.OK, message: null };

  const files = await new Promise<ProcessedFiles | undefined>(
    (resolve, reject) => {
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
    }
  ).catch(() => {
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

  try {
    const result: ResultData[] = [];
    for (const file of files) {
      if (!file[1].originalFilename) return;

      const tempPath = file[1].filepath;
      const targetFilePath = targetPath + file[1].originalFilename;
      const objectName = randomUUID();

      await fs.rename(tempPath, targetFilePath);

      const fileBuffer = await fs.readFile(targetFilePath);
      const fileTypeResult = fileType(fileBuffer);

      const uploadParams = {
        Bucket: s3DefaultBucket,
        Key: objectName,
        Body: fileBuffer,
        ContentType: fileTypeResult || "application/octet-stream",
      };

      await s3Client.send(new PutObjectCommand(uploadParams));

      result.push({
        fileName: file[1].originalFilename,
        id: objectName,
      });
    }

    await prisma.asset.createMany({
      data: result.map((item) => ({ id: item.id, authorId: ctx.user.id })),
    });

    resultBody = { status: ResponseCode.OK, message: result };
    
    return res.status(status).json(resultBody);
  } catch (err) {
    return res
      .status(500)
      .json({ status: 500, message: "Error uploading image" });
  }
});
