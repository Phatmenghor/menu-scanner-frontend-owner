import { axiosClientWithAuth } from "@/utils/axios";

export interface uploadImageModel {
  base64: string;
  type: string;
}

export interface UploadImageResponse {
  id: string;
  imageUrl: string;
  type: string;
}

export async function uploadImageService(
  data: uploadImageModel
): Promise<UploadImageResponse | null> {
  try {
    const response = await axiosClientWithAuth.post(`/api/images`, data);
    return response.data;
  } catch (error: any) {
    console.error("Error uploading image:", error);
    return null;
  }
}
