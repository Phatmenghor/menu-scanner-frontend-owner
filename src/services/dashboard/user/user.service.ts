import {
  AllUserRequest,
  ChangePasswordByAdminModel,
  ChangePasswordModel,
  CreateUserRequest,
  UpdateUserRequest,
} from "@/models/user/user.request";
import { axiosClientWithAuth, axiosServer } from "@/utils/axios";
import axios from "axios";
import { UUID } from "crypto";

export async function getAllUserService(data: AllUserRequest) {
  try {
    // POST request to fetch all staff matching the filters
    const response = await axiosClientWithAuth.post(`/api/v1/users/all`, data);
    return response.data.data; // Return the actual staff list data
  } catch (error: any) {
    // Check if the error response contains a message, throw it as Error
    if (error.response && error.response.data && error.response.data.message) {
      throw new Error(error.response.data.message);
    }
    console.error("Error get all users:", error); // Log error for debugging
    throw error; // Re-throw the error for further handling
  }
}

export async function createUserService(data: CreateUserRequest) {
  try {
    // POST request to fetch all staff matching the filters
    const response = await axiosClientWithAuth.post(`/api/v1/users`, data);
    return response.data.data; // Return the actual staff list data
  } catch (error: any) {
    // Check if the error response contains a message, throw it as Error
    if (error.response && error.response.data && error.response.data.message) {
      throw new Error(error.response.data.message);
    }
    console.error("Error create users:", error); // Log error for debugging
    throw error; // Re-throw the error for further handling
  }
}

export async function updateUserService(
  userId: string,
  data: UpdateUserRequest
) {
  try {
    // POST request to fetch all staff matching the filters
    const response = await axiosClientWithAuth.put(
      `/api/v1/users/${userId}`,
      data
    );
    return response.data.data; // Return the actual staff list data
  } catch (error: any) {
    // Check if the error response contains a message, throw it as Error
    if (error.response && error.response.data && error.response.data.message) {
      throw new Error(error.response.data.message);
    }
    console.error("Error update user:", error); // Log error for debugging
    throw error; // Re-throw the error for further handling
  }
}

export async function updateUserProfileService(data: UpdateUserRequest) {
  try {
    // POST request to fetch all staff matching the filters
    const response = await axiosClientWithAuth.put(
      `/api/v1/users/profile`,
      data
    );
    return response.data.data; // Return the actual staff list data
  } catch (error: any) {
    // Check if the error response contains a message, throw it as Error
    if (error.response && error.response.data && error.response.data.message) {
      throw new Error(error.response.data.message);
    }
    console.error("Error update user profile:", error); // Log error for debugging
    throw error; // Re-throw the error for further handling
  }
}

export const AdminChangePasswordService = async (
  data: ChangePasswordByAdminModel
) => {
  try {
    const response = await axiosClientWithAuth.post(
      `/api/v1/users/admin/reset-password`,
      data
    );

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      // Extract error message from backend if available
      const message =
        error.response?.data?.message ||
        "Change password failed. Please try again.";
      throw new Error(message);
    }

    // Unexpected (non-Axios) error
    throw new Error("An unexpected error occurred. Please try again.");
  }
};

export const ChangePasswordService = async (data: ChangePasswordModel) => {
  try {
    const response = await axiosClientWithAuth.post(
      `/api/v1/users/change-password`,
      data
    );

    return response.data.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      // Extract error message from backend if available
      const message =
        error.response?.data?.message ||
        "Change password failed. Please try again.";
      throw new Error(message);
    }

    // Unexpected (non-Axios) error
    throw new Error("An unexpected error occurred. Please try again.");
  }
};

export async function getUserProfileService() {
  try {
    // GET request to fetch a staff by ID
    const response = await axiosClientWithAuth.get(`/api/v1/users/profile`);
    return response.data.data; // Return staff detail data
  } catch (error: any) {
    // Extract and throw API error message if available
    if (error.response && error.response.data && error.response.data.message) {
      throw new Error(error.response.data.message);
    }
    console.error("Error get user profile:", error);
    throw error;
  }
}

export async function deletedUserService(id: string) {
  try {
    const response = await axiosClientWithAuth.delete(`/api/v1/users/${id}`);
    return response.data.data;
  } catch (error: any) {
    if (error.response && error.response.data && error.response.data.message) {
      throw new Error(error.response.data.message);
    }
    console.error("Error deleting user:", error);
    throw error;
  }
}
