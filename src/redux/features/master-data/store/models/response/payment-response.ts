import { Pagination } from "@/utils/common/pagination";

export interface AllPaymentResponseModel extends Pagination {
  content: PaymentResponseModel[];
}

export interface PaymentResponseModel {
  id: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
  imageUrl: string;
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
}
