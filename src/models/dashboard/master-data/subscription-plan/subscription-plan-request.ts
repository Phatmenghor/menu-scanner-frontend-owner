export interface CreateSubscriptionPlanRequest {
  name: string;
  description?: string;
  price: number;
  durationDays: number;
  status?: string;
}

export interface UpdateSubscriptionPlanRequest {
  name?: string;
  description?: string;
  price?: number;
  durationDays?: number;
  status?: string;
}

export interface AllSubscriptionPlanRequest {
  search?: string;
  status?: string;
  statuses?: string[];
  minPrice?: number;
  maxPrice?: number;
  minDurationDays?: number;
  maxDurationDays?: number;
  publicOnly?: boolean;
  freeOnly?: boolean;
  pageNo?: number;
  pageSize?: number;
  sortBy?: string;
  sortDirection?: string;
}
