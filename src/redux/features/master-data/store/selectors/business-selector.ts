import { RootState } from "@/redux/store";
import { createSelector } from "@reduxjs/toolkit";

export const selectBusinessState = (state: RootState) => state.business;

export const selectBusiness = (state: RootState) => state.business.data;

export const selectSelectedBusiness = (state: RootState) =>
  state.business.selectedBusiness;

export const selectBusinessContent = (state: RootState) =>
  state.business.data?.content || [];

export const selectIsLoading = (state: RootState) => state.business.isLoading;

export const selectIsFetchingDetail = (state: RootState) =>
  state.business.operations.isFetchingDetail;

export const selectError = (state: RootState) => state.business.error;

export const selectFilters = (state: RootState) => state.business.filters;

export const selectOperations = (state: RootState) => state.business.operations;

/**
 * Select pagination metadata
 */
export const selectPagination = createSelector([selectBusiness], (data) => ({
  currentPage: data?.pageNo || 1,
  totalPages: data?.totalPages || 1,
  totalElements: data?.totalElements || 0,
  pageSize: data?.pageSize || 10,
  last: data?.last || false,
  first: data?.first || true,
  hasNext: data?.hasNext || false,
  hasPrevious: data?.hasPrevious || false,
}));
