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
  name: string;
  description: string;
  price: number;
  durationDays: number;
  status: string;
  pricingDisplay: string;
  isFree: boolean;
  isPublic: boolean;
  isPrivate: boolean;
  activeSubscriptionsCount: number;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
}
