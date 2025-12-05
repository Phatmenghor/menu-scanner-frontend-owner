/**
 * Auth Feature - Redux Slice
 * Manages auth state: user, profile, loading, errors
 */

import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { UserAuthResponseModel } from "../models/auth-models";
import { loginService, getProfileService } from "../thunks/auth-thunks";
import { AuthState } from "../models/auth-types";
import { storeToken } from "@/utils/local-storage/token";
import { storeUserInfo } from "@/utils/local-storage/userInfo";
import { storeRoles } from "@/utils/local-storage/roles";

/**
 * Initial auth state
 */
const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  profile: null,
  isLoading: false,
  isProfileLoading: false,
  error: null,
};

/**
 * Auth slice
 */
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    /**
     * Set user directly (useful after checking local storage)
     */
    setUser: (state, action: PayloadAction<UserAuthResponseModel>) => {
      state.user = action.payload;
      state.isAuthenticated = !!action.payload.accessToken;
    },

    /**
     * Clear authentication state
     */
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.profile = null;
      state.error = null;
    },

    /**
     * Clear any errors
     */
    clearError: (state) => {
      state.error = null;
    },

    /**
     * Reset auth state
     */
    resetAuthState: () => initialState,
  },

  extraReducers: (builder) => {
    // Login thunk handlers
    builder
      .addCase(loginService.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginService.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.isAuthenticated = !!action.payload.accessToken;

        // Store authentication data in local storage (side effects)
        if (action.payload.accessToken) {
          storeToken(action.payload.accessToken);
        }

        if (action.payload) {
          storeUserInfo({
            userId: action.payload.userId || "",
            userIdentifier: action.payload.userIdentifier || "",
            profileImageUrl: action.payload.profileImageUrl || "",
            email: action.payload.email || "",
            fullName: action.payload.fullName || "",
            businessId: action.payload.businessId || "",
            userType: action.payload.userType || "",
          });
        }

        if (action.payload.roles) {
          storeRoles(action.payload.roles);
        }
      })
      .addCase(loginService.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        state.isAuthenticated = false;
      });

    // Get profile thunk handlers
    builder
      .addCase(getProfileService.pending, (state) => {
        state.isProfileLoading = true;
        state.error = null;
      })
      .addCase(getProfileService.fulfilled, (state, action) => {
        state.isProfileLoading = false;
        state.profile = action.payload;
      })
      .addCase(getProfileService.rejected, (state, action) => {
        state.isProfileLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setUser, logout, clearError, resetAuthState } =
  authSlice.actions;
export default authSlice.reducer;
