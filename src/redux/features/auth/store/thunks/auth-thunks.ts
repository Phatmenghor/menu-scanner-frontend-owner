/**
 * Auth Feature - Async Thunks
 * Redux thunks for async auth operations
 */

import {
  ChangePasswordRequest,
  LoginCredentialsRequest,
} from "../models/request/auth-request";
import { axiosClient, axiosClientWithAuth } from "@/utils/axios";
import { createApiThunk } from "@/utils/axios/apiWrapper";

/**
 * Login thunk
 */
export const loginService = createApiThunk<any, LoginCredentialsRequest>(
  "auth/login",
  async (credentials) => {
    const response = await axiosClient.post("/api/v1/auth/login", credentials);
    return response.data.data;
  }
);

/**
 * Get profile thunk
 * Fetches user profile information
 */
export const getProfileService = createApiThunk<any, void>(
  "auth/getProfile",
  async () => {
    const response = await axiosClientWithAuth.get("/api/v1/users/profile");
    return response.data.data;
  }
);

/**
 * Update profile thunk
 * Updates current user's profile
 */
export const updateProfileService = createApiThunk<any, any>(
  "auth/updateProfile",
  async (profileData) => {
    const response = await axiosClientWithAuth.put(
      "/api/v1/users/profile",
      profileData
    );
    return response.data.data;
  }
);

/**
 * Change password thunk
 * Changes current user's password
 */

export const changePasswordService = createApiThunk<any, ChangePasswordRequest>(
  "auth/changePassword",
  async (passwordData) => {
    const response = await axiosClientWithAuth.post(
      "/api/v1/users/change-password",
      passwordData
    );
    return response.data.data;
  }
);

/**
 * Delete account thunk
 * Deletes current user's account
 */
export const deleteAccountService = createApiThunk<any, void>(
  "auth/deleteAccount",
  async () => {
    const response = await axiosClientWithAuth.delete("/api/v1/users/profile");
    return response.data.data;
  }
);
