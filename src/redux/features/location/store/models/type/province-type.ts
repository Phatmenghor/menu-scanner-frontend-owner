import {
  AllProvinceResponseModel,
  ProvinceResponseModel,
} from "../response/province-response";

export interface ProvinceFilters {
  search: string;
  pageNo: number;
}

export interface OperationStates {
  isCreating: boolean;
  isUpdating: boolean;
  isDeleting: boolean;
  isFetchingDetail: boolean;
}

export interface ProvinceManagementState {
  data: AllProvinceResponseModel | null;
  selectedProvince: ProvinceResponseModel | null;
  isLoading: boolean;
  error: string | null;
  filters: ProvinceFilters;
  operations: OperationStates;
}
