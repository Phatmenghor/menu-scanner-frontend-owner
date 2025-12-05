/**
 * Business Management - Async Thunks
 * Redux thunks for Business CRUD operations
 */

import {
  AllBusinessRequest,
  CreateBusinessRequest,
  UpdateBusinessParams,
} from "../models/request/business-request";
import { axiosClientWithAuth } from "@/utils/axios";
import { createApiThunk } from "@/utils/axios/apiWrapper";

/**
 * Fetch all Business
 */
export const fetchAllBusinessService = createApiThunk<any, AllBusinessRequest>(
  "business/fetchAll",
  async (params) => {
    const response = await axiosClientWithAuth.post(
      "/api/v1/businesses/all",
      params
    );
    return response.data.data;
  }
);

/**
 * Fetch Business by ID
 */
export const fetchBusinessByIdService = createApiThunk<any, string>(
  "business/fetchById",
  async (businessId) => {
    const response = await axiosClientWithAuth.get(
      `/api/v1/businesses/${businessId}`
    );
    return response.data.data;
  }
);

/**
 * Create Business
 */
export const createBusinessService = createApiThunk<any, CreateBusinessRequest>(
  "business/create",
  async (businessData) => {
    const response = await axiosClientWithAuth.post(
      "/api/v1/businesses",
      businessData
    );
    return response.data.data;
  }
);

/**
 * Update Business
 */
export const updateBusinessService = createApiThunk<any, UpdateBusinessParams>(
  "business/update",
  async ({ businessId, businessData }) => {
    const response = await axiosClientWithAuth.put(
      `/api/v1/businesses/${businessId}`,
      businessData
    );
    return response.data.data;
  }
);

/**
 * Delete Business
 */
export const deleteBusinessService = createApiThunk<any, string>(
  "business/delete",
  async (businessId) => {
    const response = await axiosClientWithAuth.delete(
      `/api/v1/businesses/${businessId}`
    );
    return response.data.data;
  }
);
