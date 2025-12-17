/**
 * Payment Management - Redux Slice
 * Manages Payment state: data, loading, errors, filters, operations
 */

import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  BusinessStatus,
  SubscriptionStatus,
} from "@/constants/app-resource/status/status";
import { PaymentManagementState } from "../models/type/payment-type";
import {
  deletePaymentService,
  fetchAllPaymentService,
  fetchPaymentByIdService,
  updatePaymentService,
} from "../thunks/payment-thunks";
import { createBusinessService } from "../thunks/business-thunks";

/**
 * Initial state
 */
const initialState: PaymentManagementState = {
  data: null,
  selectedPayment: null,
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
 * Payment slice
 */
const paymentSlice = createSlice({
  name: "businesses",
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

    clearSelectedPayment: (state) => {
      state.selectedPayment = null;
    },

    resetFilters: (state) => {
      state.filters = initialState.filters;
    },

    resetState: () => {
      return initialState;
    },
  },

  extraReducers: (builder) => {
    // Fetch payment handlers - ONLY affects list loading
    builder
      .addCase(fetchAllPaymentService.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchAllPaymentService.fulfilled, (state, action) => {
        state.isLoading = false;
        state.data = action.payload;
      })
      .addCase(fetchAllPaymentService.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Fetch payment by ID handlers - USE SEPARATE LOADING STATE
    builder
      .addCase(fetchPaymentByIdService.pending, (state) => {
        state.operations.isFetchingDetail = true;
        state.error = null;
        state.selectedPayment = null;
      })
      .addCase(fetchPaymentByIdService.fulfilled, (state, action) => {
        state.operations.isFetchingDetail = false;
        state.selectedPayment = action.payload;

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
      .addCase(fetchPaymentByIdService.rejected, (state, action) => {
        state.operations.isFetchingDetail = false;
        state.error = action.payload as string;
      });

    // Create payment handlers
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

    // Update payment handlers
    builder
      .addCase(updatePaymentService.pending, (state) => {
        state.operations.isUpdating = true;
        state.error = null;
      })
      .addCase(updatePaymentService.fulfilled, (state, action) => {
        state.operations.isUpdating = false;
        state.selectedPayment = action.payload;

        // Update in list
        if (state.data) {
          state.data.content = state.data.content.map((user) =>
            user.id === action.payload.id ? action.payload : user
          );
        }
      })
      .addCase(updatePaymentService.rejected, (state, action) => {
        state.operations.isUpdating = false;
        state.error = action.payload as string;
      });

    // Delete payment handlers
    builder
      .addCase(deletePaymentService.pending, (state) => {
        state.operations.isDeleting = true;
        state.error = null;
      })
      .addCase(deletePaymentService.fulfilled, (state, action) => {
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
      .addCase(deletePaymentService.rejected, (state, action) => {
        state.operations.isDeleting = false;
        state.error = action.payload as string;
      });
  },
});

export const {
  setSearchFilter,
  setPageNo,
  clearError,
  clearSelectedPayment,
  resetFilters,
  resetState,
} = paymentSlice.actions;

export default paymentSlice.reducer;
