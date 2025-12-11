import { Pagination } from "@/utils/common/pagination";

export interface AllSubscriptionResponseModel extends Pagination {
  content: SubscriptionResponseModel[];
}

export interface SubscriptionResponseModel {
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
  status: string;
  paymentStatus: string;
  paymentAmount: number;
}
