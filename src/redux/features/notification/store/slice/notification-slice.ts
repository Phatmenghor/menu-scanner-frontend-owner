/**
 * Notification Management - Redux Slice
 * Manages Notification state: data, loading, errors, filters, operations
 */

import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { NotificationManagementState } from "../models/type/notification-type";
import {
  createNotificationService,
  deleteAllNotificationService,
  deleteNotificationService,
  fetchAllNotificationService,
  fetchMyNotificationService,
  fetchNotificationByIdService,
  fetchNotificationUnReadCountervice,
  fetchNotificationUnSeenCountService,
  updateNotificationMakeAllReadService,
  updateNotificationMakeAllSeenService,
  updateNotificationReadService,
} from "../thunks/notification-thunks";

/**
 * Initial state
 */
const initialState: NotificationManagementState = {
  data: null,
  selectedNotification: null,
  unReadCount: 0,
  unSeenCount: 0,
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
 * Notification slice
 */
const notificationSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    setSearchFilter: (state, action: PayloadAction<string>) => {
      state.filters.search = action.payload;
      state.filters.pageNo = 1;
    },

    setPageNo: (state, action: PayloadAction<number>) => {
      state.filters.pageNo = action.payload;
    },

    clearError: (state) => {
      state.error = null;
    },

    clearSelectedNotification: (state) => {
      state.selectedNotification = null;
    },

    resetFilters: (state) => {
      state.filters = initialState.filters;
    },

    resetState: () => {
      return initialState;
    },
  },

  extraReducers: (builder) => {
    // Fetch notifications handlers - ONLY affects list loading
    builder
      .addCase(fetchAllNotificationService.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchAllNotificationService.fulfilled, (state, action) => {
        state.isLoading = false;
        state.data = action.payload;
      })
      .addCase(fetchAllNotificationService.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Fetch notifications handlers - ONLY affects list loading
    builder
      .addCase(fetchMyNotificationService.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchMyNotificationService.fulfilled, (state, action) => {
        state.isLoading = false;
        state.data = action.payload;
      })
      .addCase(fetchMyNotificationService.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Fetch notifications by ID handlers - USE SEPARATE LOADING STATE
    builder
      .addCase(fetchNotificationByIdService.pending, (state) => {
        state.operations.isFetchingDetail = true;
        state.error = null;
        state.selectedNotification = null;
      })
      .addCase(fetchNotificationByIdService.fulfilled, (state, action) => {
        state.operations.isFetchingDetail = false;
        state.selectedNotification = action.payload;

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
      .addCase(fetchNotificationByIdService.rejected, (state, action) => {
        state.operations.isFetchingDetail = false;
        state.error = action.payload as string;
      });

    // Fetch notifications unread count
    builder
      .addCase(fetchNotificationUnReadCountervice.pending, (state) => {
        state.operations.isFetchingDetail = true;
        state.error = null;
        state.selectedNotification = null;
      })
      .addCase(
        fetchNotificationUnReadCountervice.fulfilled,
        (state, action) => {
          state.operations.isFetchingDetail = false;
          state.unReadCount = action.payload;
        }
      )
      .addCase(fetchNotificationUnReadCountervice.rejected, (state, action) => {
        state.operations.isFetchingDetail = false;
        state.error = action.payload as string;
      });

    // Fetch notifications unseen count
    builder
      .addCase(fetchNotificationUnSeenCountService.pending, (state) => {
        state.operations.isFetchingDetail = true;
        state.error = null;
        state.selectedNotification = null;
      })
      .addCase(
        fetchNotificationUnSeenCountService.fulfilled,
        (state, action) => {
          state.operations.isFetchingDetail = false;
          state.unReadCount = action.payload;
        }
      )
      .addCase(
        fetchNotificationUnSeenCountService.rejected,
        (state, action) => {
          state.operations.isFetchingDetail = false;
          state.error = action.payload as string;
        }
      );

    // Create notification handlers
    builder
      .addCase(createNotificationService.pending, (state) => {
        state.operations.isCreating = true;
        state.error = null;
      })
      .addCase(createNotificationService.fulfilled, (state, action) => {
        state.operations.isCreating = false;
        if (state.data) {
          state.data.content = [action.payload, ...state.data.content];
          state.data.totalElements += 1;
          state.data.totalPages = Math.ceil(
            state.data.totalElements / state.data.pageSize
          );
        }
      })
      .addCase(createNotificationService.rejected, (state, action) => {
        state.operations.isCreating = false;
        state.error = action.payload as string;
      });

    // Update notification to read handlers
    builder
      .addCase(updateNotificationReadService.pending, (state) => {
        state.operations.isUpdating = true;
        state.error = null;
      })
      .addCase(updateNotificationReadService.fulfilled, (state, action) => {
        state.operations.isUpdating = false;
        state.selectedNotification = action.payload;

        if (state.data) {
          state.data.content = state.data.content.map((notification) =>
            notification.id === action.payload.id
              ? action.payload
              : notification
          );
        }
      })
      .addCase(updateNotificationReadService.rejected, (state, action) => {
        state.operations.isUpdating = false;
        state.error = action.payload as string;
      });

    builder
      .addCase(updateNotificationMakeAllReadService.pending, (state) => {
        state.operations.isUpdating = true;
        state.error = null;
      })
      .addCase(
        updateNotificationMakeAllReadService.fulfilled,
        (state, action) => {
          state.operations.isUpdating = false;
          state.selectedNotification = action.payload;

          if (state.data) {
            state.data.content = state.data.content.map((notification) => ({
              ...notification,
              isRead: true,
              readAt: notification.readAt ?? new Date().toISOString(),
            }));
          }
        }
      )
      .addCase(
        updateNotificationMakeAllReadService.rejected,
        (state, action) => {
          state.operations.isUpdating = false;
          state.error = action.payload as string;
        }
      );

    // Update notification to seeen handlers
    builder
      .addCase(updateNotificationMakeAllSeenService.pending, (state) => {
        state.operations.isUpdating = true;
        state.error = null;
      })
      .addCase(
        updateNotificationMakeAllSeenService.fulfilled,
        (state, action) => {
          state.operations.isUpdating = false;
          state.unSeenCount = 0;

          if (state.data) {
            state.data.content = state.data.content.map((notification) => ({
              ...notification,
              isSeen: true,
              seenAt: notification.seenAt ?? new Date().toISOString(),
            }));
          }
        }
      )
      .addCase(
        updateNotificationMakeAllSeenService.rejected,
        (state, action) => {
          state.operations.isUpdating = false;
          state.error = action.payload as string;
        }
      );

    // Delete notifications handlers
    builder
      .addCase(deleteNotificationService.pending, (state) => {
        state.operations.isDeleting = true;
        state.error = null;
      })
      .addCase(deleteNotificationService.fulfilled, (state, action) => {
        state.operations.isDeleting = false;
        if (state.data) {
          state.data.content = state.data.content.filter(
            (notification) => notification.id !== action.payload
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
      .addCase(deleteNotificationService.rejected, (state, action) => {
        state.operations.isDeleting = false;
        state.error = action.payload as string;
      });

    // Delete all notifications handlers
    builder
      .addCase(deleteAllNotificationService.pending, (state) => {
        state.operations.isDeleting = true;
        state.error = null;
      })
      .addCase(deleteAllNotificationService.fulfilled, (state, action) => {
        return {
          ...initialState,
          isLoading: false,
        };
      })
      .addCase(deleteAllNotificationService.rejected, (state, action) => {
        state.operations.isDeleting = false;
        state.error = action.payload as string;
      });
  },
});

export const {
  setSearchFilter,
  setPageNo,
  clearError,
  clearSelectedNotification,
  resetFilters,
  resetState,
} = notificationSlice.actions;

export default notificationSlice.reducer;
