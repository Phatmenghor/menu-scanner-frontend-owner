/**
 * District Management - Redux Slice
 * Manages District state: data, loading, errors, filters, operations
 */

import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { DistrictManagementState } from "../models/type/district-type";
import {
  createDistrictService,
  deleteDistrictService,
  fetcDistrictByNameEnService,
  fetchAllDistrictService,
  fetchDistrictByCodeEnService,
  fetchDistrictByIdService,
  fetchDistrictByNameKhService,
  updateDistrictService,
} from "../thunks/district-thunks";

/**
 * Initial state
 */
const initialState: DistrictManagementState = {
  data: null,
  selectedDistrict: null,
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
 * district slice
 */
const districtSlice = createSlice({
  name: "districts",
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

    clearSelectedDistrict: (state) => {
      state.selectedDistrict = null;
    },

    resetFilters: (state) => {
      state.filters = initialState.filters;
    },

    resetState: () => {
      return initialState;
    },
  },

  extraReducers: (builder) => {
    // Fetch district handlers - ONLY affects list loading
    builder
      .addCase(fetchAllDistrictService.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchAllDistrictService.fulfilled, (state, action) => {
        state.isLoading = false;
        state.data = action.payload;
      })
      .addCase(fetchAllDistrictService.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Fetch district by ID handlers - USE SEPARATE LOADING STATE
    builder
      .addCase(fetchDistrictByIdService.pending, (state) => {
        state.operations.isFetchingDetail = true;
        state.error = null;
        state.selectedDistrict = null;
      })
      .addCase(fetchDistrictByIdService.fulfilled, (state, action) => {
        state.operations.isFetchingDetail = false;
        state.selectedDistrict = action.payload;

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
      .addCase(fetchDistrictByIdService.rejected, (state, action) => {
        state.operations.isFetchingDetail = false;
        state.error = action.payload as string;
      });

    builder
      .addCase(fetchDistrictByNameKhService.pending, (state) => {
        state.operations.isFetchingDetail = true;
        state.error = null;
        state.selectedDistrict = null;
      })
      .addCase(fetchDistrictByNameKhService.fulfilled, (state, action) => {
        state.operations.isFetchingDetail = false;
        state.selectedDistrict = action.payload;

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
      .addCase(fetchDistrictByNameKhService.rejected, (state, action) => {
        state.operations.isFetchingDetail = false;
        state.error = action.payload as string;
      });

    builder
      .addCase(fetcDistrictByNameEnService.pending, (state) => {
        state.operations.isFetchingDetail = true;
        state.error = null;
        state.selectedDistrict = null;
      })
      .addCase(fetcDistrictByNameEnService.fulfilled, (state, action) => {
        state.operations.isFetchingDetail = false;
        state.selectedDistrict = action.payload;

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
      .addCase(fetcDistrictByNameEnService.rejected, (state, action) => {
        state.operations.isFetchingDetail = false;
        state.error = action.payload as string;
      });

    builder
      .addCase(fetchDistrictByCodeEnService.pending, (state) => {
        state.operations.isFetchingDetail = true;
        state.error = null;
        state.selectedDistrict = null;
      })
      .addCase(fetchDistrictByCodeEnService.fulfilled, (state, action) => {
        state.operations.isFetchingDetail = false;
        state.selectedDistrict = action.payload;

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
      .addCase(fetchDistrictByCodeEnService.rejected, (state, action) => {
        state.operations.isFetchingDetail = false;
        state.error = action.payload as string;
      });

    // Create district handlers
    builder
      .addCase(createDistrictService.pending, (state) => {
        state.operations.isCreating = true;
        state.error = null;
      })
      .addCase(createDistrictService.fulfilled, (state, action) => {
        state.operations.isCreating = false;
        if (state.data) {
          state.data.content = [action.payload, ...state.data.content];
          state.data.totalElements += 1;
          state.data.totalPages = Math.ceil(
            state.data.totalElements / state.data.pageSize
          );
        }
      })
      .addCase(createDistrictService.rejected, (state, action) => {
        state.operations.isCreating = false;
        state.error = action.payload as string;
      });

    // Update district handlers
    builder
      .addCase(updateDistrictService.pending, (state) => {
        state.operations.isUpdating = true;
        state.error = null;
      })
      .addCase(updateDistrictService.fulfilled, (state, action) => {
        state.operations.isUpdating = false;
        state.selectedDistrict = action.payload;

        // Update in list
        if (state.data) {
          state.data.content = state.data.content.map((user) =>
            user.id === action.payload.id ? action.payload : user
          );
        }
      })
      .addCase(updateDistrictService.rejected, (state, action) => {
        state.operations.isUpdating = false;
        state.error = action.payload as string;
      });

    // Delete district handlers
    builder
      .addCase(deleteDistrictService.pending, (state) => {
        state.operations.isDeleting = true;
        state.error = null;
      })
      .addCase(deleteDistrictService.fulfilled, (state, action) => {
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
      .addCase(deleteDistrictService.rejected, (state, action) => {
        state.operations.isDeleting = false;
        state.error = action.payload as string;
      });
  },
});

export const {
  setSearchFilter,
  setPageNo,
  clearError,
  clearSelectedDistrict,
  resetFilters,
  resetState,
} = districtSlice.actions;

export default districtSlice.reducer;
