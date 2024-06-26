import { apiClient } from "@lib/apiClient";

export type apiPostImageType = {
  message: {
    id: string;
    fileName: string;
  }[];
};

export async function apiPostImage(data: unknown): Promise<apiPostImageType> {
  const res = await apiClient.post("/images/upload", data);
  return res.data;
}
