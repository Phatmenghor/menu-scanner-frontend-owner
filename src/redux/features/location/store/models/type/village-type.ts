import { BusinessFilters } from "@/redux/features/master-data/store/models/type/business-type";
import {
  AllVillageResponseModel,
  VillageResponseModel,
} from "../response/village-response";

export interface VillageFilters {
  search: string;
  pageNo: number;
}

export interface OperationStates {
  isCreating: boolean;
  isUpdating: boolean;
  isDeleting: boolean;
  isFetchingDetail: boolean;
}

export interface VillageManagementState {
  data: AllVillageResponseModel | null;
  selectedBusiness: VillageResponseModel | null;
  isLoading: boolean;
  error: string | null;
  filters: BusinessFilters;
  operations: OperationStates;
}
