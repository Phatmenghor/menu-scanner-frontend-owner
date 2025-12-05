/**
 * User Management - Async Thunks
 * Redux thunks for user CRUD operations
 */

import { Status } from "@/constants/AppResource/status/status";
import {
  AllUserRequest,
  CreateUserRequest,
  UpdateUserParams,
} from "../models/request/users-request";
import { UserModel } from "../models/response/users-response";
import { axiosClientWithAuth } from "@/utils/axios";
import { createApiThunk } from "@/utils/axios/apiWrapper";

/**
 * Fetch all users
 */
export const fetchAllUsersService = createApiThunk<any, AllUserRequest>(
  "users/fetchAll",
  async (params) => {
    const response = await axiosClientWithAuth.post(
      "/api/v1/users/all",
      params
    );
    return response.data.data;
  }
);

/**
 * Fetch user by ID
 */
export const fetchUserByIdService = createApiThunk<any, string>(
  "users/fetchById",
  async (userId) => {
    const response = await axiosClientWithAuth.get(`/api/v1/users/${userId}`);
    return response.data.data;
  }
);

/**
 * Create user
 */
export const createUserService = createApiThunk<any, CreateUserRequest>(
  "users/create",
  async (userData) => {
    const response = await axiosClientWithAuth.post("/api/v1/users", userData);
    return response.data.data;
  }
);

/**
 * Update user
 */
export const updateUserService = createApiThunk<any, UpdateUserParams>(
  "users/update",
  async ({ userId, userData }) => {
    const response = await axiosClientWithAuth.put(
      `/api/v1/users/${userId}`,
      userData
    );
    return response.data.data;
  }
);

/**
 * Delete user
 */
export const deleteUserService = createApiThunk<any, string>(
  "users/delete",
  async (userId) => {
    const response = await axiosClientWithAuth.delete(
      `/api/v1/users/${userId}`
    );
    return response.data.data;
  }
);

/**
 * Toggle user status (Active/Inactive)
 */
export const toggleUserStatusService = createApiThunk<any, UserModel>(
  "users/toggleStatus",
  async (user) => {
    if (!user?.id) {
      throw new Error("User ID is required");
    }

    const newStatus =
      user?.accountStatus === Status.ACTIVE ? Status.INACTIVE : Status.ACTIVE;

    const response = await axiosClientWithAuth.put(`/api/v1/users/${user.id}`, {
      accountStatus: newStatus,
    });
    return response.data.data;
  }
);
