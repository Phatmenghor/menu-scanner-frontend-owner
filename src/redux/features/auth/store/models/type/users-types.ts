import {
  AllUserResponseModel,
  UserResponseModel,
} from "../response/users-response";

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
  isFetchingDetail: boolean;
}

export interface UserManagementState {
  data: AllUserResponseModel | null;
  selectedUser: UserResponseModel | null;
  isLoading: boolean;
  error: string | null;
  filters: UserFilters;
  operations: OperationStates;
}
