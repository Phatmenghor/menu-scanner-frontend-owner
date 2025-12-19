/**
 * User Request Types
 */

import { BaseGetAllRequest } from "@/utils/common/get-all-request";

/**
 * Create User Request
 */
export interface CreateUserRequest {
  userIdentifier: string;
  email?: string;
  password: string;
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  profileImageUrl?: string;
  userType: string;
  businessId?: string;
  roles: string[];
  position?: string;
  address?: string;
  notes?: string;
  accountStatus?: string;
}

/**
 * Update User Request
 */
export interface UpdateUserRequest {
  id?: string;
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  profileImageUrl?: string;
  accountStatus?: string;
  businessId?: string;
  roles?: string[];
  position?: string;
  address?: string;
  notes?: string;
}

/**
 * Fetch All Users Request
 */
export interface AllUserRequest extends BaseGetAllRequest {
  accountStatus?: string[];
  roles?: string[];
  userTypes?: string[];
}

/**
 * Update User Params (for thunk)
 */
export interface UpdateUserParams {
  userId: string;
  userData: UpdateUserRequest;
}

/**
 * Toggle User Status Request
 */
export interface ToggleUserStatusRequest {
  id: string;
  accountStatus: string;
}

export interface AdminChangePasswordRequest {
  userId: string;
  newPassword: string;
  confirmPassword: string;
}
