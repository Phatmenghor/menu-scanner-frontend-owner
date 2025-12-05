/**
 * Auth Feature - State Types Only
 * Local state and UI types for auth feature
 */

import { UserAuthResponseModel, ProfileResponseModel } from "../models/auth-models";

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

/**
 * User Management State Types
 */
import {
  AllUserResponse,
  UserModel,
} from "@/models/dashboard/user/plateform-user/user.response";
import {
  CreateUserRequest,
  UpdateUserRequest,
  AllUserRequest,
} from "@/models/dashboard/user/plateform-user/user.request";
import { AccountStatus, UserRole } from "@/constants/AppResource/status/status";

// Re-export dashboard user models
export type {
  AllUserResponse,
  UserModel,
  CreateUserRequest,
  UpdateUserRequest,
  AllUserRequest,
};

export interface UserFilters {
  search: string;
  accountStatus: AccountStatus;
  role: UserRole;
  pageNo: number;
}

export interface OperationStates {
  isCreating: boolean;
  isUpdating: boolean;
  isDeleting: boolean;
}

export interface UserManagementState {
  data: AllUserResponse | null;
  isLoading: boolean;
  error: string | null;
  filters: UserFilters;
  operations: OperationStates;
}

export interface UpdateUserParams {
  userId: string;
  userData: UpdateUserRequest;
}

// User type aliases
export type PlatformUser = UserModel;
export type BusinessUser = UserModel;
export type BusinessOwner = UserModel;
