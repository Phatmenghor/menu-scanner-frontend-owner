import {
  AllPaymentResponseModel,
  PaymentResponseModel,
} from "../response/payment-response";

export interface PaymentFilters {
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

export interface OperationStates {
  isCreating: boolean;
  isUpdating: boolean;
  isDeleting: boolean;
  isFetchingDetail: boolean;
}

export interface PaymentManagementState {
  data: AllPaymentResponseModel | null;
  selectedPayment: PaymentResponseModel | null;
  isLoading: boolean;
  error: string | null;
  filters: PaymentFilters;
  operations: OperationStates;
}
