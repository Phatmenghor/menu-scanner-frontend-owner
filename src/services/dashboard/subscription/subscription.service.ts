import {
  AllSubscriptionRequest,
  CancelSubscriptionRequest,
  CreateSubscriptionRequest,
  RenewSubscriptionRequest,
  UpdateSubscriptionRequest,
} from "@/models/dashboard/subscription/subscription.request.model";
import { axiosClientWithAuth } from "@/utils/axios";

export async function getAllSubscriptionService(data: AllSubscriptionRequest) {
  try {
    // POST request to fetch all staff matching the filters
    const response = await axiosClientWithAuth.post(
      `/api/v1/subscriptions/all`,
      data
    );
    return response.data.data; // Return the actual staff list data
  } catch (error: any) {
    // Check if the error response contains a message, throw it as Error
    if (error.response && error.response.data && error.response.data.message) {
      throw new Error(error.response.data.message);
    }
    console.error("Error get all subscriptions:", error); // Log error for debugging
    throw error; // Re-throw the error for further handling
  }
}

export async function getSubscriptionMyBusinessService(
  data: AllSubscriptionRequest
) {
  try {
    // POST request to fetch all staff matching the filters
    const response = await axiosClientWithAuth.post(
      `/api/v1/subscriptions/my-business`,
      data
    );
    return response.data.data; // Return the actual staff list data
  } catch (error: any) {
    // Check if the error response contains a message, throw it as Error
    if (error.response && error.response.data && error.response.data.message) {
      throw new Error(error.response.data.message);
    }
    console.error("Error get subscriptions of my business:", error); // Log error for debugging
    throw error; // Re-throw the error for further handling
  }
}

export async function createSubscriptionService(
  data: CreateSubscriptionRequest
) {
  try {
    // POST request to fetch all staff matching the filters
    const response = await axiosClientWithAuth.post(
      `/api/v1/subscriptions`,
      data
    );
    return response.data.data; // Return the actual staff list data
  } catch (error: any) {
    // Check if the error response contains a message, throw it as Error
    if (error.response && error.response.data && error.response.data.message) {
      throw new Error(error.response.data.message);
    }
    console.error("Error create subscription:", error); // Log error for debugging
    throw error; // Re-throw the error for further handling
  }
}

export async function updateSubscriptionService(
  userId: string,
  data: UpdateSubscriptionRequest
) {
  try {
    // POST request to fetch all staff matching the filters
    const response = await axiosClientWithAuth.put(
      `/api/v1/subscriptions/${userId}`,
      data
    );
    return response.data.data; // Return the actual staff list data
  } catch (error: any) {
    // Check if the error response contains a message, throw it as Error
    if (error.response && error.response.data && error.response.data.message) {
      throw new Error(error.response.data.message);
    }
    console.error("Error update subscription:", error); // Log error for debugging
    throw error; // Re-throw the error for further handling
  }
}

export async function renewSubscriptionService(
  id: string,
  data: RenewSubscriptionRequest
) {
  try {
    // POST request to fetch all staff matching the filters
    const response = await axiosClientWithAuth.post(
      `/api/v1/subscriptions/${id}/renew`,
      data
    );
    return response.data.data; // Return the actual staff list data
  } catch (error: any) {
    // Check if the error response contains a message, throw it as Error
    if (error.response && error.response.data && error.response.data.message) {
      throw new Error(error.response.data.message);
    }
    console.error("Error renew subscription:", error); // Log error for debugging
    throw error; // Re-throw the error for further handling
  }
}

export async function cancelSubscriptionService(
  id: string,
  data: CancelSubscriptionRequest
) {
  try {
    // POST request to fetch all staff matching the filters
    const response = await axiosClientWithAuth.post(
      `/api/v1/subscriptions/${id}/cancel`,
      data
    );
    return response.data.data; // Return the actual staff list data
  } catch (error: any) {
    // Check if the error response contains a message, throw it as Error
    if (error.response && error.response.data && error.response.data.message) {
      throw new Error(error.response.data.message);
    }
    console.error("Error cancel subscription:", error); // Log error for debugging
    throw error; // Re-throw the error for further handling
  }
}

export async function getUserProfileService() {
  try {
    // GET request to fetch a staff by ID
    const response = await axiosClientWithAuth.get(`/api/v1/users/profile`);
    return response.data.data; // Return staff detail data
  } catch (error: any) {
    // Extract and throw API error message if available
    if (error.response && error.response.data && error.response.data.message) {
      throw new Error(error.response.data.message);
    }
    console.error("Error get user profile:", error);
    throw error;
  }
}

export async function getSubscriptionByIdService(id: string) {
  try {
    const response = await axiosClientWithAuth.get(
      `/api/v1/subscriptions/${id}`
    );
    return response.data.data;
  } catch (error: any) {
    if (error.response && error.response.data && error.response.data.message) {
      throw new Error(error.response.data.message);
    }
    console.error("Error get subscription by id:", error);
    throw error;
  }
}

export async function deletedSubscriptionService(id: string) {
  try {
    const response = await axiosClientWithAuth.delete(
      `/api/v1/subscriptions/${id}`
    );
    return response.data.data;
  } catch (error: any) {
    if (error.response && error.response.data && error.response.data.message) {
      throw new Error(error.response.data.message);
    }
    console.error("Error deleting subscription:", error);
    throw error;
  }
}
