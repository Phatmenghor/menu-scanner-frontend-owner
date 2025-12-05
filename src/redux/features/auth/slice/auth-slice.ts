/**
 * Auth Feature - Redux Slice
 * Manages auth state: user, profile, loading, errors
 */

import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AuthState } from "../models/auth-types";
import {
  UserAuthResponseModel,
  ProfileResponseModel,
} from "../models/auth-models";
import { login, getProfile } from "../thunks/auth-thunks";

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
      .addCase(login.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.isAuthenticated = !!action.payload.accessToken;
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        state.isAuthenticated = false;
      });

    // Get profile thunk handlers
    builder
      .addCase(getProfile.pending, (state) => {
        state.isProfileLoading = true;
        state.error = null;
      })
      .addCase(getProfile.fulfilled, (state, action) => {
        state.isProfileLoading = false;
        state.profile = action.payload;
      })
      .addCase(getProfile.rejected, (state, action) => {
        state.isProfileLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setUser, logout, clearError, resetAuthState } =
  authSlice.actions;
export default authSlice.reducer;
