/**
 * Auth State Types
 */

import { UserAuthResponseModel } from "../response/auth-resposne";
import { UserResponseModel } from "../response/users-response";

/**
 * Auth State Interface
 */
export interface AuthState {
  isAuthenticated: boolean;
  user: UserAuthResponseModel | null;
  profile: UserResponseModel | null;
  isLoading: boolean;
  isProfileLoading: boolean;
  error: string | null;
}
