import { BusinessFilters } from "@/redux/features/master-data/store/models/type/business-type";
import {
  AllCommuneResponseModel,
  CommuneResponseModel,
} from "../response/commune-response";
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
  selectedBusiness: ProvinceResponseModel | null;
  isLoading: boolean;
  error: string | null;
  filters: BusinessFilters;
  operations: OperationStates;
}
