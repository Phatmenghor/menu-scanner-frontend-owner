/**
 * Province Management - Async Thunks
 * Redux thunks for provinces CRUD operations
 */

import { axiosClientWithAuth } from "@/utils/axios";
import { createApiThunk } from "@/utils/axios/apiWrapper";
import {
  AllProvinceRequest,
  CreateProvinceRequest,
  UpdateProvinceParams,
} from "../models/request/province-request";

/**
 * Fetch all provinces
 */
export const fetchAllProvinceService = createApiThunk<any, AllProvinceRequest>(
  "provinces/fetchAll",
  async (params) => {
    const response = await axiosClientWithAuth.post(
      "/api/v1/locations/provinces/all",
      params
    );
    return response.data.data;
  }
);

/**
 * Fetch provinces by ID
 */
export const fetchProvinceByIdService = createApiThunk<any, string>(
  "provinces/fetchById",
  async (provinceId) => {
    const response = await axiosClientWithAuth.get(
      `/api/v1/locations/provinces/${provinceId}`
    );
    return response.data.data;
  }
);

/**
 * Fetch provinces by Name KH
 */
export const fetchProvinceByNameKhService = createApiThunk<any, string>(
  "provinces/fetchByNameKh",
  async (nameKh) => {
    const response = await axiosClientWithAuth.get(
      `/api/v1/locations/provinces/name-kh/${nameKh}`
    );
    return response.data.data;
  }
);

/**
 * Fetch provinces by Name EN
 */
export const fetchProvinceByNameEnService = createApiThunk<any, string>(
  "provinces/fetchByNameEn",
  async (nameEn) => {
    const response = await axiosClientWithAuth.get(
      `/api/v1/locations/provinces/name-en/${nameEn}`
    );
    return response.data.data;
  }
);

/**
 * Fetch provinces by Name EN
 */
export const fetchProvinceByCodeEnService = createApiThunk<any, string>(
  "provinces/fetchByCode",
  async (nameEn) => {
    const response = await axiosClientWithAuth.get(
      `/api/v1/locations/provinces/code/${nameEn}`
    );
    return response.data.data;
  }
);

/**
 * Create provinces
 */
export const createProvinceService = createApiThunk<any, CreateProvinceRequest>(
  "provinces/create",
  async (provinceData) => {
    const response = await axiosClientWithAuth.post(
      "/api/v1/locations/provinces",
      provinceData
    );
    return response.data.data;
  }
);

/**
 * Update provinces
 */
export const updateProvinceService = createApiThunk<any, UpdateProvinceParams>(
  "provinces/update",
  async ({ provinceId, provinceData }) => {
    const response = await axiosClientWithAuth.put(
      `/api/v1/locations/provinces/${provinceId}`,
      provinceData
    );
    return response.data.data;
  }
);

/**
 * Delete provinces
 */
export const deleteProvinceService = createApiThunk<any, string>(
  "provinces/delete",
  async (provinceId) => {
    const response = await axiosClientWithAuth.delete(
      `/api/v1/locations/provinces/${provinceId}`
    );
    return response.data.data;
  }
);
