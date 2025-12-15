import { RootState } from "@/redux/store";
import { createSelector } from "@reduxjs/toolkit";

export const selectDistrictState = (state: RootState) => state.district;

export const selectDistrict = (state: RootState) => state.district.data;

export const selectSelectedDistrict = (state: RootState) =>
  state.district.selectedDistrict;

export const selectDistrictContent = (state: RootState) =>
  state.district.data?.content || [];

export const selectIsLoading = (state: RootState) => state.district.isLoading;

export const selectIsFetchingDetail = (state: RootState) =>
  state.district.operations.isFetchingDetail;

export const selectError = (state: RootState) => state.district.error;

export const selectFilters = (state: RootState) => state.district.filters;

export const selectOperations = (state: RootState) => state.district.operations;

/**
 * Select pagination metadata
 */
export const selectPagination = createSelector([selectDistrict], (data) => ({
  currentPage: data?.pageNo || 1,
  totalPages: data?.totalPages || 1,
  totalElements: data?.totalElements || 0,
  pageSize: data?.pageSize || 10,
  last: data?.last || false,
  first: data?.first || true,
  hasNext: data?.hasNext || false,
  hasPrevious: data?.hasPrevious || false,
}));
