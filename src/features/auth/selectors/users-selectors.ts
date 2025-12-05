/**
 * User Management - Selectors
 * Memoized selectors for user management state
 */

import { RootState } from "@/features/store";
import { createSelector } from "@reduxjs/toolkit";

/**
 * Base selector for user state
 */
const selectUserState = (state: RootState) => state.users;

/**
 * Select all users data
 */
export const selectUsers = createSelector(
  [selectUserState],
  (state) => state.data
);

/**
 * Select user content (array of users)
 */
export const selectUsersContent = createSelector(
  [selectUsers],
  (data) => data?.content || []
);

/**
 * Select user filters
 */
export const selectFilters = createSelector(
  [selectUserState],
  (state) => state.filters
);

/**
 * Select operation states
 */
export const selectOperations = createSelector(
  [selectUserState],
  (state) => state.operations
);

/**
 * Select pagination info
 */
export const selectPagination = createSelector([selectUsers], (data) => ({
  currentPage: data?.pageNo || 1,
  totalPages: data?.totalPages || 1,
  totalElements: data?.totalElements || 0,
  hasNext: data?.hasNext || false,
  hasPrevious: data?.hasPrevious || false,
}));

/**
 * Select loading state
 */
export const selectIsLoading = createSelector(
  [selectUserState],
  (state) => state.isLoading
);

/**
 * Select is creating
 */
export const selectIsCreating = createSelector(
  [selectOperations],
  (ops) => ops.isCreating
);

/**
 * Select is updating
 */
export const selectIsUpdating = createSelector(
  [selectOperations],
  (ops) => ops.isUpdating
);

/**
 * Select is deleting
 */
export const selectIsDeleting = createSelector(
  [selectOperations],
  (ops) => ops.isDeleting
);

/**
 * Select error
 */
export const selectError = createSelector(
  [selectUserState],
  (state) => state.error
);

/**
 * Select if any operation is in progress
 */
export const selectIsOperating = createSelector(
  [selectOperations],
  (ops) => ops.isCreating || ops.isUpdating || ops.isDeleting
);
