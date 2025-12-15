/**
 * Commune Management - Redux Slice
 * Manages Commune state: data, loading, errors, filters, operations
 */

import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CommuneManagementState } from "../models/type/commune-type";
import {
  createCommuneService,
  deleteCommuneService,
  fetchAllCommuneService,
  fetchCommuneByCodeEnService,
  fetchCommuneByIdService,
  fetchCommuneByNameEnService,
  fetchCommuneByNameKhService,
  updateCommuneService,
} from "../thunks/commune-thunks";

/**
 * Initial state
 */
const initialState: CommuneManagementState = {
  data: null,
  selectedCommune: null,
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
 * Communes slice
 */
const communeSlice = createSlice({
  name: "communes",
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

    clearSelectedCommune: (state) => {
      state.selectedCommune = null;
    },

    resetFilters: (state) => {
      state.filters = initialState.filters;
    },

    resetState: () => {
      return initialState;
    },
  },

  extraReducers: (builder) => {
    // Fetch communes handlers - ONLY affects list loading
    builder
      .addCase(fetchAllCommuneService.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchAllCommuneService.fulfilled, (state, action) => {
        state.isLoading = false;
        state.data = action.payload;
      })
      .addCase(fetchAllCommuneService.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Fetch communes by ID handlers - USE SEPARATE LOADING STATE
    builder
      .addCase(fetchCommuneByIdService.pending, (state) => {
        state.operations.isFetchingDetail = true;
        state.error = null;
        state.selectedCommune = null;
      })
      .addCase(fetchCommuneByIdService.fulfilled, (state, action) => {
        state.operations.isFetchingDetail = false;
        state.selectedCommune = action.payload;

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
      .addCase(fetchCommuneByIdService.rejected, (state, action) => {
        state.operations.isFetchingDetail = false;
        state.error = action.payload as string;
      });

    builder
      .addCase(fetchCommuneByNameKhService.pending, (state) => {
        state.operations.isFetchingDetail = true;
        state.error = null;
        state.selectedCommune = null;
      })
      .addCase(fetchCommuneByNameKhService.fulfilled, (state, action) => {
        state.operations.isFetchingDetail = false;
        state.selectedCommune = action.payload;

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
      .addCase(fetchCommuneByNameKhService.rejected, (state, action) => {
        state.operations.isFetchingDetail = false;
        state.error = action.payload as string;
      });

    builder
      .addCase(fetchCommuneByNameEnService.pending, (state) => {
        state.operations.isFetchingDetail = true;
        state.error = null;
        state.selectedCommune = null;
      })
      .addCase(fetchCommuneByNameEnService.fulfilled, (state, action) => {
        state.operations.isFetchingDetail = false;
        state.selectedCommune = action.payload;

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
      .addCase(fetchCommuneByNameEnService.rejected, (state, action) => {
        state.operations.isFetchingDetail = false;
        state.error = action.payload as string;
      });

    builder
      .addCase(fetchCommuneByCodeEnService.pending, (state) => {
        state.operations.isFetchingDetail = true;
        state.error = null;
        state.selectedCommune = null;
      })
      .addCase(fetchCommuneByCodeEnService.fulfilled, (state, action) => {
        state.operations.isFetchingDetail = false;
        state.selectedCommune = action.payload;

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
      .addCase(fetchCommuneByCodeEnService.rejected, (state, action) => {
        state.operations.isFetchingDetail = false;
        state.error = action.payload as string;
      });

    // Create business handlers
    builder
      .addCase(createCommuneService.pending, (state) => {
        state.operations.isCreating = true;
        state.error = null;
      })
      .addCase(createCommuneService.fulfilled, (state, action) => {
        state.operations.isCreating = false;
        if (state.data) {
          state.data.content = [action.payload, ...state.data.content];
          state.data.totalElements += 1;
          state.data.totalPages = Math.ceil(
            state.data.totalElements / state.data.pageSize
          );
        }
      })
      .addCase(createCommuneService.rejected, (state, action) => {
        state.operations.isCreating = false;
        state.error = action.payload as string;
      });

    // Update communes handlers
    builder
      .addCase(updateCommuneService.pending, (state) => {
        state.operations.isUpdating = true;
        state.error = null;
      })
      .addCase(updateCommuneService.fulfilled, (state, action) => {
        state.operations.isUpdating = false;
        state.selectedCommune = action.payload;

        // Update in list
        if (state.data) {
          state.data.content = state.data.content.map((user) =>
            user.id === action.payload.id ? action.payload : user
          );
        }
      })
      .addCase(updateCommuneService.rejected, (state, action) => {
        state.operations.isUpdating = false;
        state.error = action.payload as string;
      });

    // Delete communes handlers
    builder
      .addCase(deleteCommuneService.pending, (state) => {
        state.operations.isDeleting = true;
        state.error = null;
      })
      .addCase(deleteCommuneService.fulfilled, (state, action) => {
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
      .addCase(deleteCommuneService.rejected, (state, action) => {
        state.operations.isDeleting = false;
        state.error = action.payload as string;
      });
  },
});

export const {
  setSearchFilter,
  setPageNo,
  clearError,
  clearSelectedCommune,
  resetFilters,
  resetState,
} = communeSlice.actions;

export default communeSlice.reducer;
