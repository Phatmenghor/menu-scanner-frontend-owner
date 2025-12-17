import { ActionButton } from "@/components/button/action-button";
import { indexDisplay } from "@/utils/common/common";
import { dateTimeFormat } from "@/utils/date/date-time-format";
import { Edit, Eye, Trash } from "lucide-react";
import { TableColumn } from "@/components/shared/common/data-table";
import {
  AllNotificationResponseModel,
  NotificationResponseModel,
} from "../store/models/response/notification-response";
import { convertEnumOrString } from "@/utils/common/enum-convert";

interface NotificationTableHandlers {
  handleNotificationViewDetail: (commune: NotificationResponseModel) => void;
  handleDeleteNotification: (commune: NotificationResponseModel) => void;
}

interface NotificationTableOptions {
  data: AllNotificationResponseModel | null;
  handlers: NotificationTableHandlers;
}

export const myNotificationTableColumns = ({
  data,
  handlers,
}: NotificationTableOptions): TableColumn<NotificationResponseModel>[] => {
  const { handleNotificationViewDetail, handleDeleteNotification } = handlers;

  return [
    {
      key: "index",
      label: "#",
      minWidth: "10px",
      maxWidth: "400px",
      render: (_, index) => (
        <span className="font-medium">
          {indexDisplay(data?.pageNo || 1, data?.pageSize || 10, index + 1)}
        </span>
      ),
    },
    {
      key: "title",
      label: "Title",
      minWidth: "10px",
      maxWidth: "400px",
      truncate: true,
      render: (notification) => (
        <span className="text-xs text-muted-foreground">
          {notification?.title || "---"}
        </span>
      ),
    },
    {
      key: "message",
      label: "Message",
      minWidth: "10px",
      maxWidth: "400px",
      truncate: true,
      render: (notification) => (
        <span className="text-xs text-muted-foreground">
          {notification?.message || "---"}
        </span>
      ),
    },

    {
      key: "status",
      label: "Status",
      minWidth: "10px",
      maxWidth: "400px",
      truncate: true,
      render: (notification) => (
        <span className="text-xs text-muted-foreground">
          {convertEnumOrString(notification?.status) || "---"}
        </span>
      ),
    },

    {
      key: "recipientType",
      label: "Recipient Type",
      minWidth: "10px",
      maxWidth: "400px",
      truncate: true,
      render: (notification) => (
        <span className="text-xs text-muted-foreground">
          {convertEnumOrString(notification?.recipientType) || "---"}
        </span>
      ),
    },

    {
      key: "isRead",
      label: "Is Read",
      minWidth: "10px",
      maxWidth: "400px",
      truncate: true,
      render: (notification) => (
        <span className="text-xs text-muted-foreground">
          {notification?.isRead || "---"}
        </span>
      ),
    },

    {
      key: "readAt",
      label: "Read At",
      minWidth: "10px",
      maxWidth: "400px",
      truncate: true,
      render: (notification) => (
        <span className="text-xs text-muted-foreground">
          {dateTimeFormat(notification?.readAt)}
        </span>
      ),
    },

    {
      key: "isSeen",
      label: "Is Seen",
      minWidth: "10px",
      maxWidth: "400px",
      truncate: true,
      render: (notification) => (
        <span className="text-xs text-muted-foreground">
          {notification?.isSeen || "---"}
        </span>
      ),
    },

    {
      key: "seenAt",
      label: "Seen At",
      minWidth: "10px",
      maxWidth: "400px",
      truncate: true,
      render: (notification) => (
        <span className="text-xs text-muted-foreground">
          {dateTimeFormat(notification?.seenAt)}
        </span>
      ),
    },
    {
      key: "createdAt",
      label: "Created At",
      minWidth: "10px",
      maxWidth: "400px",
      render: (notification) => (
        <span className="text-sm text-muted-foreground">
          {dateTimeFormat(notification?.createdAt)}
        </span>
      ),
    },

    {
      key: "actions",
      label: "Actions",
      minWidth: "10px",
      maxWidth: "400px",
      render: (notification) => (
        <div className="flex items-center gap-2">
          <ActionButton
            icon={<Eye className="w-4 h-4" />}
            tooltip="View Details"
            onClick={() => handleNotificationViewDetail(notification)}
          />
          <ActionButton
            icon={<Trash className="w-4 h-4" />}
            tooltip="Delete Notification"
            onClick={() => handleDeleteNotification(notification)}
            variant="destructive"
          />
        </div>
      ),
    },
  ];
};
