import {
  AllSubscriptionPlanRequest,
  CreateSubscriptionPlanRequest,
  UpdateSubscriptionPlanRequest,
} from "@/models/dashboard/master-data/subscription-plan/subscription-plan-request";
import { axiosClientWithAuth } from "@/utils/axios";

export async function getAllSubscriptionPlanService(
  data: AllSubscriptionPlanRequest
) {
  try {
    // POST request to fetch all staff matching the filters
    const response = await axiosClientWithAuth.post(
      `/api/v1/subscription-plans/all`,
      data
    );
    return response.data.data; // Return the actual staff list data
  } catch (error: any) {
    // Check if the error response contains a message, throw it as Error
    if (error.response && error.response.data && error.response.data.message) {
      throw new Error(error.response.data.message);
    }
    console.error("Error get all subscription plan:", error); // Log error for debugging
    throw error; // Re-throw the error for further handling
  }
}

export async function createSubscriptionService(
  data: CreateSubscriptionPlanRequest
) {
  try {
    // POST request to fetch all staff matching the filters
    const response = await axiosClientWithAuth.post(
      `/api/v1/subscription-plans`,
      data
    );
    return response.data.data; // Return the actual staff list data
  } catch (error: any) {
    // Check if the error response contains a message, throw it as Error
    if (error.response && error.response.data && error.response.data.message) {
      throw new Error(error.response.data.message);
    }
    console.error("Error create subscription plan:", error); // Log error for debugging
    throw error; // Re-throw the error for further handling
  }
}

export async function updateSubscriptionPlanService(
  id: string,
  data: UpdateSubscriptionPlanRequest
) {
  try {
    // POST request to fetch all staff matching the filters
    const response = await axiosClientWithAuth.put(
      `/api/v1/subscription-plans/${id}`,
      data
    );
    return response.data.data; // Return the actual staff list data
  } catch (error: any) {
    // Check if the error response contains a message, throw it as Error
    if (error.response && error.response.data && error.response.data.message) {
      throw new Error(error.response.data.message);
    }
    console.error("Error update subscription plan:", error); // Log error for debugging
    throw error; // Re-throw the error for further handling
  }
}

export async function deletedSubscriptionPlanService(id: string) {
  try {
    const response = await axiosClientWithAuth.delete(
      `/api/v1/subscription-plans/${id}`
    );
    return response.data.data;
  } catch (error: any) {
    if (error.response && error.response.data && error.response.data.message) {
      throw new Error(error.response.data.message);
    }
    console.error("Error deleting subscription plan:", error);
    throw error;
  }
}
