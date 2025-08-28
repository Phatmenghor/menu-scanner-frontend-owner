import {
  AllSubscriptionRequest,
  CancelSubscriptionRequest,
  CreateSubscriptionRequest,
  RenewSubscriptionRequest,
  UpdateSubscriptionRequest,
} from "@/models/dashboard/master-data/subscription/subscription.request.model";
import { axiosClientWithAuth } from "@/utils/axios";

export async function getAllSubscriptionService(data: AllSubscriptionRequest) {
  try {
    const response = await axiosClientWithAuth.post(
      `/api/v1/subscriptions/all`,
      data
    );
    return response.data.data;
  } catch (error: any) {
    if (error.response && error.response.data && error.response.data.message) {
      throw new Error(error.response.data.message);
    }
    console.error("Error get all subscriptions:", error);
    throw error;
  }
}

export async function createSubscriptionService(
  data: CreateSubscriptionRequest
) {
  try {
    const response = await axiosClientWithAuth.post(
      `/api/v1/subscriptions`,
      data
    );
    return response.data.data;
  } catch (error: any) {
    if (error.response && error.response.data && error.response.data.message) {
      throw new Error(error.response.data.message);
    }
    console.error("Error create subscription:", error);
    throw error;
  }
}

export async function updateSubscriptionService(
  userId: string,
  data: UpdateSubscriptionRequest
) {
  try {
    const response = await axiosClientWithAuth.put(
      `/api/v1/subscriptions/${userId}`,
      data
    );
    return response.data.data;
  } catch (error: any) {
    if (error.response && error.response.data && error.response.data.message) {
      throw new Error(error.response.data.message);
    }
    console.error("Error update subscription:", error);
    throw error;
  }
}

export async function renewSubscriptionService(
  id: string,
  data: RenewSubscriptionRequest
) {
  try {
    const response = await axiosClientWithAuth.post(
      `/api/v1/subscriptions/${id}/renew`,
      data
    );
    return response.data.data;
  } catch (error: any) {
    if (error.response && error.response.data && error.response.data.message) {
      throw new Error(error.response.data.message);
    }
    console.error("Error renew subscription:", error);
    throw error;
  }
}

export async function cancelSubscriptionService(
  id: string,
  data: CancelSubscriptionRequest
) {
  try {
    const response = await axiosClientWithAuth.post(
      `/api/v1/subscriptions/${id}/cancel`,
      data
    );
    return response.data.data;
  } catch (error: any) {
    if (error.response && error.response.data && error.response.data.message) {
      throw new Error(error.response.data.message);
    }
    console.error("Error cancel subscription:", error);
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
