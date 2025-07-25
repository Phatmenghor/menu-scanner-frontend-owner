export interface CreateSubscriptionRequest {
  businessId: string;
  planId: string;
  startDate: string;
  autoRenew: boolean;
  notes: string;
}

export interface UpdateSubscriptionRequest {
  planId: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
  autoRenew: boolean;
  notes: string;
}

export interface RenewSubscriptionRequest {
  newPlanId: string;
  customDurationDays: number;
  notes: string;
}

export interface CancelSubscriptionRequest {
  reason: string;
  notes: string;
}

export interface AllSubscriptionRequest {
  search: string;
  businessId: string;
  planId: string;
  businessIds: string[];
  planIds: string[];
  isActive: boolean;
  autoRenew: boolean;
  startDate: string;
  toDate: string;
  expiringSoon: boolean;
  expiringSoonDays: number;
  pageNo: number;
  pageSize: number;
  sortBy: string;
  sortDirection: string;
}
