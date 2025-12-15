/**
 * Village Management - Redux Slice
 * Manages Village state: data, loading, errors, filters, operations
 */

import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { VillageManagementState } from "../models/type/village-type";
import {
  createVillageService,
  deleteVillageService,
  fetchAllVillageService,
  fetchVillageByCodeEnService,
  fetchVillageByIdService,
  fetchVillageByNameEnService,
  fetchVillageByNameKhService,
  updateVillageService,
} from "../thunks/village-thunks";

/**
 * Initial state
 */
const initialState: VillageManagementState = {
  data: null,
  selectedVillage: null,
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
 * Village slice
 */
const villageSlice = createSlice({
  name: "villages",
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

    clearSelectedVillage: (state) => {
      state.selectedVillage = null;
    },

    resetFilters: (state) => {
      state.filters = initialState.filters;
    },

    resetState: () => {
      return initialState;
    },
  },

  extraReducers: (builder) => {
    // Fetch villages handlers - ONLY affects list loading
    builder
      .addCase(fetchAllVillageService.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchAllVillageService.fulfilled, (state, action) => {
        state.isLoading = false;
        state.data = action.payload;
      })
      .addCase(fetchAllVillageService.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Fetch villages by ID handlers - USE SEPARATE LOADING STATE
    builder
      .addCase(fetchVillageByIdService.pending, (state) => {
        state.operations.isFetchingDetail = true;
        state.error = null;
        state.selectedVillage = null;
      })
      .addCase(fetchVillageByIdService.fulfilled, (state, action) => {
        state.operations.isFetchingDetail = false;
        state.selectedVillage = action.payload;

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
      .addCase(fetchVillageByIdService.rejected, (state, action) => {
        state.operations.isFetchingDetail = false;
        state.error = action.payload as string;
      });

    builder
      .addCase(fetchVillageByNameKhService.pending, (state) => {
        state.operations.isFetchingDetail = true;
        state.error = null;
        state.selectedVillage = null;
      })
      .addCase(fetchVillageByNameKhService.fulfilled, (state, action) => {
        state.operations.isFetchingDetail = false;
        state.selectedVillage = action.payload;

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
      .addCase(fetchVillageByNameKhService.rejected, (state, action) => {
        state.operations.isFetchingDetail = false;
        state.error = action.payload as string;
      });

    builder
      .addCase(fetchVillageByNameEnService.pending, (state) => {
        state.operations.isFetchingDetail = true;
        state.error = null;
        state.selectedVillage = null;
      })
      .addCase(fetchVillageByNameEnService.fulfilled, (state, action) => {
        state.operations.isFetchingDetail = false;
        state.selectedVillage = action.payload;

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
      .addCase(fetchVillageByNameEnService.rejected, (state, action) => {
        state.operations.isFetchingDetail = false;
        state.error = action.payload as string;
      });

    builder
      .addCase(fetchVillageByCodeEnService.pending, (state) => {
        state.operations.isFetchingDetail = true;
        state.error = null;
        state.selectedVillage = null;
      })
      .addCase(fetchVillageByCodeEnService.fulfilled, (state, action) => {
        state.operations.isFetchingDetail = false;
        state.selectedVillage = action.payload;

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
      .addCase(fetchVillageByCodeEnService.rejected, (state, action) => {
        state.operations.isFetchingDetail = false;
        state.error = action.payload as string;
      });

    // Create villages handlers
    builder
      .addCase(createVillageService.pending, (state) => {
        state.operations.isCreating = true;
        state.error = null;
      })
      .addCase(createVillageService.fulfilled, (state, action) => {
        state.operations.isCreating = false;
        if (state.data) {
          state.data.content = [action.payload, ...state.data.content];
          state.data.totalElements += 1;
          state.data.totalPages = Math.ceil(
            state.data.totalElements / state.data.pageSize
          );
        }
      })
      .addCase(createVillageService.rejected, (state, action) => {
        state.operations.isCreating = false;
        state.error = action.payload as string;
      });

    // Update villages handlers
    builder
      .addCase(updateVillageService.pending, (state) => {
        state.operations.isUpdating = true;
        state.error = null;
      })
      .addCase(updateVillageService.fulfilled, (state, action) => {
        state.operations.isUpdating = false;
        state.selectedVillage = action.payload;

        // Update in list
        if (state.data) {
          state.data.content = state.data.content.map((user) =>
            user.id === action.payload.id ? action.payload : user
          );
        }
      })
      .addCase(updateVillageService.rejected, (state, action) => {
        state.operations.isUpdating = false;
        state.error = action.payload as string;
      });

    // Delete villages handlers
    builder
      .addCase(deleteVillageService.pending, (state) => {
        state.operations.isDeleting = true;
        state.error = null;
      })
      .addCase(deleteVillageService.fulfilled, (state, action) => {
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
      .addCase(deleteVillageService.rejected, (state, action) => {
        state.operations.isDeleting = false;
        state.error = action.payload as string;
      });
  },
});

export const {
  setSearchFilter,
  setPageNo,
  clearError,
  clearSelectedVillage,
  resetFilters,
  resetState,
} = villageSlice.actions;

export default villageSlice.reducer;
