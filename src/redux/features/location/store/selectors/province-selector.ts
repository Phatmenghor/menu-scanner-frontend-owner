import { RootState } from "@/redux/store";
import { createSelector } from "@reduxjs/toolkit";

export const selectProvinceState = (state: RootState) => state.province;

export const selectProvince = (state: RootState) => state.province.data;

export const selectSelectedProvince = (state: RootState) =>
  state.province.selectedProvince;

export const selectProvinceContent = (state: RootState) =>
  state.province.data?.content || [];

export const selectIsLoading = (state: RootState) => state.province.isLoading;

export const selectIsFetchingDetail = (state: RootState) =>
  state.province.operations.isFetchingDetail;

export const selectError = (state: RootState) => state.province.error;

export const selectFilters = (state: RootState) => state.province.filters;

export const selectOperations = (state: RootState) => state.province.operations;

/**
 * Select pagination metadata
 */
export const selectPagination = createSelector([selectProvince], (data) => ({
  currentPage: data?.pageNo || 1,
  totalPages: data?.totalPages || 1,
  totalElements: data?.totalElements || 0,
  pageSize: data?.pageSize || 10,
  last: data?.last || false,
  first: data?.first || true,
  hasNext: data?.hasNext || false,
  hasPrevious: data?.hasPrevious || false,
}));
