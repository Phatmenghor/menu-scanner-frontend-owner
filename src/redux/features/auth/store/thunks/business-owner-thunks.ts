/**
 * Business owners Management - Async Thunks
 * Redux thunks for Business owners CRUD operations
 */

import { axiosClientWithAuth } from "@/utils/axios";
import { createApiThunk } from "@/utils/axios/apiWrapper";
import {
  AllBusinessOwnerRequest,
  UpdateBusinessOwnerCancelParams,
  UpdateBusinessOwnerChangePlanParams,
  UpdateBusinessOwnerRenewParams,
} from "../models/request/business-owner-request";
import { CreateBusinessOwnerData } from "../models/schema/business-owner.schema";

/**
 * Fetch all business owners
 */
export const fetchAllBusinessOwnerService = createApiThunk<
  any,
  AllBusinessOwnerRequest
>("business-owners/fetchAll", async (params) => {
  const response = await axiosClientWithAuth.post(
    "/api/v1/business-owners/all",
    params
  );
  return response.data.data;
});

/**
 * Fetch business owners by ID
 */
export const fetchBusinessOwnerByIdService = createApiThunk<any, string>(
  "business-owners/fetchById",
  async (userId) => {
    const response = await axiosClientWithAuth.get(
      `/api/v1/business-owners/${userId}`
    );
    return response.data.data;
  }
);

/**
 * Create business-owners
 */
export const createBusinessOwnerService = createApiThunk<
  any,
  CreateBusinessOwnerData
>("business-owners/create", async (userData) => {
  const response = await axiosClientWithAuth.post(
    "/api/v1/business-owners",
    userData
  );
  return response.data.data;
});

/**
 * Update business owners change-plan
 */
export const updateBusinessOwnerChangePlanService = createApiThunk<
  any,
  UpdateBusinessOwnerChangePlanParams
>("business-owners/change-plan", async ({ ownerId, businessOwnerData }) => {
  const response = await axiosClientWithAuth.put(
    `/api/v1/business-owners/${ownerId}/change-plan`,
    businessOwnerData
  );
  return response.data.data;
});

/**
 * Update business owners renew
 */
export const updateBusinessOwnerRenewService = createApiThunk<
  any,
  UpdateBusinessOwnerRenewParams
>("business-owners/renew", async ({ ownerId, businessOwnerData }) => {
  const response = await axiosClientWithAuth.post(
    `/api/v1/business-owners/${ownerId}/renew`,
    businessOwnerData
  );
  return response.data.data;
});

/**
 * Update business owners cancel
 */
export const updateBusinessOwnerCancelService = createApiThunk<
  any,
  UpdateBusinessOwnerCancelParams
>("business-owners/cancel", async ({ ownerId, businessOwnerData }) => {
  const response = await axiosClientWithAuth.put(
    `/api/v1/business-owners/${ownerId}/cancel`,
    businessOwnerData
  );
  return response.data.data;
});

/**
 * Delete user
 */
export const deleteBusinessOwnerService = createApiThunk<any, string>(
  "business-owners/delete",
  async (userId) => {
    const response = await axiosClientWithAuth.delete(
      `/api/v1/business-owners/${userId}`
    );
    return response.data.data;
  }
);
