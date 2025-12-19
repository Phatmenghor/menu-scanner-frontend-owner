import {
  AllBusinessOwnerResponseModel,
  BusinessOwnerResponseModel,
} from "../response/business-owner-response";

export interface BusinessOwnerFilters {
  search: string;
  subscriptionStatus: string;
  pageNo: number;
}

export interface OperationStates {
  isCreating: boolean;
  isUpdating: boolean;
  isDeleting: boolean;
  isFetchingDetail: boolean;
}

export interface BusinessOwnerManagementState {
  data: AllBusinessOwnerResponseModel | null;
  selectedUser: BusinessOwnerResponseModel | null;
  isLoading: boolean;
  error: string | null;
  filters: BusinessOwnerFilters;
  operations: OperationStates;
}
