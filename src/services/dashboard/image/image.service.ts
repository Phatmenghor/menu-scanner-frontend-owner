import { UploadImageRequest } from "@/models/image/image.request.model";
import { axiosClientWithAuth } from "@/utils/axios";

export async function uploadImageService(data: UploadImageRequest) {
  try {
    const response = await axiosClientWithAuth.post(`/api/images`, data);
    return response.data;
  } catch (error: any) {
    // Extract error message from response if available
    if (error.response && error.response.data && error.response.data.message) {
      throw new Error(error.response.data.message);
    }
    console.error("Error upload image:", error);
    throw error;
  }
}
