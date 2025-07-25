export interface SearchPaymentRequest {
  businessId: string;
  planId: string;
  paymentMethod: string;
  status: string;
  referenceNumber: string;
  search: string;
  createdFrom: string;
  createdTo: string;
  pageNo: number;
  pageSize: number;
  sortBy: string;
  sortDirection: string;
}

export interface CreatePaymentRequest {
  businessId: string;
  planId: string;
  subscriptionId: string;
  amount: number;
  paymentMethod: string;
  referenceNumber: string;
  notes: string;
  autoComplete: boolean;
}

export interface UpdatePaymentRequest {
  amount: number;
  paymentMethod: string;
  status: string;
  referenceNumber: string;
  notes: string;
}

export interface SearchPaymentBusinessIdRequest {
  businessId: string;
  planId: string;
  paymentMethod: string;
  status: string;
  referenceNumber: string;
  search: string;
  createdFrom: string;
  createdTo: string;
  pageNo: number;
  pageSize: number;
  sortBy: string;
  sortDirection: string;
}
