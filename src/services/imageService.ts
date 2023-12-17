import { apiClient } from "@lib/apiClient";
import axios, { AxiosResponse } from "axios";

export type ApiPostImageType = {
  message: {
    id: string;
    fileName: string;
  }[];
};

export async function apiPostImage(data: unknown): Promise<ApiPostImageType> {
  const res = await apiClient.post("/images/upload", data);
  return res.data;
}

export async function apiImageUpload(
  file: File,
  data: ApiPresignUrlTypeResponse
): Promise<string> {
  const formData = new FormData();
  for (const [key, value] of Object.entries(data.fields)) {
    formData.append(key, value);
  }
  formData.append("file", file);

  try {
    const response: AxiosResponse<string> = await axios.post(
      data.url,
      formData
    );

    return response.data;
  } catch (error) {
    throw new Error("Failed to upload file");
  }
}

export type ApiPresignUrlTypeRequest = {
  // Example image/jpeg
  contentType: string;
};

interface ApiPresignUrlTypeResponse {
  id: string;
  url: string;
  fields: {
    ContentType: string;
    bucket: string;
    "X-Amz-Algorithm": string;
    "X-Amz-Credential": string;
    "X-Amz-Date": string;
    key: string;
    Policy: string;
    "X-Amz-Signature": string;
  };
}

export async function apiPresignUrl(
  data: ApiPresignUrlTypeRequest
): Promise<ApiPresignUrlTypeResponse> {
  const res = await apiClient.post("/images/presign", data);
  return res.data;
}
