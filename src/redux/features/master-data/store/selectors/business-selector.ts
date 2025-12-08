/**
 * Business Management - Selectors
 * Memoized selectors for Business management state
 */

import { RootState } from "@/redux/store";
import { createSelector } from "@reduxjs/toolkit";

/**
 * Base selector for business state
 */
const selectBusinessState = (state: RootState) => state.business;

/**
 * Select all business data
 */
export const selectBusiness = createSelector(
  [selectBusinessState],
  (state) => state.data
);

/**
 * Select business content (array of business)
 */
export const selectBusinessContent = createSelector(
  [selectBusiness],
  (data) => data?.content || []
);

/**
 * Select business filters
 */
export const selectFilters = createSelector(
  [selectBusinessState],
  (state) => state.filters
);

/**
 * Select operation states
 */
export const selectOperations = createSelector(
  [selectBusinessState],
  (state) => state.operations
);

/**
 * Select pagination info
 */
export const selectPagination = createSelector(
  [selectBusinessState, selectBusiness],
  (state, data) => ({
    currentPage: state.filters.pageNo || 1,
    totalPages: data?.totalPages || 1,
    totalElements: data?.totalElements || 0,
    hasNext: data?.hasNext || false,
    hasPrevious: data?.hasPrevious || false,
  })
);

/**
 * Select loading state
 */
export const selectIsLoading = createSelector(
  [selectBusinessState],
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
  [selectBusinessState],
  (state) => state.error
);

/**
 * Select if any operation is in progress
 */
export const selectIsOperating = createSelector(
  [selectOperations],
  (ops) => ops.isCreating || ops.isUpdating || ops.isDeleting
);
