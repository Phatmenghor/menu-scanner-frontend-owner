/**
 * Subscription Management - Redux Slice
 * Manages subscription state: data, loading, errors, filters, operations
 */

import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  BusinessStatus,
  SubscriptionStatus,
} from "@/constants/app-resource/status/status";
import { SubscriptionManagementState } from "../models/type/subscription-type";
import {
  createSubscriptionService,
  deleteSubscriptionService,
  fetchAllSubscriptionService,
  fetchSubscriptionByIdService,
  updateSubscriptionService,
} from "../thunks/subscription-thunks";

/**
 * Initial state
 */
const initialState: SubscriptionManagementState = {
  data: null,
  selectedSubscription: null,
  isLoading: true,
  error: null,
  filters: {
    search: "",
    pageNo: 1,
  },
  operations: {
    isCreating: false,
    isUpdating: false,
    isDeleting: false,
    isFetchingDetail: false,
  },
};

/**
 * Subscription slice
 */
const subscriptionSlice = createSlice({
  name: "subscriptions",
  initialState,
  reducers: {
    // Filter actions
    setSearchFilter: (state, action: PayloadAction<string>) => {
      state.filters.search = action.payload;
      state.filters.pageNo = 1;
    },

    setPageNo: (state, action: PayloadAction<number>) => {
      state.filters.pageNo = action.payload;
    },

    // Utility actions
    clearError: (state) => {
      state.error = null;
    },

    clearSelectedSubscription: (state) => {
      state.selectedSubscription = null;
    },

    resetFilters: (state) => {
      state.filters = initialState.filters;
    },

    resetState: () => {
      return initialState;
    },
  },

  extraReducers: (builder) => {
    // Fetch Subscription handlers - ONLY affects list loading
    builder
      .addCase(fetchAllSubscriptionService.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchAllSubscriptionService.fulfilled, (state, action) => {
        state.isLoading = false;
        state.data = action.payload;
      })
      .addCase(fetchAllSubscriptionService.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Fetch Subscription by ID handlers - USE SEPARATE LOADING STATE
    builder
      .addCase(fetchSubscriptionByIdService.pending, (state) => {
        state.operations.isFetchingDetail = true;
        state.error = null;
        state.selectedSubscription = null;
      })
      .addCase(fetchSubscriptionByIdService.fulfilled, (state, action) => {
        state.operations.isFetchingDetail = false;
        state.selectedSubscription = action.payload;

        // Also update in list if exists (for consistency)
        if (state.data?.content) {
          const index = state.data.content.findIndex(
            (user) => user.id === action.payload.id
          );
          if (index !== -1) {
            state.data.content[index] = action.payload;
          }
        }
      })
      .addCase(fetchSubscriptionByIdService.rejected, (state, action) => {
        state.operations.isFetchingDetail = false;
        state.error = action.payload as string;
      });

    // Create Subscription handlers
    builder
      .addCase(createSubscriptionService.pending, (state) => {
        state.operations.isCreating = true;
        state.error = null;
      })
      .addCase(createSubscriptionService.fulfilled, (state, action) => {
        state.operations.isCreating = false;
        if (state.data) {
          state.data.content = [action.payload, ...state.data.content];
          state.data.totalElements += 1;
          state.data.totalPages = Math.ceil(
            state.data.totalElements / state.data.pageSize
          );
        }
      })
      .addCase(createSubscriptionService.rejected, (state, action) => {
        state.operations.isCreating = false;
        state.error = action.payload as string;
      });

    // Update Subscription handlers
    builder
      .addCase(updateSubscriptionService.pending, (state) => {
        state.operations.isUpdating = true;
        state.error = null;
      })
      .addCase(updateSubscriptionService.fulfilled, (state, action) => {
        state.operations.isUpdating = false;
        state.selectedSubscription = action.payload;

        // Update in list
        if (state.data) {
          state.data.content = state.data.content.map((user) =>
            user.id === action.payload.id ? action.payload : user
          );
        }
      })
      .addCase(updateSubscriptionService.rejected, (state, action) => {
        state.operations.isUpdating = false;
        state.error = action.payload as string;
      });

    // Delete Subscription handlers
    builder
      .addCase(deleteSubscriptionService.pending, (state) => {
        state.operations.isDeleting = true;
        state.error = null;
      })
      .addCase(deleteSubscriptionService.fulfilled, (state, action) => {
        state.operations.isDeleting = false;
        if (state.data) {
          state.data.content = state.data.content.filter(
            (user) => user.id !== action.payload
          );
          state.data.totalElements -= 1;
          state.data.totalPages = Math.ceil(
            state.data.totalElements / state.data.pageSize
          );
          state.data.last = state.data.pageNo >= state.data.totalPages;
          state.data.hasNext = !state.data.last;
          state.data.hasPrevious = state.data.pageNo > 1;
        }
      })
      .addCase(deleteSubscriptionService.rejected, (state, action) => {
        state.operations.isDeleting = false;
        state.error = action.payload as string;
      });
  },
});

export const {
  setSearchFilter,
  setPageNo,
  clearError,
  resetFilters,
  resetState,
  clearSelectedSubscription,
} = subscriptionSlice.actions;

export default subscriptionSlice.reducer;
