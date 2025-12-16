/**
 * Subscriptions Management - Async Thunks
 * Redux thunks for subscriptions CRUD operations
 */

import { axiosClientWithAuth } from "@/utils/axios";
import { createApiThunk } from "@/utils/axios/apiWrapper";
import {
  AllSubscriptionRequest,
  CreateSubscriptionRequest,
  UpdateSubscriptionParams,
} from "../models/request/subscription-request";

/**
 * Fetch all subscriptions
 */
export const fetchAllSubscriptionService = createApiThunk<
  any,
  AllSubscriptionRequest
>("subscriptions/fetchAll", async (params) => {
  const response = await axiosClientWithAuth.post(
    "/api/v1/subscriptions/all",
    params
  );
  return response.data.data;
});

/**
 * Fetch subscriptions by ID
 */
export const fetchSubscriptionByIdService = createApiThunk<any, string>(
  "subscriptions/fetchById",
  async (subscriptionId) => {
    const response = await axiosClientWithAuth.get(
      `/api/v1/subscriptions/${subscriptionId}`
    );
    return response.data.data;
  }
);

/**
 * Create subscriptions
 */
export const createSubscriptionService = createApiThunk<
  any,
  CreateSubscriptionRequest
>("subscriptions/create", async (userData) => {
  const response = await axiosClientWithAuth.post(
    "/api/v1/subscriptions",
    userData
  );
  return response.data.data;
});

/**
 * Update subscriptions
 */
export const updateSubscriptionService = createApiThunk<
  any,
  UpdateSubscriptionParams
>(
  "subscriptions/update",
  async ({
    subscriptionId: SubscriptionId,
    subscriptionsData: SubscriptionsData,
  }) => {
    const response = await axiosClientWithAuth.put(
      `/api/v1/subscriptions/${SubscriptionId}`,
      SubscriptionsData
    );
    return response.data.data;
  }
);

/**
 * Delete subscriptions
 */
export const deleteSubscriptionService = createApiThunk<any, string>(
  "subscriptions/delete",
  async (subscriptionId) => {
    const response = await axiosClientWithAuth.delete(
      `/api/v1/subscriptions/${subscriptionId}`
    );
    return response.data.data;
  }
);
