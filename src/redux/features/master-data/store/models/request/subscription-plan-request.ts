export interface AllSubscriptionPlanRequest {
  search?: string;
  pageNo?: number;
  pageSize?: number;
  sortBy?: string;
  sortDirection?: string;
  statuses?: string[];
}

export interface CreateSubscriptionPlanRequest {
  name: string;
  description?: string;
  price: number;
  durationDays: number;
  status: string;
}

export interface UpdateSubscriptionPlanRequest {
  name: string;
  description?: string;
  price: number;
  durationDays: number;
  status: string;
}

export interface UpdateSubscriptionPlanParams {
  subscriptionPlanId: string;
  subscriptionPlanData: UpdateSubscriptionPlanRequest;
}
