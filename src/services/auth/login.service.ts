import { LoginCredentials } from "@/models/auth/auth.request";
import { UserAuthResponse } from "@/models/auth/auth.response";
import { axiosClient, axiosClientWithAuth } from "@/utils/axios";
import { storeRoles } from "@/utils/local-storage/roles";
import { storeToken } from "@/utils/local-storage/token";
import { storeUserInfo } from "@/utils/local-storage/userInfo";

export async function loginService(credentials: LoginCredentials) {
  try {
    const response = await axiosClient.post("/api/v1/auth/login", credentials);

    const userData = response.data.data as UserAuthResponse;
    // On success, store token and role (simulate your original behavior)
    storeToken(userData.accessToken);
    storeUserInfo({
      userId: userData.userId || "",
      userIdentifier: userData.userIdentifier || "",
      profileImageUrl: userData.profileImageUrl || "",
      email: userData.email || "",
      fullName: userData.fullName || "",
      businessId: userData.businessId || "",
      userType: userData.userType || "",
    });
    storeRoles(userData.roles);

    return userData;
  } catch (error) {
    console.error("Login service error:", error);

    throw {
      errorMessage: "An unexpected error occurred during login.",
      rawError: error,
    };
  }
}

export async function getProfileService() {
  try {
    const response = await axiosClientWithAuth.get("/api/v1/users/profile");
    return response.data.data;
  } catch (error: any) {
    if (error.response && error.response.data && error.response.data.message) {
      throw new Error(error.response.data.message);
    }
    console.error("Get profile service error:", error);
    throw error;
  }
}
