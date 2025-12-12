/**
 * Village Management - Async Thunks
 * Redux thunks for villages CRUD operations
 */

import { axiosClientWithAuth } from "@/utils/axios";
import { createApiThunk } from "@/utils/axios/apiWrapper";
import {
  AllVillageRequest,
  CreateVillageRequest,
  UpdateVillageParams,
} from "../models/request/village-request";

/**
 * Fetch all villages
 */
export const fetchAllVillageService = createApiThunk<any, AllVillageRequest>(
  "villages/fetchAll",
  async (params) => {
    const response = await axiosClientWithAuth.post(
      "/api/v1/locations/villages/all",
      params
    );
    return response.data.data;
  }
);

/**
 * Fetch villages by ID
 */
export const fetchVillageByIdService = createApiThunk<any, string>(
  "villages/fetchById",
  async (communeId) => {
    const response = await axiosClientWithAuth.get(
      `/api/v1/locations/villages/${communeId}`
    );
    return response.data.data;
  }
);

/**
 * Fetch villages by Name KH
 */
export const fetchVillageByNameKhService = createApiThunk<any, string>(
  "villages/fetchByNameKh",
  async (nameKh) => {
    const response = await axiosClientWithAuth.get(
      `/api/v1/locations/villages/name-kh/${nameKh}`
    );
    return response.data.data;
  }
);

/**
 * Fetch villages by Name EN
 */
export const fetchVillageByNameEnService = createApiThunk<any, string>(
  "villages/fetchByNameEn",
  async (nameEn) => {
    const response = await axiosClientWithAuth.get(
      `/api/v1/locations/villages/name-en/${nameEn}`
    );
    return response.data.data;
  }
);

/**
 * Fetch villages by Name EN
 */
export const fetchVillageByCodeEnService = createApiThunk<any, string>(
  "villages/fetchByCode",
  async (nameEn) => {
    const response = await axiosClientWithAuth.get(
      `/api/v1/locations/villages/code/${nameEn}`
    );
    return response.data.data;
  }
);

/**
 * Create villages
 */
export const createVillageService = createApiThunk<any, CreateVillageRequest>(
  "villages/create",
  async (communeData) => {
    const response = await axiosClientWithAuth.post(
      "/api/v1/locations/villages",
      communeData
    );
    return response.data.data;
  }
);

/**
 * Update villages
 */
export const updateVillageService = createApiThunk<any, UpdateVillageParams>(
  "villages/update",
  async ({ villageId, villageData }) => {
    const response = await axiosClientWithAuth.put(
      `/api/v1/locations/villages/${villageId}`,
      villageData
    );
    return response.data.data;
  }
);

/**
 * Delete villages
 */
export const deleteVillageService = createApiThunk<any, string>(
  "villages/delete",
  async (communeId) => {
    const response = await axiosClientWithAuth.delete(
      `/api/v1/locations/villages/${communeId}`
    );
    return response.data.data;
  }
);
