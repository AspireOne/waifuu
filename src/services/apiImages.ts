import { apiClient } from "@/services/api";

export type apiPostImageType = {
  message: {
    id: string;
    fileName: string;
  }[];
};

export async function apiPostImage(data: any): Promise<apiPostImageType> {
  const res = await apiClient.post("/images/upload", data);
  return res.data;
}
