import { RootState } from "@/redux/store";
import { createSelector } from "@reduxjs/toolkit";

export const selectSubscriptionPlanState = (state: RootState) =>
  state.subscriptionPlan;

export const selectSubscriptionPlan = (state: RootState) =>
  state.subscriptionPlan.data;

export const selectSelectedSubscriptionPlan = (state: RootState) =>
  state.subscriptionPlan.selectedSubscriptionPlan;

export const selectSubscriptionPlanContent = (state: RootState) =>
  state.subscriptionPlan.data?.content || [];
selectSubscriptionPlanState;

export const selectIsLoading = (state: RootState) =>
  state.subscriptionPlan.isLoading;

export const selectIsFetchingDetail = (state: RootState) =>
  state.subscriptionPlan.operations.isFetchingDetail;

export const selectError = (state: RootState) => state.subscriptionPlan.error;

export const selectFilters = (state: RootState) =>
  state.subscriptionPlan.filters;

export const selectOperations = (state: RootState) =>
  state.subscriptionPlan.operations;

/**
 * Select pagination metadata
 */
export const selectPagination = createSelector(
  [selectSubscriptionPlan],
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
