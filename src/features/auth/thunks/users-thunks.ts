/**
 * User Management - Async Thunks
 * Redux thunks for user CRUD operations
 */

import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  AllUserRequest,
  CreateUserRequest,
  UpdateUserRequest,
  UserModel,
  UpdateUserParams,
} from "../types/auth-types";
import { Status } from "@/constants/AppResource/status/status";
import { updateUserService } from "@/services/dashboard/user/plateform-user/plateform-user.service";
import {
  createUserService,
  deleteUserService,
  getAllUsersService,
  getUserByIdService,
} from "../services/users-service";

/**
 * Fetch all users
 */
export const fetchUsers = createAsyncThunk(
  "users/fetchAll",
  async (params: AllUserRequest, { rejectWithValue }) => {
    try {
      return await getAllUsersService(params);
    } catch (error: any) {
      const errorMsg = error?.message || "Failed to fetch users";
      return rejectWithValue(errorMsg);
    }
  }
);

/**
 * Fetch user by ID
 */
export const fetchUserById = createAsyncThunk(
  "users/fetchById",
  async (userId: string, { rejectWithValue }) => {
    try {
      return await getUserByIdService(userId);
    } catch (error: any) {
      const errorMsg = error?.message || "Failed to fetch user";
      return rejectWithValue(errorMsg);
    }
  }
);

/**
 * Create user
 */
export const createUser = createAsyncThunk(
  "users/create",
  async (userData: CreateUserRequest, { rejectWithValue }) => {
    try {
      return await createUserService(userData);
    } catch (error: any) {
      const errorMsg = error?.message || "Failed to create user";
      return rejectWithValue(errorMsg);
    }
  }
);

/**
 * Update user
 */
export const updateUser = createAsyncThunk(
  "users/update",
  async ({ userId, userData }: UpdateUserParams, { rejectWithValue }) => {
    try {
      return await updateUserService(userId, userData);
    } catch (error: any) {
      const errorMsg = error?.message || "Failed to update user";
      return rejectWithValue(errorMsg);
    }
  }
);

/**
 * Delete user
 */
export const deleteUser = createAsyncThunk(
  "users/delete",
  async (userId: string, { rejectWithValue }) => {
    try {
      await deleteUserService(userId);
      return userId;
    } catch (error: any) {
      const errorMsg = error?.message || "Failed to delete user";
      return rejectWithValue(errorMsg);
    }
  }
);

/**
 * Toggle user status (Active/Inactive)
 */
export const toggleUserStatus = createAsyncThunk(
  "users/toggleStatus",
  async (user: UserModel, { rejectWithValue }) => {
    try {
      if (!user?.id) {
        throw new Error("User ID is required");
      }

      const newStatus =
        user?.accountStatus === Status.ACTIVE ? Status.INACTIVE : Status.ACTIVE;

      return await updateUserService(user.id, {
        accountStatus: newStatus,
      });
    } catch (error: any) {
      const errorMsg = error?.message || "Failed to toggle user status";
      return rejectWithValue(errorMsg);
    }
  }
);
