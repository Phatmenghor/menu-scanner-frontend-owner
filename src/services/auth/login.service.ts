import { LoginCredentials } from "@/models/auth/auth.request";
import { UserAuthResponse } from "@/models/auth/auth.response";
import { axiosClient } from "@/utils/axios";
import { storeRoles } from "@/utils/local-storage/roles";
import { storeToken } from "@/utils/local-storage/token";
import { storeUserInfo } from "@/utils/local-storage/userInfo";

export async function loginService(credentials: LoginCredentials) {
  try {
    const user = await axiosClient.post("/api/v1/auth/login", credentials);

    const userData = user.data.data as UserAuthResponse;
    // On success, store token and role (simulate your original behavior)
    storeToken(userData.accessToken);
    storeUserInfo({
      userId: userData.userId,
      email: userData.email,
      fullName: userData.fullName,
      businessId: userData.businessId,
      userType: userData.userType,
    });
    storeRoles(userData.roles);

    return userData;
  } catch (error) {
    console.error("Login service error:", error);

    // Re-throw or transform error if needed
    throw {
      errorMessage: "An unexpected error occurred during login.",
      rawError: error,
    };
  }
}
