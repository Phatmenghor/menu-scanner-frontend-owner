import {
  AllBusinessResponseModel,
  BusinessResponseModel,
} from "../response/business-response";

export interface BusinessFilters {
  search: string;
  businessStatus: string;
  hasActiveSubscription: string;
  pageNo: number;
}

export interface OperationStates {
  isCreating: boolean;
  isUpdating: boolean;
  isDeleting: boolean;
  isFetchingDetail: boolean;
}

export interface BusinessManagementState {
  data: AllBusinessResponseModel | null;
  selectedBusiness: BusinessResponseModel | null;
  isLoading: boolean;
  error: string | null;
  filters: BusinessFilters;
  operations: OperationStates;
}
