import { RootState } from "@/redux/store";
import { createSelector } from "@reduxjs/toolkit";

export const selectBusinessOwnerState = (state: RootState) =>
  state.businessOwner;

export const selectBusinessOwner = (state: RootState) =>
  state.businessOwner.data;

export const selectSelectedBusinessOwner = (state: RootState) =>
  state.businessOwner.selectedUser;

export const selectBusinessOwnerContent = (state: RootState) =>
  state.businessOwner.data?.content || [];

export const selectIsLoading = (state: RootState) =>
  state.businessOwner.isLoading;

export const selectIsFetchingDetail = (state: RootState) =>
  state.businessOwner.operations.isFetchingDetail;

export const selectError = (state: RootState) => state.businessOwner.error;

export const selectFilters = (state: RootState) => state.businessOwner.filters;

export const selectOperations = (state: RootState) =>
  state.businessOwner.operations;

/**
 * Select pagination metadata
 */
export const selectPagination = createSelector(
  [selectBusinessOwner],
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
