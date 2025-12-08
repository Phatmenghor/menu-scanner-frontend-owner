import {
  AllExchangeRateResponseModel,
  ExchangeRateResponseModel,
} from "../response/exchange-rate-response";

export interface ExchangeRateFilters {
  search: string;
  isActive: string;
  pageNo: number;
}

export interface OperationStates {
  isCreating: boolean;
  isUpdating: boolean;
  isDeleting: boolean;
  isFetchingDetail: boolean;
}

export interface ExchangeRateManagementState {
  data: AllExchangeRateResponseModel | null;
  selectedExchangeRate: ExchangeRateResponseModel | null;
  isLoading: boolean;
  error: string | null;
  filters: ExchangeRateFilters;
  operations: OperationStates;
}
