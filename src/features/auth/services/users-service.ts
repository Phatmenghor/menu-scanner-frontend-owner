/**
 * User Management - Services Layer
 * Business logic for user CRUD operations
 */

import {
  AllUserRequest,
  CreateUserRequest,
  UpdateUserRequest,
  UserModel,
} from "../types/auth-types";
import { axiosClientWithAuth } from "@/utils/axios";

/**
 * Get all users with filters and pagination
 */
export async function getAllUsersService(params: AllUserRequest) {
  try {
    const response = await axiosClientWithAuth.post(
      "/api/v1/users/all",
      params
    );
    return response.data.data;
  } catch (error: any) {
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    console.error("Error fetching all users:", error);
    throw error;
  }
}

/**
 * Get user by ID
 */
export async function getUserByIdService(userId: string) {
  try {
    const response = await axiosClientWithAuth.get(`/api/v1/users/${userId}`);
    return response.data.data;
  } catch (error: any) {
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    console.error("Error fetching user by ID:", error);
    throw error;
  }
}

/**
 * Create new user (platform-user, business-user, or business-owner)
 */
export async function createUserService(data: CreateUserRequest) {
  try {
    const response = await axiosClientWithAuth.post("/api/v1/users", data);
    return response.data.data;
  } catch (error: any) {
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    console.error("Error creating user:", error);
    throw error;
  }
}

/**
 * Update user
 */
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
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    console.error("Error updating user:", error);
    throw error;
  }
}

/**
 * Delete user
 */
export async function deleteUserService(userId: string) {
  try {
    await axiosClientWithAuth.delete(`/api/v1/users/${userId}`);
  } catch (error: any) {
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    console.error("Error deleting user:", error);
    throw error;
  }
}
