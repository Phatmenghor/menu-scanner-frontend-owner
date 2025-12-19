/**
 * Businses Owner Management - Redux Slice
 * Manages Businses Owner state: data, loading, errors, filters, operations
 */

import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { SubscriptionStatus } from "@/constants/app-resource/status/status";
import { BusinessOwnerManagementState } from "../models/type/business-owner-types";
import {
  createBusinessOwnerService,
  deleteBusinessOwnerService,
  fetchAllBusinessOwnerService,
  fetchBusinessOwnerByIdService,
  updateBusinessOwnerCancelService,
  updateBusinessOwnerChangePlanService,
  updateBusinessOwnerRenewService,
} from "../thunks/business-owner-thunks";

/**
 * Initial state
 */
const initialState: BusinessOwnerManagementState = {
  data: null,
  selectedUser: null,
  isLoading: true,
  error: null,
  filters: {
    search: "",
    subscriptionStatus: SubscriptionStatus.ALL,
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
 * Businses Owner slice
 */
const businessOwnerSlice = createSlice({
  name: "business-owners",
  initialState,
  reducers: {
    // Filter actions
    setSearchFilter: (state, action: PayloadAction<string>) => {
      state.filters.search = action.payload;
      state.filters.pageNo = 1;
    },

    setSubscriptionStatusFilter: (
      state,
      action: PayloadAction<SubscriptionStatus>
    ) => {
      state.filters.subscriptionStatus = action.payload;
      state.filters.pageNo = 1;
    },

    setPageNo: (state, action: PayloadAction<number>) => {
      state.filters.pageNo = action.payload;
    },

    // Utility actions
    clearError: (state) => {
      state.error = null;
    },

    clearSelectedBusinessOwner: (state) => {
      state.selectedUser = null;
    },

    resetFilters: (state) => {
      state.filters = initialState.filters;
    },

    resetState: () => {
      return initialState;
    },
  },

  extraReducers: (builder) => {
    // Fetch users handlers - ONLY affects list loading
    builder
      .addCase(fetchAllBusinessOwnerService.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchAllBusinessOwnerService.fulfilled, (state, action) => {
        state.isLoading = false;
        state.data = action.payload;
      })
      .addCase(fetchAllBusinessOwnerService.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Fetch user by ID handlers - USE SEPARATE LOADING STATE
    builder
      .addCase(fetchBusinessOwnerByIdService.pending, (state) => {
        state.operations.isFetchingDetail = true;
        state.error = null;
        state.selectedUser = null;
      })
      .addCase(fetchBusinessOwnerByIdService.fulfilled, (state, action) => {
        state.operations.isFetchingDetail = false;
        state.selectedUser = action.payload;

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
      .addCase(fetchBusinessOwnerByIdService.rejected, (state, action) => {
        state.operations.isFetchingDetail = false;
        state.error = action.payload as string;
      });

    // Create user handlers
    builder
      .addCase(createBusinessOwnerService.pending, (state) => {
        state.operations.isCreating = true;
        state.error = null;
      })
      .addCase(createBusinessOwnerService.fulfilled, (state, action) => {
        state.operations.isCreating = false;
        if (state.data) {
          state.data.content = [action.payload, ...state.data.content];
          state.data.totalElements += 1;
          state.data.totalPages = Math.ceil(
            state.data.totalElements / state.data.pageSize
          );
        }
      })
      .addCase(createBusinessOwnerService.rejected, (state, action) => {
        state.operations.isCreating = false;
        state.error = action.payload as string;
      });

    // Update user handlers
    builder
      .addCase(updateBusinessOwnerChangePlanService.pending, (state) => {
        state.operations.isUpdating = true;
        state.error = null;
      })
      .addCase(
        updateBusinessOwnerChangePlanService.fulfilled,
        (state, action) => {
          state.operations.isUpdating = false;
          state.selectedUser = action.payload;

          // Update in list
          if (state.data) {
            state.data.content = state.data.content.map((user) =>
              user.id === action.payload.id ? action.payload : user
            );
          }
        }
      )
      .addCase(
        updateBusinessOwnerChangePlanService.rejected,
        (state, action) => {
          state.operations.isUpdating = false;
          state.error = action.payload as string;
        }
      );

    // Update user handlers
    builder
      .addCase(updateBusinessOwnerRenewService.pending, (state) => {
        state.operations.isUpdating = true;
        state.error = null;
      })
      .addCase(updateBusinessOwnerRenewService.fulfilled, (state, action) => {
        state.operations.isUpdating = false;
        state.selectedUser = action.payload;

        // Update in list
        if (state.data) {
          state.data.content = state.data.content.map((user) =>
            user.id === action.payload.id ? action.payload : user
          );
        }
      })
      .addCase(updateBusinessOwnerRenewService.rejected, (state, action) => {
        state.operations.isUpdating = false;
        state.error = action.payload as string;
      });

    // Update user handlers
    builder
      .addCase(updateBusinessOwnerCancelService.pending, (state) => {
        state.operations.isUpdating = true;
        state.error = null;
      })
      .addCase(updateBusinessOwnerCancelService.fulfilled, (state, action) => {
        state.operations.isUpdating = false;
        state.selectedUser = action.payload;

        // Update in list
        if (state.data) {
          state.data.content = state.data.content.map((user) =>
            user.id === action.payload.id ? action.payload : user
          );
        }
      })
      .addCase(updateBusinessOwnerCancelService.rejected, (state, action) => {
        state.operations.isUpdating = false;
        state.error = action.payload as string;
      });

    // Delete user handlers
    builder
      .addCase(deleteBusinessOwnerService.pending, (state) => {
        state.operations.isDeleting = true;
        state.error = null;
      })
      .addCase(deleteBusinessOwnerService.fulfilled, (state, action) => {
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
      .addCase(deleteBusinessOwnerService.rejected, (state, action) => {
        state.operations.isDeleting = false;
        state.error = action.payload as string;
      });
  },
});

export const {
  setSearchFilter,
  setSubscriptionStatusFilter,
  setPageNo,
  clearError,
  clearSelectedBusinessOwner,
  resetFilters,
  resetState,
} = businessOwnerSlice.actions;

export default businessOwnerSlice.reducer;
