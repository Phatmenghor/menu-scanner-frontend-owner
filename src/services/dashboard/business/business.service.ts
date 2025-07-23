import {
  AllBusinessRequest,
  CreateBusinessRequest,
  UpdateBusinessRequest,
} from "@/models/dashboard/business/business.request.model";
import { axiosClientWithAuth } from "@/utils/axios";

export async function getAllBusinessService(data: AllBusinessRequest) {
  try {
    // POST request to fetch all staff matching the filters
    const response = await axiosClientWithAuth.post(
      `/api/v1/business/all`,
      data
    );
    return response.data.data; // Return the actual staff list data
  } catch (error: any) {
    // Check if the error response contains a message, throw it as Error
    if (error.response && error.response.data && error.response.data.message) {
      throw new Error(error.response.data.message);
    }
    console.error("Error get all businesses:", error); // Log error for debugging
    throw error; // Re-throw the error for further handling
  }
}

export async function createBusinessService(data: CreateBusinessRequest) {
  try {
    // POST request to fetch all staff matching the filters
    const response = await axiosClientWithAuth.post(`/api/v1/business`, data);
    return response.data.data; // Return the actual staff list data
  } catch (error: any) {
    // Check if the error response contains a message, throw it as Error
    if (error.response && error.response.data && error.response.data.message) {
      throw new Error(error.response.data.message);
    }
    console.error("Error create business:", error); // Log error for debugging
    throw error; // Re-throw the error for further handling
  }
}

export async function updateBusinessService(
  businessId: string,
  data: UpdateBusinessRequest
) {
  try {
    // POST request to fetch all staff matching the filters
    const response = await axiosClientWithAuth.put(
      `/api/v1/business/${businessId}`,
      data
    );
    return response.data.data; // Return the actual staff list data
  } catch (error: any) {
    // Check if the error response contains a message, throw it as Error
    if (error.response && error.response.data && error.response.data.message) {
      throw new Error(error.response.data.message);
    }
    console.error("Error update business:", error); // Log error for debugging
    throw error; // Re-throw the error for further handling
  }
}

export async function deletedBusinessService(id: string) {
  try {
    const response = await axiosClientWithAuth.delete(`/api/v1/business/${id}`);
    return response.data.data;
  } catch (error: any) {
    if (error.response && error.response.data && error.response.data.message) {
      throw new Error(error.response.data.message);
    }
    console.error("Error deleting business:", error);
    throw error;
  }
}
