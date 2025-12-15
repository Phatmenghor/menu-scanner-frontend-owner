/**
 * Districts Management - Async Thunks
 * Redux thunks for districts CRUD operations
 */

import { axiosClientWithAuth } from "@/utils/axios";
import { createApiThunk } from "@/utils/axios/apiWrapper";
import {
  AllDistrictRequest,
  CreateDistrictRequest,
  UpdateDistrictParams,
} from "../models/request/district-request";

/**
 * Fetch all districts
 */
export const fetchAllDistrictService = createApiThunk<any, AllDistrictRequest>(
  "districts/fetchAll",
  async (params) => {
    const response = await axiosClientWithAuth.post(
      "/api/v1/locations/districts/all",
      params
    );
    return response.data.data;
  }
);

/**
 * Fetch districts by ID
 */
export const fetchDistrictByIdService = createApiThunk<any, string>(
  "districts/fetchById",
  async (communeId) => {
    const response = await axiosClientWithAuth.get(
      `/api/v1/locations/districts/${communeId}`
    );
    return response.data.data;
  }
);

/**
 * Fetch districts by Name KH
 */
export const fetchDistrictByNameKhService = createApiThunk<any, string>(
  "districts/fetchByNameKh",
  async (nameKh) => {
    const response = await axiosClientWithAuth.get(
      `/api/v1/locations/districts/name-kh/${nameKh}`
    );
    return response.data.data;
  }
);

/**
 * Fetch districts by Name EN
 */
export const fetcDistrictByNameEnService = createApiThunk<any, string>(
  "districts/fetchByNameEn",
  async (nameEn) => {
    const response = await axiosClientWithAuth.get(
      `/api/v1/locations/districts/name-en/${nameEn}`
    );
    return response.data.data;
  }
);

/**
 * Fetch districts by Name EN
 */
export const fetchDistrictByCodeEnService = createApiThunk<any, string>(
  "districts/fetchByCode",
  async (nameEn) => {
    const response = await axiosClientWithAuth.get(
      `/api/v1/locations/districts/code/${nameEn}`
    );
    return response.data.data;
  }
);

/**
 * Create districts
 */
export const createDistrictService = createApiThunk<any, CreateDistrictRequest>(
  "districts/create",
  async (communeData) => {
    const response = await axiosClientWithAuth.post(
      "/api/v1/locations/districts",
      communeData
    );
    return response.data.data;
  }
);

/**
 * Update districts
 */
export const updateDistrictService = createApiThunk<any, UpdateDistrictParams>(
  "districts/update",
  async ({ districtId, districtData }) => {
    const response = await axiosClientWithAuth.put(
      `/api/v1/locations/districts/${districtId}`,
      districtData
    );
    return response.data.data;
  }
);

/**
 * Delete districts
 */
export const deleteDistrictService = createApiThunk<any, string>(
  "districts/delete",
  async (districtId) => {
    const response = await axiosClientWithAuth.delete(
      `/api/v1/locations/districts/${districtId}`
    );
    return response.data.data;
  }
);
