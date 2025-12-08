/**
 * Business Management - Redux Slice
 * Manages Business state: data, loading, errors, filters, operations
 */

import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { BusinessStatus } from "@/constants/AppResource/status/status";
import { BusinessManagementState } from "../type/business-type";
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
  isLoading: false,
  error: null,
  filters: {
    search: "",
    businessStatus: BusinessStatus.ALL,
    pageNo: 1,
  },
  operations: {
    isCreating: false,
    isUpdating: false,
    isDeleting: false,
  },
};

/**
 * Business slice
 */
const businessSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    // Filter actions
    setSearchFilter: (state, action: PayloadAction<string>) => {
      state.filters.search = action.payload;
    },

    setStatusFilter: (state, action: PayloadAction<BusinessStatus>) => {
      state.filters.businessStatus = action.payload;
    },

    setPageNo: (state, action: PayloadAction<number>) => {
      state.filters.pageNo = action.payload;
    },

    // Utility actions
    clearError: (state) => {
      state.error = null;
    },

    resetFilters: (state) => {
      state.filters = initialState.filters;
    },

    resetState: () => {
      return initialState;
    },
  },

  extraReducers: (builder) => {
    // Fetch Business handlers
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

    // Fetch Business by ID handlers
    builder
      .addCase(fetchBusinessByIdService.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchBusinessByIdService.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(fetchBusinessByIdService.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Create Business handlers
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
        }
      })
      .addCase(createBusinessService.rejected, (state, action) => {
        state.operations.isCreating = false;
        state.error = action.payload as string;
      });

    // Update Business handlers
    builder
      .addCase(updateBusinessService.pending, (state) => {
        state.operations.isUpdating = true;
        state.error = null;
      })
      .addCase(updateBusinessService.fulfilled, (state, action) => {
        state.operations.isUpdating = false;
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

    // Delete Business handlers
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
  setStatusFilter,
  setPageNo,
  clearError,
  resetFilters,
  resetState,
} = businessSlice.actions;

export default businessSlice.reducer;
