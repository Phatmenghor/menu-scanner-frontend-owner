import { RootState } from "@/redux/store";
import { createSelector } from "@reduxjs/toolkit";

export const selectVillageState = (state: RootState) => state.village;

export const selectVillage = (state: RootState) => state.village.data;

export const selectSelectedVillage = (state: RootState) =>
  state.village.selectedVillage;

export const selectVillageContent = (state: RootState) =>
  state.village.data?.content || [];

export const selectIsLoading = (state: RootState) => state.village.isLoading;

export const selectIsFetchingDetail = (state: RootState) =>
  state.village.operations.isFetchingDetail;

export const selectError = (state: RootState) => state.village.error;

export const selectFilters = (state: RootState) => state.village.filters;

export const selectOperations = (state: RootState) => state.village.operations;

/**
 * Select pagination metadata
 */
export const selectPagination = createSelector([selectVillage], (data) => ({
  currentPage: data?.pageNo || 1,
  totalPages: data?.totalPages || 1,
  totalElements: data?.totalElements || 0,
  pageSize: data?.pageSize || 10,
  last: data?.last || false,
  first: data?.first || true,
  hasNext: data?.hasNext || false,
  hasPrevious: data?.hasPrevious || false,
}));
