import { RootState } from "@/redux/store";
import { createSelector } from "@reduxjs/toolkit";

export const selectUsersState = (state: RootState) => state.users;

export const selectUsers = (state: RootState) => state.users.data;

export const selectSelectedUser = (state: RootState) =>
  state.users.selectedUser;

export const selectUsersContent = (state: RootState) =>
  state.users.data?.content || [];

export const selectIsLoading = (state: RootState) => state.users.isLoading;

export const selectIsFetchingDetail = (state: RootState) =>
  state.users.operations.isFetchingDetail;

export const selectError = (state: RootState) => state.users.error;

export const selectFilters = (state: RootState) => state.users.filters;

export const selectOperations = (state: RootState) => state.users.operations;

export const selectIsResettingPassword = (state: RootState) =>
  state.users.operations.isResettingPassword;

/**
 * Select pagination metadata
 */
export const selectPagination = createSelector([selectUsers], (data) => ({
  currentPage: data?.pageNo || 1,
  totalPages: data?.totalPages || 1,
  totalElements: data?.totalElements || 0,
  pageSize: data?.pageSize || 10,
  last: data?.last || false,
  first: data?.first || true,
  hasNext: data?.hasNext || false,
  hasPrevious: data?.hasPrevious || false,
}));
