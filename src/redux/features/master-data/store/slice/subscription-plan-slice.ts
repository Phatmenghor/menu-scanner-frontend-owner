/**
 * SubscriptionPlan Management - Redux Slice
 * Manages SubscriptionPlan state: data, loading, errors, filters, operations
 */

import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { SubscriptionPlanStatus } from "@/constants/app-resource/status/status";
import { SubscriptionPlanManagementState } from "../models/type/subscription-plan-type";
import {
  createSubscriptionPlanService,
  deleteSubscriptionPlanService,
  fetchAllSubscriptionPlanService,
  fetchSubscriptionPlanByIdService,
  updateSubscriptionPlanService,
} from "../thunks/subscription-plan-thunks";

/**
 * Initial state
 */
const initialState: SubscriptionPlanManagementState = {
  data: null,
  selectedSubscriptionPlan: null,
  isLoading: true,
  error: null,
  filters: {
    search: "",
    statuses: SubscriptionPlanStatus.ALL,
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
 * Users slice
 */
const subscriptionPlanSlice = createSlice({
  name: "subscription-plans",
  initialState,
  reducers: {
    // Filter actions
    setSearchFilter: (state, action: PayloadAction<string>) => {
      state.filters.search = action.payload;
      state.filters.pageNo = 1;
    },

    setSubscriptionPlanStatusFilter: (
      state,
      action: PayloadAction<SubscriptionPlanStatus>
    ) => {
      state.filters.statuses = action.payload;
      state.filters.pageNo = 1;
    },

    setPageNo: (state, action: PayloadAction<number>) => {
      state.filters.pageNo = action.payload;
    },

    // Utility actions
    clearError: (state) => {
      state.error = null;
    },

    clearSelectedSubscriptionPlan: (state) => {
      state.selectedSubscriptionPlan = null;
    },

    resetFilters: (state) => {
      state.filters = initialState.filters;
    },

    resetState: () => {
      return initialState;
    },
  },

  extraReducers: (builder) => {
    // Fetch SubscriptionPlan handlers - ONLY affects list loading
    builder
      .addCase(fetchAllSubscriptionPlanService.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchAllSubscriptionPlanService.fulfilled, (state, action) => {
        state.isLoading = false;
        state.data = action.payload;
      })
      .addCase(fetchAllSubscriptionPlanService.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Fetch SubscriptionPlan by ID handlers - USE SEPARATE LOADING STATE
    builder
      .addCase(fetchSubscriptionPlanByIdService.pending, (state) => {
        state.operations.isFetchingDetail = true;
        state.error = null;
        state.selectedSubscriptionPlan = null;
      })
      .addCase(fetchSubscriptionPlanByIdService.fulfilled, (state, action) => {
        state.operations.isFetchingDetail = false;
        state.selectedSubscriptionPlan = action.payload;

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
      .addCase(fetchSubscriptionPlanByIdService.rejected, (state, action) => {
        state.operations.isFetchingDetail = false;
        state.error = action.payload as string;
      });

    // Create SubscriptionPlan handlers
    builder
      .addCase(createSubscriptionPlanService.pending, (state) => {
        state.operations.isCreating = true;
        state.error = null;
      })
      .addCase(createSubscriptionPlanService.fulfilled, (state, action) => {
        state.operations.isCreating = false;
        if (state.data) {
          state.data.content = [action.payload, ...state.data.content];
          state.data.totalElements += 1;
          state.data.totalPages = Math.ceil(
            state.data.totalElements / state.data.pageSize
          );
        }
      })
      .addCase(createSubscriptionPlanService.rejected, (state, action) => {
        state.operations.isCreating = false;
        state.error = action.payload as string;
      });

    // Update SubscriptionPlan handlers
    builder
      .addCase(updateSubscriptionPlanService.pending, (state) => {
        state.operations.isUpdating = true;
        state.error = null;
      })
      .addCase(updateSubscriptionPlanService.fulfilled, (state, action) => {
        state.operations.isUpdating = false;
        state.selectedSubscriptionPlan = action.payload;

        // Update in list
        if (state.data) {
          state.data.content = state.data.content.map((user) =>
            user.id === action.payload.id ? action.payload : user
          );
        }
      })
      .addCase(updateSubscriptionPlanService.rejected, (state, action) => {
        state.operations.isUpdating = false;
        state.error = action.payload as string;
      });

    // Delete SubscriptionPlan handlers
    builder
      .addCase(deleteSubscriptionPlanService.pending, (state) => {
        state.operations.isDeleting = true;
        state.error = null;
      })
      .addCase(deleteSubscriptionPlanService.fulfilled, (state, action) => {
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
      .addCase(deleteSubscriptionPlanService.rejected, (state, action) => {
        state.operations.isDeleting = false;
        state.error = action.payload as string;
      });
  },
});

export const {
  setSearchFilter,
  setSubscriptionPlanStatusFilter,
  setPageNo,
  clearError,
  clearSelectedSubscriptionPlan,
  resetFilters,
  resetState,
} = subscriptionPlanSlice.actions;

export default subscriptionPlanSlice.reducer;
