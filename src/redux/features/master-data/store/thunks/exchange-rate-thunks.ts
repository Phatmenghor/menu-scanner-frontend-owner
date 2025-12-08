/**
 * Exchange Rate Management - Async Thunks
 * Redux thunks for Exchange Rate CRUD operations
 */

import { axiosClientWithAuth } from "@/utils/axios";
import { createApiThunk } from "@/utils/axios/apiWrapper";
import {
  AllExchangeRateRequest,
  CreateExchangeRateRequest,
  UpdateExchangeRateParams,
} from "../models/request/exchange-rate-request";

/**
 * Fetch all Exchange Rate
 */
export const fetchAllExchangeRateService = createApiThunk<
  any,
  AllExchangeRateRequest
>("exchange-rate/fetchAll", async (params) => {
  const response = await axiosClientWithAuth.post(
    "/api/v1/exchange-rates/all",
    params
  );
  return response.data.data;
});

/**
 * Fetch Exchange Rate by ID
 */
export const fetchExchangeRateByIdService = createApiThunk<any, string>(
  "exchange-rate/fetchById",
  async (exchangeRateId) => {
    const response = await axiosClientWithAuth.get(
      `/api/v1/exchange-rates/${exchangeRateId}`
    );
    return response.data.data;
  }
);

/**
 * Create Exchange Rate
 */
export const createExchangeRateService = createApiThunk<
  any,
  CreateExchangeRateRequest
>("exchange-rate/create", async (exchange) => {
  const response = await axiosClientWithAuth.post(
    "/api/v1/exchange-rates",
    exchange
  );
  return response.data.data;
});

/**
 * Update Exchange Rate
 */
export const updateExchangeRateService = createApiThunk<
  any,
  UpdateExchangeRateParams
>("exchange-rate/update", async ({ exchangeRateId, exchangeRateData }) => {
  const response = await axiosClientWithAuth.put(
    `/api/v1/exchange-rates/${exchangeRateId}`,
    exchangeRateData
  );
  return response.data.data;
});

/**
 * Delete Exchange Rate
 */
export const deleteExchangeRateService = createApiThunk<any, string>(
  "exchange-rate/delete",
  async (exchangeRateId) => {
    const response = await axiosClientWithAuth.delete(
      `/api/v1/exchange-rates/${exchangeRateId}`
    );
    return response.data.data;
  }
);
