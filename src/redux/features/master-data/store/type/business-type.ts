import { AllBusinessResponseModel } from "../models/response/business-response";

export interface BusinessFilters {
  search: string;
  businessStatus: string;
  pageNo: number;
}

export interface OperationStates {
  isCreating: boolean;
  isUpdating: boolean;
  isDeleting: boolean;
}

export interface BusinessManagementState {
  data: AllBusinessResponseModel | null;
  isLoading: boolean;
  error: string | null;
  filters: BusinessFilters;
  operations: OperationStates;
}
