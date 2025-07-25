import { UpdateMyBusinessRequest } from "@/models/dashboard/user/business-user/business-user.request.model";
import { axiosClientWithAuth } from "@/utils/axios";

export async function getMyBusinessService() {
  try {
    // POST request to fetch all staff matching the filters
    const response = await axiosClientWithAuth.get(
      `/api/v1/business/settings/my-business`
    );
    return response.data.data; // Return the actual staff list data
  } catch (error: any) {
    // Check if the error response contains a message, throw it as Error
    if (error.response && error.response.data && error.response.data.message) {
      throw new Error(error.response.data.message);
    }
    console.error("Error get My business:", error); // Log error for debugging
    throw error; // Re-throw the error for further handling
  }
}

export async function updateMyBusinessService(data: UpdateMyBusinessRequest) {
  try {
    // POST request to fetch all staff matching the filters
    const response = await axiosClientWithAuth.put(
      `/api/v1/business/settings/my-business`,
      data
    );
    return response.data.data; // Return the actual staff list data
  } catch (error: any) {
    // Check if the error response contains a message, throw it as Error
    if (error.response && error.response.data && error.response.data.message) {
      throw new Error(error.response.data.message);
    }
    console.error("Error update my business:", error); // Log error for debugging
    throw error; // Re-throw the error for further handling
  }
}

export async function getMyBusinessByIdService(id: string) {
  try {
    const response = await axiosClientWithAuth.get(`/api/v1/business/${id}`);
    return response.data.data;
  } catch (error: any) {
    if (error.response && error.response.data && error.response.data.message) {
      throw new Error(error.response.data.message);
    }
    console.error("Error get business by id:", error);
    throw error;
  }
}

export async function updateMyBusinessByIdService(
  id: string,
  data: UpdateMyBusinessRequest
) {
  try {
    // POST request to fetch all staff matching the filters
    const response = await axiosClientWithAuth.put(
      `/api/v1/business/settings/${id}`,
      data
    );
    return response.data.data; // Return the actual staff list data
  } catch (error: any) {
    // Check if the error response contains a message, throw it as Error
    if (error.response && error.response.data && error.response.data.message) {
      throw new Error(error.response.data.message);
    }
    console.error("Error update my business by id:", error); // Log error for debugging
    throw error; // Re-throw the error for further handling
  }
}
