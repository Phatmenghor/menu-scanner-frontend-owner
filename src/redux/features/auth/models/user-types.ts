import { AllUserResponse } from "./response/users-response";

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
  userData: any;
}
