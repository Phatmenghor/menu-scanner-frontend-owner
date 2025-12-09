/**
 * SubscriptionPlan Management - Async Thunks
 * Redux thunks for SubscriptionPlan CRUD operations
 */

import { axiosClientWithAuth } from "@/utils/axios";
import { createApiThunk } from "@/utils/axios/apiWrapper";
import {
  AllSubscriptionPlanRequest,
  CreateSubscriptionPlanRequest,
  UpdateSubscriptionPlanParams,
} from "../models/request/subscription-plan-request";

/**
 * Fetch all SubscriptionPlan
 */
export const fetchAllSubscriptionPlanService = createApiThunk<
  any,
  AllSubscriptionPlanRequest
>("subscription-plans/fetchAll", async (params) => {
  const response = await axiosClientWithAuth.post(
    "/api/v1/subscription-plans/all",
    params
  );
  return response.data.data;
});

/**
 * Fetch SubscriptionPlan by ID
 */
export const fetchSubscriptionPlanByIdService = createApiThunk<any, string>(
  "subscription-plans/fetchById",
  async (userId) => {
    const response = await axiosClientWithAuth.get(
      `/api/v1/subscription-plans/${userId}`
    );
    return response.data.data;
  }
);

/**
 * Create SubscriptionPlan
 */
export const createSubscriptionPlanService = createApiThunk<
  any,
  CreateSubscriptionPlanRequest
>("subscription-plans/create", async (userData) => {
  const response = await axiosClientWithAuth.post(
    "/api/v1/subscription-plans",
    userData
  );
  return response.data.data;
});

/**
 * Update SubscriptionPlan
 */
export const updateSubscriptionPlanService = createApiThunk<
  any,
  UpdateSubscriptionPlanParams
>(
  "subscription-plans/update",
  async ({ subscriptionPlanId, subscriptionPlanData }) => {
    const response = await axiosClientWithAuth.put(
      `/api/v1/subscription-plans/${subscriptionPlanId}`,
      subscriptionPlanData
    );
    return response.data.data;
  }
);

/**
 * Delete SubscriptionPlan
 */
export const deleteSubscriptionPlanService = createApiThunk<any, string>(
  "subscription-plans/delete",
  async (userId) => {
    const response = await axiosClientWithAuth.delete(
      `/api/v1/subscription-plans/${userId}`
    );
    return response.data.data;
  }
);
