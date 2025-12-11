import { RootState } from "@/redux/store";
import { createSelector } from "@reduxjs/toolkit";

export const selectSubscriptionState = (state: RootState) => state.subscription;

export const selectSubscription = (state: RootState) => state.subscription.data;

export const selectSelectedSubscription = (state: RootState) =>
  state.subscription.selectedSubscription;

export const selectSubscriptionContent = (state: RootState) =>
  state.subscription.data?.content || [];

export const selectIsLoading = (state: RootState) =>
  state.subscription.isLoading;

export const selectIsFetchingDetail = (state: RootState) =>
  state.subscription.operations.isFetchingDetail;

export const selectError = (state: RootState) => state.subscription.error;

export const selectFilters = (state: RootState) => state.subscription.filters;

export const selectOperations = (state: RootState) =>
  state.subscription.operations;

/**
 * Select pagination metadata
 */
export const selectPagination = createSelector(
  [selectSubscription],
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
