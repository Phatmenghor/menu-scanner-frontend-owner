import {
  AllUserRequest,
  ChangePasswordByAdminModel,
  ChangePasswordModel,
  CreateUserRequest,
  UpdateUserRequest,
} from "@/models/dashboard/user/plateform-user/user.request";
import { axiosClientWithAuth } from "@/utils/axios";
import axios from "axios";

export async function getAllUserService(data: AllUserRequest) {
  try {
    const response = await axiosClientWithAuth.post(`/api/v1/users/all`, data);
    return response.data.data;
  } catch (error: any) {
    if (error.response && error.response.data && error.response.data.message) {
      throw new Error(error.response.data.message);
    }
    console.error("Error get all users:", error);
    throw error;
  }
}

export async function getUserByIdService(id: string) {
  try {
    const response = await axiosClientWithAuth.get(`/api/v1/users/${id}`);
    return response.data.data;
  } catch (error: any) {
    if (error.response && error.response.data && error.response.data.message) {
      throw new Error(error.response.data.message);
    }
    console.error("Error get user by id:", error);
    throw error;
  }
}

export async function createUserService(data: CreateUserRequest) {
  try {
    const response = await axiosClientWithAuth.post(`/api/v1/users`, data);
    return response.data.data;
  } catch (error: any) {
    if (error.response && error.response.data && error.response.data.message) {
      throw new Error(error.response.data.message);
    }
    console.error("Error create users:", error);
    throw error;
  }
}

export async function updateUserService(
  userId: string,
  data: UpdateUserRequest
) {
  try {
    const response = await axiosClientWithAuth.put(
      `/api/v1/users/${userId}`,
      data
    );
    return response.data.data;
  } catch (error: any) {
    if (error.response && error.response.data && error.response.data.message) {
      throw new Error(error.response.data.message);
    }
    console.error("Error update user:", error);
    throw error;
  }
}

export async function updateUserProfileService(data: UpdateUserRequest) {
  try {
    const response = await axiosClientWithAuth.put(
      `/api/v1/users/profile`,
      data
    );
    return response.data.data;
  } catch (error: any) {
    if (error.response && error.response.data && error.response.data.message) {
      throw new Error(error.response.data.message);
    }
    console.error("Error update user profile:", error);
    throw error;
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
      const message =
        error.response?.data?.message ||
        "Change password failed. Please try again.";
      throw new Error(message);
    }

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
      const message =
        error.response?.data?.message ||
        "Change password failed. Please try again.";
      throw new Error(message);
    }

    throw new Error("An unexpected error occurred. Please try again.");
  }
};

export async function getUserProfileService() {
  try {
    const response = await axiosClientWithAuth.get(`/api/v1/users/profile`);
    return response.data.data;
  } catch (error: any) {
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
