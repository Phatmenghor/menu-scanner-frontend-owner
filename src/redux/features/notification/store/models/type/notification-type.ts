import {
  AllNotificationResponseModel,
  NotificationResponseModel,
} from "../response/notification-response";

export interface NotificationFilters {
  search: string;
  pageNo: number;
}

export interface OperationStates {
  isCreating: boolean;
  isUpdating: boolean;
  isDeleting: boolean;
  isFetchingDetail: boolean;
}

export interface NotificationManagementState {
  data: AllNotificationResponseModel | null;
  selectedNotification: NotificationResponseModel | null;
  unReadCount: Number;
  unSeenCount: Number;
  isLoading: boolean;
  error: string | null;
  filters: NotificationFilters;
  operations: OperationStates;
}
