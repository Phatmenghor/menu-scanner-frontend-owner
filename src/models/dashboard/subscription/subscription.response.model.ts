export interface AllSubscriptionResponse {
  content: SubscriptionModel[];
  pageNo: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
  first: boolean;
  hasNext: boolean;
  hasPrevious: boolean;
}

export interface SubscriptionModel {
  id: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
  businessId: string;
  businessName: string;
  planId: string;
  planName: string;
  planPrice: number;
  planDurationDays: number;
  startDate: string;
  endDate: string;
  daysRemaining: number;
  autoRenew: boolean;
}
