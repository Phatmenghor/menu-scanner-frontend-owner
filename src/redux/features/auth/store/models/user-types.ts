import { AllUserResponseModel } from "./response/users-response";

export interface UserFilters {
  search: string;
  accountStatus: string;
  role: string;
  pageNo: number;
}

export interface OperationStates {
  isCreating: boolean;
  isUpdating: boolean;
  isDeleting: boolean;
  isResettingPassword: boolean;
}

export interface UserManagementState {
  data: AllUserResponseModel | null;
  isLoading: boolean;
  error: string | null;
  filters: UserFilters;
  operations: OperationStates;
}
