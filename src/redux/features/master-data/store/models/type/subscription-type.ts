import {
  AllSubscriptionResponseModel,
  SubscriptionResponseModel,
} from "../response/subscription-response";

export interface SubscriptionFilters {
  search: string;
  pageNo: number;
}

export interface OperationStates {
  isCreating: boolean;
  isUpdating: boolean;
  isDeleting: boolean;
  isFetchingDetail: boolean;
}

export interface SubscriptionManagementState {
  data: AllSubscriptionResponseModel | null;
  selectedSubscription: SubscriptionResponseModel | null;
  isLoading: boolean;
  error: string | null;
  filters: SubscriptionFilters;
  operations: OperationStates;
}
