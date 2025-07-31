import { AllSubdomainRequest } from "@/models/dashboard/sub-domain/sub-domain.request.model";
import { axiosClientWithAuth } from "@/utils/axios";

export async function getAllSubdomainService(data: AllSubdomainRequest) {
  try {
    // POST request to fetch all staff matching the filters
    const response = await axiosClientWithAuth.post(
      `/api/v1/subdomains/all`,
      data
    );
    return response.data.data; // Return the actual staff list data
  } catch (error: any) {
    // Check if the error response contains a message, throw it as Error
    if (error.response && error.response.data && error.response.data.message) {
      throw new Error(error.response.data.message);
    }
    console.error("Error get all subdomain:", error); // Log error for debugging
    throw error; // Re-throw the error for further handling
  }
}
