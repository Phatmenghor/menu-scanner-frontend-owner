import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  getAllUserService,
  getUserByIdService,
  createUserService,
  updateUserService,
  deletedUserService,
} from "@/services/dashboard/user/plateform-user/plateform-user.service";
import { Status } from "@/constants/AppResource/status/status";
import type { UpdateUserParams, UserModel, CreateUserRequest } from "./types";
import { AllUserRequest } from "@/models/dashboard/user/plateform-user/user.request";

// Fetch all users
export const fetchUsers = createAsyncThunk(
  "users/fetchAll",
  async (params: AllUserRequest, { rejectWithValue }) => {
    try {
      return await getAllUserService(params);
    } catch (error: any) {
      return rejectWithValue(error?.message || "Failed to fetch users");
    }
  }
);

// Fetch user by ID
export const fetchUserById = createAsyncThunk(
  "users/fetchById",
  async (userId: string, { rejectWithValue }) => {
    try {
      return await getUserByIdService(userId);
    } catch (error: any) {
      return rejectWithValue(error?.message || "Failed to fetch user");
    }
  }
);

// Create user
export const createUser = createAsyncThunk(
  "users/create",
  async (userData: CreateUserRequest, { rejectWithValue }) => {
    try {
      return await createUserService(userData);
    } catch (error: any) {
      return rejectWithValue(error?.message || "Failed to create user");
    }
  }
);

// Update user
export const updateUser = createAsyncThunk(
  "users/update",
  async ({ userId, userData }: UpdateUserParams, { rejectWithValue }) => {
    try {
      return await updateUserService(userId, userData);
    } catch (error: any) {
      return rejectWithValue(error?.message || "Failed to update user");
    }
  }
);

// Delete user
export const deleteUser = createAsyncThunk(
  "users/delete",
  async (userId: string, { rejectWithValue }) => {
    try {
      await deletedUserService(userId);
      return userId;
    } catch (error: any) {
      return rejectWithValue(error?.message || "Failed to delete user");
    }
  }
);

// Toggle user status
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
      return rejectWithValue(error?.message || "Failed to toggle user status");
    }
  }
);
