import {
  AllUserResponse,
  UserModel,
} from "@/models/dashboard/user/plateform-user/user.response";
import {
  CreateUserRequest,
  UpdateUserRequest,
} from "@/models/dashboard/user/plateform-user/user.request";
import { AccountStatus, UserRole } from "@/constants/AppResource/status/status";

// State type
export interface BusinessState {
  data: AllUserResponse | null;
  isLoading: boolean;
  error: string | null;
  filters: UserFilters;
  operations: OperationStates;
}

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

export interface UpdateUserParams {
  userId: string;
  userData: UpdateUserRequest;
}

// Re-export for convenience
export type { UserModel, CreateUserRequest, UpdateUserRequest };
