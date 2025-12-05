/**
 * Auth Feature - Async Thunks
 * Redux thunks for async auth operations
 */

import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  LoginCredentialsModel,
  UserAuthResponseModel,
  ProfileResponseModel,
} from "../models/auth-models";
import { loginService, getProfileService } from "../services/auth-services";

/**
 * Login thunk
 * Dispatches login action and handles loading/error states
 */
export const login = createAsyncThunk(
  "auth/login",
  async (credentials: LoginCredentialsModel, { rejectWithValue }) => {
    try {
      const userData = await loginService(credentials);
      return userData;
    } catch (error: any) {
      return rejectWithValue(
        error?.errorMessage || error?.message || "Login failed"
      );
    }
  }
);

/**
 * Get profile thunk
 * Fetches user profile information
 */
export const getProfile = createAsyncThunk(
  "auth/getProfile",
  async (_, { rejectWithValue }) => {
    try {
      const profile = await getProfileService();
      return profile;
    } catch (error: any) {
      return rejectWithValue(error?.message || "Failed to fetch profile");
    }
  }
);
