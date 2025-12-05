/**
 * Auth Feature - Services Layer
 * Business logic for authentication operations
 */

import { axiosClient, axiosClientWithAuth } from "@/utils/axios";
import { storeRoles } from "@/utils/local-storage/roles";
import { storeToken } from "@/utils/local-storage/token";
import { storeUserInfo } from "@/utils/local-storage/userInfo";
import { LoginCredentialsRequest } from "../models/request/auth-request";

/**
 * Login service
 * @param credentials User login credentials
 */
export async function loginService(credentials: LoginCredentialsRequest) {
  try {
    const response = await axiosClient.post("/api/v1/auth/login", credentials);
    const userData = response.data.data;

    // Store authentication data in local storage
    if (userData.accessToken) {
      storeToken(userData.accessToken);
    }

    if (userData) {
      storeUserInfo({
        userId: userData.userId || "",
        userIdentifier: userData.userIdentifier || "",
        profileImageUrl: userData.profileImageUrl || "",
        email: userData.email || "",
        fullName: userData.fullName || "",
        businessId: userData.businessId || "",
        userType: userData.userType || "",
      });
    }

    if (userData.roles) {
      storeRoles(userData.roles);
    }

    return userData;
  } catch (error: any) {
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw error;
  }
}

/**
 * Get profile service
 */
export async function getProfileService() {
  try {
    const response = await axiosClientWithAuth.get("/api/v1/users/profile");
    return response.data.data;
  } catch (error: any) {
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw error;
  }
}

/**
 * Logout service
 * Clears local storage data
 */
export function logoutService(): void {
  storeToken("");
  storeUserInfo({
    userId: "",
    userIdentifier: "",
    profileImageUrl: "",
    email: "",
    fullName: "",
    businessId: "",
    userType: "",
  });
  storeRoles([]);
}
