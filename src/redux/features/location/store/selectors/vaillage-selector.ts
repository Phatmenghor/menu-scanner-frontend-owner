import { RootState } from "@/redux/store";
import { createSelector } from "@reduxjs/toolkit";

export const selectPaymentState = (state: RootState) => state.payment;

export const selectPayment = (state: RootState) => state.payment.data;

export const selectSelectedPayment = (state: RootState) =>
  state.payment.selectedPayment;

export const selectPaymentContent = (state: RootState) =>
  state.payment.data?.content || [];

export const selectIsLoading = (state: RootState) => state.payment.isLoading;

export const selectIsFetchingDetail = (state: RootState) =>
  state.payment.operations.isFetchingDetail;

export const selectError = (state: RootState) => state.payment.error;

export const selectFilters = (state: RootState) => state.payment.filters;

export const selectOperations = (state: RootState) => state.payment.operations;

/**
 * Select pagination metadata
 */
export const selectPagination = createSelector([selectPayment], (data) => ({
  currentPage: data?.pageNo || 1,
  totalPages: data?.totalPages || 1,
  totalElements: data?.totalElements || 0,
  pageSize: data?.pageSize || 10,
  last: data?.last || false,
  first: data?.first || true,
  hasNext: data?.hasNext || false,
  hasPrevious: data?.hasPrevious || false,
}));
