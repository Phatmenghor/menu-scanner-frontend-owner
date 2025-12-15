import { BusinessFilters } from "@/redux/features/master-data/store/models/type/business-type";
import {
  AllCommuneResponseModel,
  CommuneResponseModel,
} from "../response/commune-response";

export interface CommuneFilters {
  search: string;
  pageNo: number;
}

export interface OperationStates {
  isCreating: boolean;
  isUpdating: boolean;
  isDeleting: boolean;
  isFetchingDetail: boolean;
}

export interface CommuneManagementState {
  data: AllCommuneResponseModel | null;
  selectedCommune: CommuneResponseModel | null;
  isLoading: boolean;
  error: string | null;
  filters: CommuneFilters;
  operations: OperationStates;
}
