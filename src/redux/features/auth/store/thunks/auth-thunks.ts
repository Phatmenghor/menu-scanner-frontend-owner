/**
 * Auth Feature - Async Thunks
 * Redux thunks for async auth operations
 */

import { LoginCredentialsRequest } from "../models/request/auth-request";
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
