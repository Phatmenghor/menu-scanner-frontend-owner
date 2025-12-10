/**
 * Payment Management - Async Thunks
 * Redux thunks for Payment CRUD operations
 */

import { axiosClientWithAuth } from "@/utils/axios";
import { createApiThunk } from "@/utils/axios/apiWrapper";
import {
  AllPaymentRequest,
  CreatePaymentRequest,
  UpdatePaymentParams,
} from "../models/request/payment-request";

/**
 * Fetch all Payment
 */
export const fetchAllPaymentService = createApiThunk<any, AllPaymentRequest>(
  "payments/fetchAll",
  async (params) => {
    const response = await axiosClientWithAuth.post(
      "/api/v1/payments/all",
      params
    );
    return response.data.data;
  }
);

/**
 * Fetch Payment by ID
 */
export const fetchPaymentByIdService = createApiThunk<any, string>(
  "payments/fetchById",
  async (userId) => {
    const response = await axiosClientWithAuth.get(
      `/api/v1/payments/${userId}`
    );
    return response.data.data;
  }
);

/**
 * Create Payment
 */
export const createPaymentService = createApiThunk<any, CreatePaymentRequest>(
  "payments/create",
  async (userData) => {
    const response = await axiosClientWithAuth.post(
      "/api/v1/payments",
      userData
    );
    return response.data.data;
  }
);

/**
 * Update Payment
 */
export const updatePaymentService = createApiThunk<any, UpdatePaymentParams>(
  "payments/update",
  async ({ paymentId, paymentData }) => {
    const response = await axiosClientWithAuth.put(
      `/api/v1/payments/${paymentId}`,
      paymentData
    );
    return response.data.data;
  }
);

/**
 * Delete Payment
 */
export const deletePaymentService = createApiThunk<any, string>(
  "payments/delete",
  async (userId) => {
    const response = await axiosClientWithAuth.delete(
      `/api/v1/payments/${userId}`
    );
    return response.data.data;
  }
);
