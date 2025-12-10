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

export interface CreatePaymentRequest {
  imageUrl?: string;
  subscriptionId?: string;
  businessId?: string;
  amount: number;
  paymentMethod: string;
  paymentType: string;
  status: string;
  referenceNumber?: string;
  notes?: string;
}

export interface UpdatePaymentRequest {
  imageUrl?: string;
  subscriptionId?: string;
  businessId?: string;
  amount: number;
  paymentMethod: string;
  paymentType: string;
  status: string;
  referenceNumber?: string;
  notes?: string;
}

export interface UpdatePaymentParams {
  paymentId: string;
  paymentData: UpdatePaymentRequest;
}
