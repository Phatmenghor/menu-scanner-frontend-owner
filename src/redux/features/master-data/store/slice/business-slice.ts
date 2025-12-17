/**
 * Business Management - Redux Slice
 * Manages business state: data, loading, errors, filters, operations
 */

import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  BusinessStatus,
  SubscriptionStatus,
} from "@/constants/app-resource/status/status";
import { BusinessManagementState } from "../models/type/business-type";
import {
  createBusinessService,
  deleteBusinessService,
  fetchAllBusinessService,
  fetchBusinessByIdService,
  updateBusinessService,
} from "../thunks/business-thunks";

/**
 * Initial state
 */
const initialState: BusinessManagementState = {
  data: null,
  selectedBusiness: null,
  isLoading: true,
  error: null,
  filters: {
    search: "",
    businessStatus: BusinessStatus.ALL,
    hasActiveSubscription: SubscriptionStatus.ALL,
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
const businessSlice = createSlice({
  name: "businesses",
  initialState,
  reducers: {
    // Filter actions
    setSearchFilter: (state, action: PayloadAction<string>) => {
      state.filters.search = action.payload;
      state.filters.pageNo = 1;
    },

    setBusinessStatusFilter: (state, action: PayloadAction<BusinessStatus>) => {
      state.filters.businessStatus = action.payload;
      state.filters.pageNo = 1;
    },

    setHasSubscriptionFilter: (
      state,
      action: PayloadAction<SubscriptionStatus>
    ) => {
      state.filters.hasActiveSubscription = action.payload;
      state.filters.pageNo = 1;
    },

    setPageNo: (state, action: PayloadAction<number>) => {
      state.filters.pageNo = action.payload;
    },

    // Utility actions
    clearError: (state) => {
      state.error = null;
    },

    clearSelectedBusiness: (state) => {
      state.selectedBusiness = null;
    },

    resetFilters: (state) => {
      state.filters = initialState.filters;
    },

    resetState: () => {
      return initialState;
    },
  },

  extraReducers: (builder) => {
    // Fetch business handlers - ONLY affects list loading
    builder
      .addCase(fetchAllBusinessService.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchAllBusinessService.fulfilled, (state, action) => {
        state.isLoading = false;
        state.data = action.payload;
      })
      .addCase(fetchAllBusinessService.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Fetch business by ID handlers - USE SEPARATE LOADING STATE
    builder
      .addCase(fetchBusinessByIdService.pending, (state) => {
        state.operations.isFetchingDetail = true;
        state.error = null;
        state.selectedBusiness = null;
      })
      .addCase(fetchBusinessByIdService.fulfilled, (state, action) => {
        state.operations.isFetchingDetail = false;
        state.selectedBusiness = action.payload;

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
      .addCase(fetchBusinessByIdService.rejected, (state, action) => {
        state.operations.isFetchingDetail = false;
        state.error = action.payload as string;
      });

    // Create business handlers
    builder
      .addCase(createBusinessService.pending, (state) => {
        state.operations.isCreating = true;
        state.error = null;
      })
      .addCase(createBusinessService.fulfilled, (state, action) => {
        state.operations.isCreating = false;
        if (state.data) {
          state.data.content = [action.payload, ...state.data.content];
          state.data.totalElements += 1;
          state.data.totalPages = Math.ceil(
            state.data.totalElements / state.data.pageSize
          );
        }
      })
      .addCase(createBusinessService.rejected, (state, action) => {
        state.operations.isCreating = false;
        state.error = action.payload as string;
      });

    // Update business handlers
    builder
      .addCase(updateBusinessService.pending, (state) => {
        state.operations.isUpdating = true;
        state.error = null;
      })
      .addCase(updateBusinessService.fulfilled, (state, action) => {
        state.operations.isUpdating = false;
        state.selectedBusiness = action.payload;

        // Update in list
        if (state.data) {
          state.data.content = state.data.content.map((user) =>
            user.id === action.payload.id ? action.payload : user
          );
        }
      })
      .addCase(updateBusinessService.rejected, (state, action) => {
        state.operations.isUpdating = false;
        state.error = action.payload as string;
      });

    // Delete business handlers
    builder
      .addCase(deleteBusinessService.pending, (state) => {
        state.operations.isDeleting = true;
        state.error = null;
      })
      .addCase(deleteBusinessService.fulfilled, (state, action) => {
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
      .addCase(deleteBusinessService.rejected, (state, action) => {
        state.operations.isDeleting = false;
        state.error = action.payload as string;
      });
  },
});

export const {
  setSearchFilter,
  setBusinessStatusFilter,
  setPageNo,
  clearError,
  clearSelectedBusiness,
  resetFilters,
  resetState,
  setHasSubscriptionFilter,
} = businessSlice.actions;

export default businessSlice.reducer;
