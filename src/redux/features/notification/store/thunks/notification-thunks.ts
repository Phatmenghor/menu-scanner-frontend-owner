/**
 * Notification Management - Async Thunks
 * Redux thunks for Notification CRUD operations
 */

import { axiosClientWithAuth } from "@/utils/axios";
import { createApiThunk } from "@/utils/axios/apiWrapper";
import {
  AllNotificationRequest,
  CreateNotificationRequest,
  UpdateNotificationParams,
} from "../models/request/notification-request";

/**
 * Fetch all notifications
 */
export const fetchAllNotificationService = createApiThunk<
  any,
  AllNotificationRequest
>("notifications/fetchAll", async (params) => {
  const response = await axiosClientWithAuth.post(
    "/api/v1/notifications/all",
    params
  );
  return response.data.data;
});

/**
 * Fetch my notifications
 */
export const fetchMyNotificationService = createApiThunk<
  any,
  AllNotificationRequest
>("notifications/my", async (params) => {
  const response = await axiosClientWithAuth.post(
    "/api/v1/notifications/my",
    params
  );
  return response.data.data;
});

/**
 * Fetch notifications by ID
 */
export const fetchNotificationByIdService = createApiThunk<any, string>(
  "notifications/fetchById",
  async (notificationId) => {
    const response = await axiosClientWithAuth.get(
      `/api/v1/notifications/${notificationId}`
    );
    return response.data.data;
  }
);

/**
 * Fetch notifications unread count
 */
export const fetchNotificationUnReadCountervice = createApiThunk<any>(
  "notifications/unread-count",
  async () => {
    const response = await axiosClientWithAuth.get(
      `/api/v1/notifications/unread-count`
    );
    return response.data.data;
  }
);

/**
 * Fetch notifications unseen count
 */
export const fetchNotificationUnSeenCountService = createApiThunk<any>(
  "notifications/unseen-count",
  async () => {
    const response = await axiosClientWithAuth.get(
      `/api/v1/notifications/unseen-count`
    );
    return response.data.data;
  }
);

/**
 * Create notifications
 */
export const createNotificationService = createApiThunk<
  any,
  CreateNotificationRequest
>("notifications/create", async (notificationData) => {
  const response = await axiosClientWithAuth.post(
    "/api/v1/notifications",
    notificationData
  );
  return response.data.data;
});

/**
 * Update notifications read
 */
export const updateNotificationReadService = createApiThunk<
  any,
  UpdateNotificationParams
>("notifications/read", async ({ notificationId }) => {
  const response = await axiosClientWithAuth.put(
    `/api/v1/notifications/${notificationId}/read`
  );
  return response.data.data;
});

/**
 * Update notifications make all read
 */
export const updateNotificationMakeAllReadService = createApiThunk<any>(
  "notifications/make-all-read",
  async () => {
    const response = await axiosClientWithAuth.put(
      `/api/v1/notifications/make-all-read`
    );
    return response.data.data;
  }
);

/**
 * Update notifications make all seen
 */
export const updateNotificationMakeAllSeenService = createApiThunk<any>(
  "notifications/make-all-seen",
  async () => {
    const response = await axiosClientWithAuth.put(
      `/api/v1/notifications/make-all-seen`
    );
    return response.data.data;
  }
);

/**
 * Delete notifications
 */
export const deleteNotificationService = createApiThunk<any, string>(
  "notifications/delete",
  async (notificationId) => {
    const response = await axiosClientWithAuth.delete(
      `/api/v1/notifications/${notificationId}`
    );
    return response.data.data;
  }
);

/**
 * Delete notifications
 */
export const deleteAllNotificationService = createApiThunk<any>(
  "notifications/delete-all",
  async () => {
    const response = await axiosClientWithAuth.delete(
      `/api/v1/notifications/delete-all`
    );
    return response.data.data;
  }
);
