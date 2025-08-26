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
    const response = await axiosClientWithAuth.post(
      `/api/v1/subscription-plans/all`,
      data
    );
    return response.data.data;
  } catch (error: any) {
    if (error.response && error.response.data && error.response.data.message) {
      throw new Error(error.response.data.message);
    }
    console.error("Error get all subscription plan:", error);
    throw error;
  }
}

export async function getSubscriptionPlanByIdService(id: string) {
  try {
    const response = await axiosClientWithAuth.get(
      `/api/v1/subscription-plans/${id}`
    );
    return response.data.data;
  } catch (error: any) {
    if (error.response && error.response.data && error.response.data.message) {
      throw new Error(error.response.data.message);
    }
    console.error("Error get businesses by id:", error);
    throw error;
  }
}

export async function createSubscriptionService(
  data: CreateSubscriptionPlanRequest
) {
  try {
    const response = await axiosClientWithAuth.post(
      `/api/v1/subscription-plans`,
      data
    );
    return response.data.data;
  } catch (error: any) {
    if (error.response && error.response.data && error.response.data.message) {
      throw new Error(error.response.data.message);
    }
    console.error("Error create subscription plan:", error);
    throw error;
  }
}

export async function updateSubscriptionPlanService(
  id: string,
  data: UpdateSubscriptionPlanRequest
) {
  try {
    const response = await axiosClientWithAuth.put(
      `/api/v1/subscription-plans/${id}`,
      data
    );
    return response.data.data;
  } catch (error: any) {
    if (error.response && error.response.data && error.response.data.message) {
      throw new Error(error.response.data.message);
    }
    console.error("Error update subscription plan:", error);
    throw error;
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
