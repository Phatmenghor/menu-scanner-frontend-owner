import {
  AllBusinessRequest,
  CreateBusinessRequest,
  UpdateBusinessRequest,
} from "@/models/dashboard/master-data/business/business.request.model";
import { CreateBusinessOwnerRequest } from "@/models/dashboard/user/business-owner/business-owner.request.model";
import { axiosClientWithAuth } from "@/utils/axios";

export async function getAllBusinessService(data: AllBusinessRequest) {
  try {
    const response = await axiosClientWithAuth.post(
      `/api/v1/business/all`,
      data
    );
    return response.data.data;
  } catch (error: any) {
    if (error.response && error.response.data && error.response.data.message) {
      throw new Error(error.response.data.message);
    }
    console.error("Error get all businesses:", error);
    throw error;
  }
}

export async function getBusinessByIdService(id: string) {
  try {
    const response = await axiosClientWithAuth.get(`/api/v1/business/${id}`);
    return response.data.data;
  } catch (error: any) {
    if (error.response && error.response.data && error.response.data.message) {
      throw new Error(error.response.data.message);
    }
    console.error("Error get businesses by id:", error);
    throw error;
  }
}

export async function createBusinessService(data: CreateBusinessRequest) {
  try {
    const response = await axiosClientWithAuth.post(`/api/v1/business`, data);
    return response.data.data;
  } catch (error: any) {
    if (error.response && error.response.data && error.response.data.message) {
      throw new Error(error.response.data.message);
    }
    console.error("Error create business:", error);
    throw error;
  }
}

export async function updateBusinessService(
  businessId: string,
  data: UpdateBusinessRequest
) {
  try {
    const response = await axiosClientWithAuth.put(
      `/api/v1/business/${businessId}`,
      data
    );
    return response.data.data;
  } catch (error: any) {
    if (error.response && error.response.data && error.response.data.message) {
      throw new Error(error.response.data.message);
    }
    console.error("Error update business:", error);
    throw error;
  }
}

export async function deletedBusinessService(id: string) {
  try {
    const response = await axiosClientWithAuth.delete(`/api/v1/business/${id}`);
    return response.data.data;
  } catch (error: any) {
    if (error.response && error.response.data && error.response.data.message) {
      throw new Error(error.response.data.message);
    }
    console.error("Error deleting business:", error);
    throw error;
  }
}

export async function createBusinessOwnerService(
  data: CreateBusinessOwnerRequest
) {
  try {
    const response = await axiosClientWithAuth.post(
      `/api/v1/users/business-owner`,
      data
    );
    return response.data.data;
  } catch (error: any) {
    if (error.response && error.response.data && error.response.data.message) {
      throw new Error(error.response.data.message);
    }
    console.error("Error create business user:", error);
    throw error;
  }
}
