import { BaseGetAllRequest } from "@/utils/common/get-all-request";

export interface AllNotificationRequest extends BaseGetAllRequest {
  messageType?: string;
  priority?: string;
  isRead?: boolean;
  recipientType?: string;
  systemNotificationsOnly?: boolean;
  userId?: string;
  businessId?: string;
}

export interface CreateNotificationRequest {
  title: string;
  message: string;
  messageType: string;
  recipientType: string;
  priority: string;
  userId: string;
  userName: string;
  businessId: string;
  sendSystemCopy: boolean;
}

export interface UpdateNotificationParams {
  notificationId: string;
}
