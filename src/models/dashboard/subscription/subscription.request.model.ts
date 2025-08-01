export interface CreateSubscriptionRequest {
  businessId: string;
  planId: string;
  startDate?: string;
  autoRenew?: boolean;
  notes?: string;
}

export interface UpdateSubscriptionRequest {
  planId?: string;
  startDate?: string;
  endDate?: string;
  isActive?: boolean;
  autoRenew?: boolean;
  notes?: string;
}

export interface RenewSubscriptionRequest {
  newPlanId?: string;
  customDurationDays?: number;
  createPayment?: boolean;
  paymentImageUrl?: string;
  paymentAmount?: number;
  paymentMethod?: string;
  paymentStatus?: string;
  paymentReferenceNumber?: string;
  paymentNotes?: string;
}

export interface CancelSubscriptionRequest {
  reason?: string | null;
  notes?: string | null;
  refundAmount?: number | null;
  refundNotes?: string | null;
}

export interface AllSubscriptionRequest {
  search?: string;
  businessId?: string;
  planId?: string;
  businessIds?: string[];
  planIds?: string[];
  isActive?: boolean;
  autoRenew?: boolean;
  startDate?: string;
  toDate?: string;
  expiringSoon?: boolean;
  expiringSoonDays?: number;
  pageNo?: number;
  pageSize?: number;
  sortBy?: string;
  sortDirection?: string;
}
