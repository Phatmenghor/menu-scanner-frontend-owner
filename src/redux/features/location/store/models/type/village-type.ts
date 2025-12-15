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
  selectedVillage: VillageResponseModel | null;
  isLoading: boolean;
  error: string | null;
  filters: VillageFilters;
  operations: OperationStates;
}
