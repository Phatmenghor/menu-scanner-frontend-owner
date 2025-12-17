import { Pagination } from "@/utils/common/pagination";

export interface AllNotificationResponseModel extends Pagination {
  content: NotificationResponseModel[];
}

export interface NotificationResponseModel {
  id: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
  title: string;
  message: string;
  messageType: string;
  priority: string;
  status: string;
  recipientType: string;
  userId: string;
  userName: string;
  businessId: any;
  groupId: any;
  isSeen: boolean;
  seenAt: string;
  isRead: boolean;
  readAt: string;
}
