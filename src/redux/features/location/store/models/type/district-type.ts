import {
  AllDistrictResponseModel,
  DistrictResponseModel,
} from "../response/district-response";

export interface DistrictFilters {
  search: string;
  pageNo: number;
}

export interface OperationStates {
  isCreating: boolean;
  isUpdating: boolean;
  isDeleting: boolean;
  isFetchingDetail: boolean;
}

export interface DistrictManagementState {
  data: AllDistrictResponseModel | null;
  selectedDistrict: DistrictResponseModel | null;
  isLoading: boolean;
  error: string | null;
  filters: DistrictFilters;
  operations: OperationStates;
}
