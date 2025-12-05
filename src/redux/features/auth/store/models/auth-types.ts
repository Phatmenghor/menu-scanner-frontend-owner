/**
 * Auth Feature - State Types Only
 * Local state and UI types for auth feature
 */

import { UserAuthResponseModel, ProfileResponseModel } from "./auth-models";

/**
 * Auth Redux State
 */
export interface AuthState {
  isAuthenticated: boolean;
  user: UserAuthResponseModel | null;
  profile: ProfileResponseModel | null;
  isLoading: boolean;
  isProfileLoading: boolean;
  error: string | null;
}
