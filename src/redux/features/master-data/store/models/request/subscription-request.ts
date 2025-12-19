import { BaseGetAllRequest } from "@/utils/common/get-all-request";

export interface AllSubscriptionRequest extends BaseGetAllRequest {
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
  autoRenew: boolean;
}

export interface UpdateSubscriptionParams {
  subscriptionId: string;
  subscriptionsData: UpdateSubscriptionRequest;
}
