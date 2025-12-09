import {
  AllSubscriptionPlanResponseModel,
  SubscriptionPlanResponseModel,
} from "../response/subscription-plan-response";

export interface SubscriptionPlanFilters {
  search: string;
  statuses: string;
  pageNo: number;
}

export interface OperationStates {
  isCreating: boolean;
  isUpdating: boolean;
  isDeleting: boolean;
  isFetchingDetail: boolean;
}

export interface SubscriptionPlanManagementState {
  data: AllSubscriptionPlanResponseModel | null;
  selectedSubscriptionPlan: SubscriptionPlanResponseModel | null;
  isLoading: boolean;
  error: string | null;
  filters: SubscriptionPlanFilters;
  operations: OperationStates;
}
