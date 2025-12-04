import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AccountStatus, UserRole } from "@/constants/AppResource/status/status";
import type { UserState } from "./types";
import {
  fetchUsers,
  fetchUserById,
  createUser,
  updateUser,
  deleteUser,
  toggleUserStatus,
} from "./thunks";

// Initial state
const initialState: UserState = {
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

// Slice
const userSlice = createSlice({
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
    resetState: () => initialState,
  },
  extraReducers: (builder) => {
    // Fetch users
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.data = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Fetch user by ID
    builder
      .addCase(fetchUserById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUserById.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(fetchUserById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Create user
    builder
      .addCase(createUser.pending, (state) => {
        state.operations.isCreating = true;
        state.error = null;
      })
      .addCase(createUser.fulfilled, (state, action) => {
        state.operations.isCreating = false;
        if (state.data) {
          state.data.content = [action.payload, ...state.data.content];
          state.data.totalElements += 1;
        }
      })
      .addCase(createUser.rejected, (state, action) => {
        state.operations.isCreating = false;
        state.error = action.payload as string;
      });

    // Update user
    builder
      .addCase(updateUser.pending, (state) => {
        state.operations.isUpdating = true;
        state.error = null;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.operations.isUpdating = false;
        if (state.data) {
          state.data.content = state.data.content.map((user) =>
            user.id === action.payload.id ? action.payload : user
          );
        }
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.operations.isUpdating = false;
        state.error = action.payload as string;
      });

    // Delete user
    builder
      .addCase(deleteUser.pending, (state) => {
        state.operations.isDeleting = true;
        state.error = null;
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.operations.isDeleting = false;
        if (state.data) {
          state.data.content = state.data.content.filter(
            (user) => user.id !== action.payload
          );
          state.data.totalElements -= 1;
        }
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.operations.isDeleting = false;
        state.error = action.payload as string;
      });

    // Toggle user status
    builder
      .addCase(toggleUserStatus.pending, (state) => {
        state.error = null;
      })
      .addCase(toggleUserStatus.fulfilled, (state, action) => {
        if (state.data) {
          state.data.content = state.data.content.map((user) =>
            user.id === action.payload.id ? action.payload : user
          );
        }
      })
      .addCase(toggleUserStatus.rejected, (state, action) => {
        state.error = action.payload as string;
      });
  },
});

// Export actions
export const {
  setSearchFilter,
  setAccountStatusFilter,
  setRoleFilter,
  setPageNo,
  clearError,
  resetFilters,
  resetState,
} = userSlice.actions;

// Export reducer
export default userSlice.reducer;
