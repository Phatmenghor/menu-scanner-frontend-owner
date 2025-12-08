/**
 * Business Management - Async Thunks
 * Redux thunks for business CRUD operations
 */

import { axiosClientWithAuth } from "@/utils/axios";
import { createApiThunk } from "@/utils/axios/apiWrapper";
import {
  AllBusinessRequest,
  CreateBusinessRequest,
  UpdateBusinessParams,
} from "../models/request/business-request";

/**
 * Fetch all businesses
 */
export const fetchAllBusinessService = createApiThunk<any, AllBusinessRequest>(
  "businesses/fetchAll",
  async (params) => {
    const response = await axiosClientWithAuth.post(
      "/api/v1/businesses/all",
      params
    );
    return response.data.data;
  }
);

/**
 * Fetch businesses by ID
 */
export const fetchBusinessByIdService = createApiThunk<any, string>(
  "businesses/fetchById",
  async (userId) => {
    const response = await axiosClientWithAuth.get(
      `/api/v1/businesses/${userId}`
    );
    return response.data.data;
  }
);

/**
 * Create businesses
 */
export const createBusinessService = createApiThunk<any, CreateBusinessRequest>(
  "businesses/create",
  async (userData) => {
    const response = await axiosClientWithAuth.post(
      "/api/v1/businesses",
      userData
    );
    return response.data.data;
  }
);

/**
 * Update businesses
 */
export const updateBusinessService = createApiThunk<any, UpdateBusinessParams>(
  "businesses/update",
  async ({ businessId, businessData }) => {
    const response = await axiosClientWithAuth.put(
      `/api/v1/businesses/${businessId}`,
      businessData
    );
    return response.data.data;
  }
);

/**
 * Delete businesses
 */
export const deleteBusinessService = createApiThunk<any, string>(
  "businesses/delete",
  async (userId) => {
    const response = await axiosClientWithAuth.delete(
      `/api/v1/businesses/${userId}`
    );
    return response.data.data;
  }
);
