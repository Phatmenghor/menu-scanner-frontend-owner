export interface AllPayment {
  content: PaymentModel[];
  pageNo: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
  first: boolean;
  hasNext: boolean;
  hasPrevious: boolean;
}

export interface PaymentModel {
  id: string;
  businessId: string;
  businessName: string;
  planId: string;
  planName: string;
  subscriptionId: string;
  subscriptionDisplayName: string;
  amount: number;
  amountKhr: number;
  formattedAmount: string;
  formattedAmountKhr: string;
  paymentMethod: string;
  status: string;
  statusDescription: string;
  referenceNumber: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
}
