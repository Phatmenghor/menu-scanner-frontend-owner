/**
 * User Management - Redux Slice
 * Manages user state: data, loading, errors, filters, operations
 */

import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AccountStatus, UserRole } from "@/constants/AppResource/status/status";
import {
  createUserService,
  deleteUserService,
  fetchUserByIdService,
  fetchAllUsersService,
  toggleUserStatusService,
  updateUserService,
} from "../thunks/users-thunks";
import { UserManagementState } from "../models/user-types";

/**
 * Initial state
 */
const initialState: UserManagementState = {
  data: null,
  isLoading: false,
  error: null,
  filters: {
    search: "",
    accountStatus: AccountStatus.ALL,
    role: UserRole.ALL,
    pageNo: 1,
  },
  operations: {
    isCreating: false,
    isUpdating: false,
    isDeleting: false,
  },
};

/**
 * Users slice
 */
const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    // Filter actions
    setSearchFilter: (state, action: PayloadAction<string>) => {
      state.filters.search = action.payload;
    },

    setAccountStatusFilter: (state, action: PayloadAction<AccountStatus>) => {
      state.filters.accountStatus = action.payload;
    },

    setRoleFilter: (state, action: PayloadAction<UserRole>) => {
      state.filters.role = action.payload;
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
    // Fetch users handlers
    builder
      .addCase(fetchAllUsersService.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchAllUsersService.fulfilled, (state, action) => {
        state.isLoading = false;
        state.data = action.payload;
      })
      .addCase(fetchAllUsersService.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Fetch user by ID handlers
    builder
      .addCase(fetchUserByIdService.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUserByIdService.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(fetchUserByIdService.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Create user handlers
    builder
      .addCase(createUserService.pending, (state) => {
        state.operations.isCreating = true;
        state.error = null;
      })
      .addCase(createUserService.fulfilled, (state, action) => {
        state.operations.isCreating = false;
        if (state.data) {
          state.data.content = [action.payload, ...state.data.content];
          state.data.totalElements += 1;
        }
      })
      .addCase(createUserService.rejected, (state, action) => {
        state.operations.isCreating = false;
        state.error = action.payload as string;
      });

    // Update user handlers
    builder
      .addCase(updateUserService.pending, (state) => {
        state.operations.isUpdating = true;
        state.error = null;
      })
      .addCase(updateUserService.fulfilled, (state, action) => {
        state.operations.isUpdating = false;
        if (state.data) {
          state.data.content = state.data.content.map((user) =>
            user.id === action.payload.id ? action.payload : user
          );
        }
      })
      .addCase(updateUserService.rejected, (state, action) => {
        state.operations.isUpdating = false;
        state.error = action.payload as string;
      });

    // Delete user handlers
    builder
      .addCase(deleteUserService.pending, (state) => {
        state.operations.isDeleting = true;
        state.error = null;
      })
      .addCase(deleteUserService.fulfilled, (state, action) => {
        state.operations.isDeleting = false;
        if (state.data) {
          state.data.content = state.data.content.filter(
            (user) => user.id !== action.payload
          );
          state.data.totalElements -= 1;
        }
      })
      .addCase(deleteUserService.rejected, (state, action) => {
        state.operations.isDeleting = false;
        state.error = action.payload as string;
      });

    // Toggle user status handlers
    builder
      .addCase(toggleUserStatusService.pending, (state) => {
        state.error = null;
      })
      .addCase(toggleUserStatusService.fulfilled, (state, action) => {
        if (state.data) {
          state.data.content = state.data.content.map((user) =>
            user.id === action.payload.id ? action.payload : user
          );
        }
      })
      .addCase(toggleUserStatusService.rejected, (state, action) => {
        state.error = action.payload as string;
      });
  },
});

export const {
  setSearchFilter,
  setAccountStatusFilter,
  setRoleFilter,
  setPageNo,
  clearError,
  resetFilters,
  resetState,
} = usersSlice.actions;

export default usersSlice.reducer;
