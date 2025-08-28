import {
  AllExchangeRateRequest,
  SaveExchangeRateRequest,
} from "@/models/dashboard/payment/exchange-rate/exchange-rate.request.model";
import { AllSubscriptionRequest } from "@/models/dashboard/master-data/subscription/subscription.request.model";
import { axiosClientWithAuth } from "@/utils/axios";

export async function getAllExchangeRateService(data: AllExchangeRateRequest) {
  try {
    const response = await axiosClientWithAuth.post(
      `/api/v1/exchange-rates/all`,
      data
    );
    return response.data.data;
  } catch (error: any) {
    if (error.response && error.response.data && error.response.data.message) {
      throw new Error(error.response.data.message);
    }
    console.error("Error get all exchange rates:", error);
    throw error;
  }
}

export async function getCurrentExchangeRateService(
  data: AllSubscriptionRequest
) {
  try {
    const response = await axiosClientWithAuth.get(
      `/api/v1/exchange-rates/current`
    );
    return response.data.data;
  } catch (error: any) {
    if (error.response && error.response.data && error.response.data.message) {
      throw new Error(error.response.data.message);
    }
    console.error("Error get current exchange-rate:", error);
    throw error;
  }
}

export async function createExchangeRateService(data: SaveExchangeRateRequest) {
  try {
    const response = await axiosClientWithAuth.post(
      `/api/v1/exchange-rates`,
      data
    );
    return response.data.data;
  } catch (error: any) {
    if (error.response && error.response.data && error.response.data.message) {
      throw new Error(error.response.data.message);
    }
    console.error("Error save new exchange-rate:", error);
    throw error;
  }
}

export async function updateExchangeRateService(
  id: string,
  data: SaveExchangeRateRequest
) {
  try {
    const response = await axiosClientWithAuth.put(
      `/api/v1/exchange-rates/${id}`,
      data
    );
    return response.data.data;
  } catch (error: any) {
    if (error.response && error.response.data && error.response.data.message) {
      throw new Error(error.response.data.message);
    }
    console.error("Error update exchange-rate:", error);
    throw error;
  }
}

export async function getCurrentExchangeRateValueService() {
  try {
    const response = await axiosClientWithAuth.get(
      `/api/v1/exchange-rates/current/value`
    );
    return response.data.data;
  } catch (error: any) {
    if (error.response && error.response.data && error.response.data.message) {
      throw new Error(error.response.data.message);
    }
    console.error("Error get current exchange-rate value:", error);
    throw error;
  }
}

export async function getExchangeRateByIdService(id: string) {
  try {
    const response = await axiosClientWithAuth.get(
      `/api/v1/exchange-rates/${id}`
    );
    return response.data.data;
  } catch (error: any) {
    if (error.response && error.response.data && error.response.data.message) {
      throw new Error(error.response.data.message);
    }
    console.error("Error get exchange-rate by id:", error);
    throw error;
  }
}

export async function deletedExchangeRateService(id: string) {
  try {
    const response = await axiosClientWithAuth.delete(
      `/api/v1/exchange-rates/${id}`
    );
    return response.data.data;
  } catch (error: any) {
    if (error.response && error.response.data && error.response.data.message) {
      throw new Error(error.response.data.message);
    }
    console.error("Error deleting exchange-rate:", error);
    throw error;
  }
}
