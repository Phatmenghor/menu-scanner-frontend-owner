import { RootState } from "@/store";
import { createSelector } from "@reduxjs/toolkit";

// Base selector
export const selectUserState = (state: RootState) => state.users;

// Memoized selectors
export const selectUsers = createSelector(
  [selectUserState],
  (state) => state.data
);

export const selectUsersContent = createSelector(
  [selectUsers],
  (data) => data?.content || []
);

export const selectFilters = createSelector(
  [selectUserState],
  (state) => state.filters
);

export const selectOperations = createSelector(
  [selectUserState],
  (state) => state.operations
);

export const selectPagination = createSelector([selectUsers], (data) => ({
  currentPage: data?.pageNo || 1,
  totalPages: data?.totalPages || 1,
  totalElements: data?.totalElements || 0,
  hasNext: data?.hasNext || false,
  hasPrevious: data?.hasPrevious || false,
}));
