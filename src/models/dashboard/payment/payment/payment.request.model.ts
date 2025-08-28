export interface CreatePaymentRequest {
  businessId?: string;
  imageUrl?: string;
  subscriptionId?: string;
  status?: string;
  amount: number;
  paymentMethod: string;
  referenceNumber?: string;
  notes?: string;
  paymentType?: string;
}

export interface UpdatePaymentRequest {
  imageUrl?: string;
  amount?: number;
  paymentMethod?: string;
  status?: string;
  referenceNumber?: string;
  notes?: string;
}

export interface AllPaymentRequest {
  search?: string;
  pageNo?: number;
  pageSize?: number;
  sortBy?: string;
  sortDirection?: string;
  paymentMethod?: string;
  status?: string;
  businessId?: string;
  planId?: string;
  createdFrom?: string;
  createdTo?: string;
}
