import {
  AllPaymentRequest,
  CreatePaymentRequest,
  UpdatePaymentRequest,
} from "@/models/dashboard/payment/payment/payment.request.model";
import { axiosClientWithAuth } from "@/utils/axios";

export async function getAllPaymentService(data: AllPaymentRequest) {
  try {
    const response = await axiosClientWithAuth.post(
      `/api/v1/payments/all`,
      data
    );
    return response.data.data;
  } catch (error: any) {
    if (error.response && error.response.data && error.response.data.message) {
      throw new Error(error.response.data.message);
    }
    console.error("Error get all payments:", error);
    throw error;
  }
}

export async function getPaymentByIdService(id: string) {
  try {
    const response = await axiosClientWithAuth.get(`/api/v1/payments/${id}`);
    return response.data.data;
  } catch (error: any) {
    if (error.response && error.response.data && error.response.data.message) {
      throw new Error(error.response.data.message);
    }
    console.error("Error get exchange-rate by id:", error);
    throw error;
  }
}

export async function createPaymentService(data: CreatePaymentRequest) {
  try {
    const response = await axiosClientWithAuth.post(`/api/v1/payments`, data);
    return response.data.data;
  } catch (error: any) {
    if (error.response && error.response.data && error.response.data.message) {
      throw new Error(error.response.data.message);
    }
    console.error("Error save new payment:", error);
    throw error;
  }
}

export async function updatePaymentService(
  id: string,
  data: UpdatePaymentRequest
) {
  try {
    const response = await axiosClientWithAuth.put(
      `/api/v1/payments/${id}`,
      data
    );
    return response.data.data;
  } catch (error: any) {
    if (error.response && error.response.data && error.response.data.message) {
      throw new Error(error.response.data.message);
    }
    console.error("Error update payment:", error);
    throw error;
  }
}

export async function deletedPaymentService(id: string) {
  try {
    const response = await axiosClientWithAuth.delete(`/api/v1/payments/${id}`);
    return response.data.data;
  } catch (error: any) {
    if (error.response && error.response.data && error.response.data.message) {
      throw new Error(error.response.data.message);
    }
    console.error("Error deleting payment:", error);
    throw error;
  }
}
