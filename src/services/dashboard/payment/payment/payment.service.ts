import { SaveExchangeRateRequest } from "@/models/dashboard/payment/exchange-rate/exchange-rate.request.model";
import {
  AllPaymentRequest,
  CreatePaymentRequest,
  UpdatePaymentRequest,
} from "@/models/dashboard/payment/payment/payment.request.model";
import { AllSubscriptionRequest } from "@/models/dashboard/subscription/subscription.request.model";
import { axiosClientWithAuth } from "@/utils/axios";

export async function getAllPaymentService(data: AllPaymentRequest) {
  try {
    // POST request to fetch all staff matching the filters
    const response = await axiosClientWithAuth.post(
      `/api/v1/payments/all`,
      data
    );
    return response.data.data; // Return the actual staff list data
  } catch (error: any) {
    // Check if the error response contains a message, throw it as Error
    if (error.response && error.response.data && error.response.data.message) {
      throw new Error(error.response.data.message);
    }
    console.error("Error get all payments:", error); // Log error for debugging
    throw error; // Re-throw the error for further handling
  }
}

export async function createPaymentService(data: CreatePaymentRequest) {
  try {
    // POST request to fetch all staff matching the filters
    const response = await axiosClientWithAuth.post(`/api/v1/payments`, data);
    return response.data.data; // Return the actual staff list data
  } catch (error: any) {
    // Check if the error response contains a message, throw it as Error
    if (error.response && error.response.data && error.response.data.message) {
      throw new Error(error.response.data.message);
    }
    console.error("Error save new payment:", error); // Log error for debugging
    throw error; // Re-throw the error for further handling
  }
}

export async function updatePaymentService(
  id: string,
  data: UpdatePaymentRequest
) {
  try {
    // POST request to fetch all staff matching the filters
    const response = await axiosClientWithAuth.put(
      `/api/v1/payments/${id}`,
      data
    );
    return response.data.data; // Return the actual staff list data
  } catch (error: any) {
    // Check if the error response contains a message, throw it as Error
    if (error.response && error.response.data && error.response.data.message) {
      throw new Error(error.response.data.message);
    }
    console.error("Error update payment:", error); // Log error for debugging
    throw error; // Re-throw the error for further handling
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
