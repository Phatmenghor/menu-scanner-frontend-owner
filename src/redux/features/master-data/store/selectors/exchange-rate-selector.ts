import { RootState } from "@/redux/store";
import { createSelector } from "@reduxjs/toolkit";

export const selectExchangeRateState = (state: RootState) => state.exchangeRate;

export const selectExchangeRate = (state: RootState) => state.exchangeRate.data;

export const selectSelectedExchangeRate = (state: RootState) =>
  state.exchangeRate.selectedExchangeRate;

export const selectExchangeRateContent = (state: RootState) =>
  state.exchangeRate.data?.content || [];

export const selectIsLoading = (state: RootState) =>
  state.exchangeRate.isLoading;

export const selectIsFetchingDetail = (state: RootState) =>
  state.exchangeRate.operations.isFetchingDetail;

export const selectError = (state: RootState) => state.exchangeRate.error;

export const selectFilters = (state: RootState) => state.exchangeRate.filters;

export const selectOperations = (state: RootState) =>
  state.exchangeRate.operations;

/**
 * Select pagination metadata
 */
export const selectPagination = createSelector(
  [selectExchangeRate],
  (data) => ({
    currentPage: data?.pageNo || 1,
    totalPages: data?.totalPages || 1,
    totalElements: data?.totalElements || 0,
    pageSize: data?.pageSize || 10,
    last: data?.last || false,
    first: data?.first || true,
    hasNext: data?.hasNext || false,
    hasPrevious: data?.hasPrevious || false,
  })
);
