/**
 * Commune Management - Async Thunks
 * Redux thunks for communes CRUD operations
 */

import { axiosClientWithAuth } from "@/utils/axios";
import { createApiThunk } from "@/utils/axios/apiWrapper";
import {
  AllCommuneRequest,
  CreateCommuneRequest,
  UpdateCommuneParams,
} from "../models/request/commune-request";

/**
 * Fetch all communes
 */
export const fetchAllCommuneService = createApiThunk<any, AllCommuneRequest>(
  "communes/fetchAll",
  async (params) => {
    const response = await axiosClientWithAuth.post(
      "/api/v1/locations/communes/all",
      params
    );
    return response.data.data;
  }
);

/**
 * Fetch communes by ID
 */
export const fetchCommuneByIdService = createApiThunk<any, string>(
  "communes/fetchById",
  async (communeId) => {
    const response = await axiosClientWithAuth.get(
      `/api/v1/locations/communes/${communeId}`
    );
    return response.data.data;
  }
);

/**
 * Fetch communes by Name KH
 */
export const fetchCommuneByNameKhService = createApiThunk<any, string>(
  "communes/fetchByNameKh",
  async (nameKh) => {
    const response = await axiosClientWithAuth.get(
      `/api/v1/locations/communes/name-kh/${nameKh}`
    );
    return response.data.data;
  }
);

/**
 * Fetch communes by Name EN
 */
export const fetchCommuneByNameEnService = createApiThunk<any, string>(
  "communes/fetchByNameEn",
  async (nameEn) => {
    const response = await axiosClientWithAuth.get(
      `/api/v1/locations/communes/name-en/${nameEn}`
    );
    return response.data.data;
  }
);

/**
 * Fetch provinces by Name EN
 */
export const fetchCommuneByCodeEnService = createApiThunk<any, string>(
  "communes/fetchByCode",
  async (nameEn) => {
    const response = await axiosClientWithAuth.get(
      `/api/v1/locations/communes/code/${nameEn}`
    );
    return response.data.data;
  }
);

/**
 * Create communes
 */
export const createCommuneService = createApiThunk<any, CreateCommuneRequest>(
  "communes/create",
  async (communeData) => {
    const response = await axiosClientWithAuth.post(
      "/api/v1/locations/communes",
      communeData
    );
    return response.data.data;
  }
);

/**
 * Update communes
 */
export const updateCommuneService = createApiThunk<any, UpdateCommuneParams>(
  "communes/update",
  async ({ communeId, communeData }) => {
    const response = await axiosClientWithAuth.put(
      `/api/v1/locations/communes/${communeId}`,
      communeData
    );
    return response.data.data;
  }
);

/**
 * Delete communes
 */
export const deleteCommuneService = createApiThunk<any, string>(
  "communes/delete",
  async (communeId) => {
    const response = await axiosClientWithAuth.delete(
      `/api/v1/locations/communes/${communeId}`
    );
    return response.data.data;
  }
);
