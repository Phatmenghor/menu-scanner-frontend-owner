export interface AllSubscriptionPlan {
  content: SubscriptionPlanModel[];
  pageNo: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
  first: boolean;
  hasNext: boolean;
  hasPrevious: boolean;
}

export interface SubscriptionPlanModel {
  id: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
  name: string;
  description: string;
  price: number;
  durationDays: number;
  status: string;
  activeSubscriptionsCount: number;
}
