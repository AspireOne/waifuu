// Make a next route for image upload
import { NextApiRequest, NextApiResponse } from "next";
import formidable, { errors as formidableErrors } from "formidable";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const form = formidable({});

  try {
    const [fields, files] = await form.parse(req);

    // TODO: Handle the upload using minio client
    res.status(200).json("OK");
  } catch (error) {
    res.status(500).send("ERR");
  }
}
