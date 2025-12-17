/**
 * Exchange Rate Management - Redux Slice
 * Manages Exchange Rate state: data, loading, errors, filters, operations
 */

import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  BusinessStatus,
  ExchangeRateStatus,
} from "@/constants/app-resource/status/status";
import { ExchangeRateManagementState } from "../models/type/exchange-rate-type";
import {
  createExchangeRateService,
  deleteExchangeRateService,
  fetchAllExchangeRateService,
  fetchExchangeRateByIdService,
  updateExchangeRateService,
} from "../thunks/exchange-rate-thunks";

/**
 * Initial state
 */
const initialState: ExchangeRateManagementState = {
  data: null,
  selectedExchangeRate: null,
  isLoading: true,
  error: null,
  filters: {
    search: "",
    isActive: ExchangeRateStatus.ALL,
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
const exchangeRateSlice = createSlice({
  name: "exchange-rate",
  initialState,
  reducers: {
    // Filter actions
    setSearchFilter: (state, action: PayloadAction<string>) => {
      state.filters.search = action.payload;
      state.filters.pageNo = 1;
    },

    setExchangeRateStatusFilter: (
      state,
      action: PayloadAction<ExchangeRateStatus>
    ) => {
      state.filters.isActive = action.payload;
      state.filters.pageNo = 1;
    },

    setPageNo: (state, action: PayloadAction<number>) => {
      state.filters.pageNo = action.payload;
    },

    // Utility actions
    clearError: (state) => {
      state.error = null;
    },

    clearSelectedExchangeRate: (state) => {
      state.selectedExchangeRate = null;
    },

    resetFilters: (state) => {
      state.filters = initialState.filters;
    },

    resetState: () => {
      return initialState;
    },
  },

  extraReducers: (builder) => {
    // Fetch exchange rate handlers - ONLY affects list loading
    builder
      .addCase(fetchAllExchangeRateService.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchAllExchangeRateService.fulfilled, (state, action) => {
        state.isLoading = false;
        state.data = action.payload;
      })
      .addCase(fetchAllExchangeRateService.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Fetch exchange rate by ID handlers - USE SEPARATE LOADING STATE
    builder
      .addCase(fetchExchangeRateByIdService.pending, (state) => {
        state.operations.isFetchingDetail = true;
        state.error = null;
        state.selectedExchangeRate = null;
      })
      .addCase(fetchExchangeRateByIdService.fulfilled, (state, action) => {
        state.operations.isFetchingDetail = false;
        state.selectedExchangeRate = action.payload;

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
      .addCase(fetchExchangeRateByIdService.rejected, (state, action) => {
        state.operations.isFetchingDetail = false;
        state.error = action.payload as string;
      });

    // Create exchange rate handlers
    builder
      .addCase(createExchangeRateService.pending, (state) => {
        state.operations.isCreating = true;
        state.error = null;
      })
      .addCase(createExchangeRateService.fulfilled, (state, action) => {
        state.operations.isCreating = false;
        if (state.data) {
          state.data.content = [action.payload, ...state.data.content];
          state.data.totalElements += 1;
          state.data.totalPages = Math.ceil(
            state.data.totalElements / state.data.pageSize
          );
        }
      })
      .addCase(createExchangeRateService.rejected, (state, action) => {
        state.operations.isCreating = false;
        state.error = action.payload as string;
      });

    // Update exchange rate handlers
    builder
      .addCase(updateExchangeRateService.pending, (state) => {
        state.operations.isUpdating = true;
        state.error = null;
      })
      .addCase(updateExchangeRateService.fulfilled, (state, action) => {
        state.operations.isUpdating = false;
        state.selectedExchangeRate = action.payload;

        // Update in list
        if (state.data) {
          state.data.content = state.data.content.map((user) =>
            user.id === action.payload.id ? action.payload : user
          );
        }
      })
      .addCase(updateExchangeRateService.rejected, (state, action) => {
        state.operations.isUpdating = false;
        state.error = action.payload as string;
      });

    // Delete exchange rate handlers
    builder
      .addCase(deleteExchangeRateService.pending, (state) => {
        state.operations.isDeleting = true;
        state.error = null;
      })
      .addCase(deleteExchangeRateService.fulfilled, (state, action) => {
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
      .addCase(deleteExchangeRateService.rejected, (state, action) => {
        state.operations.isDeleting = false;
        state.error = action.payload as string;
      });
  },
});

export const {
  setSearchFilter,
  setExchangeRateStatusFilter,
  setPageNo,
  clearError,
  clearSelectedExchangeRate,
  resetFilters,
  resetState,
} = exchangeRateSlice.actions;

export default exchangeRateSlice.reducer;
