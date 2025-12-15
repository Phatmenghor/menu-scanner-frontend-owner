/**
 * Province Management - Redux Slice
 * Manages Province state: data, loading, errors, filters, operations
 */

import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ProvinceManagementState } from "../models/type/province-type";
import {
  createProvinceService,
  deleteProvinceService,
  fetchAllProvinceService,
  fetchProvinceByCodeEnService,
  fetchProvinceByIdService,
  fetchProvinceByNameEnService,
  fetchProvinceByNameKhService,
  updateProvinceService,
} from "../thunks/province-thunks";

/**
 * Initial state
 */
const initialState: ProvinceManagementState = {
  data: null,
  selectedProvince: null,
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
 * province slice
 */
const provinceSlice = createSlice({
  name: "provinces",
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

    clearSelectedProvince: (state) => {
      state.selectedProvince = null;
    },

    resetFilters: (state) => {
      state.filters = initialState.filters;
    },

    resetState: () => {
      return initialState;
    },
  },

  extraReducers: (builder) => {
    // Fetch province handlers - ONLY affects list loading
    builder
      .addCase(fetchAllProvinceService.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchAllProvinceService.fulfilled, (state, action) => {
        state.isLoading = false;
        state.data = action.payload;
      })
      .addCase(fetchAllProvinceService.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Fetch province by ID handlers - USE SEPARATE LOADING STATE
    builder
      .addCase(fetchProvinceByIdService.pending, (state) => {
        state.operations.isFetchingDetail = true;
        state.error = null;
        state.selectedProvince = null;
      })
      .addCase(fetchProvinceByIdService.fulfilled, (state, action) => {
        state.operations.isFetchingDetail = false;
        state.selectedProvince = action.payload;

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
      .addCase(fetchProvinceByIdService.rejected, (state, action) => {
        state.operations.isFetchingDetail = false;
        state.error = action.payload as string;
      });

    builder
      .addCase(fetchProvinceByNameKhService.pending, (state) => {
        state.operations.isFetchingDetail = true;
        state.error = null;
        state.selectedProvince = null;
      })
      .addCase(fetchProvinceByNameKhService.fulfilled, (state, action) => {
        state.operations.isFetchingDetail = false;
        state.selectedProvince = action.payload;

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
      .addCase(fetchProvinceByNameKhService.rejected, (state, action) => {
        state.operations.isFetchingDetail = false;
        state.error = action.payload as string;
      });

    builder
      .addCase(fetchProvinceByNameEnService.pending, (state) => {
        state.operations.isFetchingDetail = true;
        state.error = null;
        state.selectedProvince = null;
      })
      .addCase(fetchProvinceByNameEnService.fulfilled, (state, action) => {
        state.operations.isFetchingDetail = false;
        state.selectedProvince = action.payload;

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
      .addCase(fetchProvinceByNameEnService.rejected, (state, action) => {
        state.operations.isFetchingDetail = false;
        state.error = action.payload as string;
      });

    builder
      .addCase(fetchProvinceByCodeEnService.pending, (state) => {
        state.operations.isFetchingDetail = true;
        state.error = null;
        state.selectedProvince = null;
      })
      .addCase(fetchProvinceByCodeEnService.fulfilled, (state, action) => {
        state.operations.isFetchingDetail = false;
        state.selectedProvince = action.payload;

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
      .addCase(fetchProvinceByCodeEnService.rejected, (state, action) => {
        state.operations.isFetchingDetail = false;
        state.error = action.payload as string;
      });

    // Create province handlers
    builder
      .addCase(createProvinceService.pending, (state) => {
        state.operations.isCreating = true;
        state.error = null;
      })
      .addCase(createProvinceService.fulfilled, (state, action) => {
        state.operations.isCreating = false;
        if (state.data) {
          state.data.content = [action.payload, ...state.data.content];
          state.data.totalElements += 1;
          state.data.totalPages = Math.ceil(
            state.data.totalElements / state.data.pageSize
          );
        }
      })
      .addCase(createProvinceService.rejected, (state, action) => {
        state.operations.isCreating = false;
        state.error = action.payload as string;
      });

    // Update province handlers
    builder
      .addCase(updateProvinceService.pending, (state) => {
        state.operations.isUpdating = true;
        state.error = null;
      })
      .addCase(updateProvinceService.fulfilled, (state, action) => {
        state.operations.isUpdating = false;
        state.selectedProvince = action.payload;

        // Update in list
        if (state.data) {
          state.data.content = state.data.content.map((user) =>
            user.id === action.payload.id ? action.payload : user
          );
        }
      })
      .addCase(updateProvinceService.rejected, (state, action) => {
        state.operations.isUpdating = false;
        state.error = action.payload as string;
      });

    // Delete province handlers
    builder
      .addCase(deleteProvinceService.pending, (state) => {
        state.operations.isDeleting = true;
        state.error = null;
      })
      .addCase(deleteProvinceService.fulfilled, (state, action) => {
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
      .addCase(deleteProvinceService.rejected, (state, action) => {
        state.operations.isDeleting = false;
        state.error = action.payload as string;
      });
  },
});

export const {
  setSearchFilter,
  setPageNo,
  clearError,
  clearSelectedProvince,
  resetFilters,
  resetState,
} = provinceSlice.actions;

export default provinceSlice.reducer;
