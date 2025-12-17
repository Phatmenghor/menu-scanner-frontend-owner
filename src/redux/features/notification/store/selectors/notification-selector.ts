import { RootState } from "@/redux/store";
import { createSelector } from "@reduxjs/toolkit";

export const selectNotificationState = (state: RootState) => state.notification;

export const selectNotification = (state: RootState) => state.notification.data;

export const selectSelectedNotification = (state: RootState) =>
  state.notification.selectedNotification;

export const selectNotificationContent = (state: RootState) =>
  state.notification.data?.content || [];

export const selectIsLoading = (state: RootState) =>
  state.notification.isLoading;

export const selectIsFetchingDetail = (state: RootState) =>
  state.notification.operations.isFetchingDetail;

export const selectUnReadCount = (state: RootState) =>
  state.notification.unReadCount;

export const selectUnSeenCount = (state: RootState) =>
  state.notification.unSeenCount;

export const selectError = (state: RootState) => state.notification.error;

export const selectFilters = (state: RootState) => state.notification.filters;

export const selectOperations = (state: RootState) =>
  state.notification.operations;

/**
 * Select pagination metadata
 */
export const selectPagination = createSelector(
  [selectNotification],
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
