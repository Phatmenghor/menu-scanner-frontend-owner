import { GetAllRequest } from "@/utils/common/get-all-request";

export interface AllSubscriptionRequest extends GetAllRequest {
  businessId?: string;
  planId?: string;
  autoRenew?: boolean;
  startDate?: string;
  toDate?: string;
  status?: string;
  expiringSoonDays?: number;
}

export interface CreateSubscriptionRequest {
  businessId: string;
  planId: string;
  startDate: string;
  autoRenew: boolean;
}

export interface UpdateSubscriptionRequest {
  planId: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
  autoRenew: boolean;
}

export interface UpdateSubscriptionParams {
  SubscriptionId: string;
  SubscriptionsData: UpdateSubscriptionRequest;
}
