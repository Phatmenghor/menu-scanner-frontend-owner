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
  businessId: string;
  businessName: string;
  planId: string;
  planName: string;
  planPrice: number;
  planDurationDays: number;
  startDate: string;
  endDate: string;
  isActive: boolean;
  isExpired: boolean;
  daysRemaining: number;
  autoRenew: boolean;
  notes: string;
  createdAt: string;
  updatedAt: string;
  displayName: string;
  totalPaidAmount: number;
  isFullyPaid: boolean;
  paymentStatusSummary: string;
  totalPaymentsCount: number;
  completedPaymentsCount: number;
  pendingPaymentsCount: number;
}
