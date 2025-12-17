"use client";

import { useEffect } from "react";
import { dateTimeFormat } from "@/utils/date/date-time-format";
import { DetailModal } from "@/components/shared/modal/detail-modal";
import {
  DetailRow,
  DetailSection,
} from "@/components/shared/modal/detail-section";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import {
  selectIsFetchingDetail,
  selectSelectedNotification,
} from "../store/selectors/notification-selector";
import { fetchNotificationByIdService } from "../store/thunks/notification-thunks";
import { clearSelectedNotification } from "../store/slice/notification-slice";
import { convertEnumOrString } from "@/utils/common/enum-convert";

interface NotificationDetailModalProps {
  notificationId?: string;
  isOpen: boolean;
  onClose: () => void;
}

export function AllNotificationDetailModal({
  notificationId,
  isOpen,
  onClose,
}: NotificationDetailModalProps) {
  const dispatch = useAppDispatch();

  // Use SEPARATE loading state - won't affect main page
  const isFetchingDetail = useAppSelector(selectIsFetchingDetail);

  // Get selected user from Redux
  const notificationData = useAppSelector(selectSelectedNotification);

  useEffect(() => {
    const fetctNotificationData = async () => {
      if (!notificationId || !isOpen) return;

      try {
        await dispatch(fetchNotificationByIdService(notificationId)).unwrap();
      } catch (error: any) {
        console.error("Error fetching commune data:", error);
      }
    };

    fetctNotificationData();
  }, [notificationId, isOpen, dispatch]);

  const handleClose = () => {
    dispatch(clearSelectedNotification());
    onClose();
  };

  return (
    <DetailModal
      isOpen={isOpen}
      onClose={handleClose}
      isLoading={isFetchingDetail}
      title={"Notification Details"}
      description={
        notificationData?.title || "Loading notification information..."
      }
    >
      {notificationData ? (
        <div className="space-y-6">
          {/* Notification Information */}
          <DetailSection title="Commune Information">
            <DetailRow label="Title" value={notificationData?.title || "---"} />

            <DetailRow
              label="Message"
              value={notificationData?.message || "---"}
            />

            <DetailRow
              label="Message Type"
              value={
                convertEnumOrString(notificationData?.messageType) || "---"
              }
            />

            <DetailRow
              label="Priority"
              value={convertEnumOrString(notificationData?.priority) || "---"}
            />

            <DetailRow
              label="Status"
              value={convertEnumOrString(notificationData?.status) || "---"}
            />

            <DetailRow
              label="Recipient Type"
              value={
                convertEnumOrString(notificationData?.recipientType) || "---"
              }
            />

            <DetailRow
              label="user Id"
              value={notificationData?.userId || "---"}
            />

            <DetailRow
              label="User Name"
              value={notificationData?.userName || "---"}
            />

            <DetailRow
              label="Business Id"
              value={notificationData?.businessId || "---"}
            />

            <DetailRow
              label="Group Id"
              value={notificationData?.groupId || "---"}
            />

            <DetailRow
              label="Is Seen"
              value={notificationData?.isSeen || "---"}
            />

            <DetailRow
              label="Seen At"
              value={dateTimeFormat(notificationData?.seenAt ?? "- - -")}
            />

            <DetailRow
              label="Is Read"
              value={notificationData?.isRead || "---"}
            />

            <DetailRow
              label="Read At"
              value={dateTimeFormat(notificationData?.readAt ?? "- - - ")}
            />
          </DetailSection>

          {/* System Information */}
          <DetailSection title="System Information">
            <DetailRow
              label="Notification ID"
              value={
                <span className="text-xs font-mono bg-muted px-2 py-1 rounded">
                  {notificationData?.id}
                </span>
              }
            />
            <DetailRow
              label="Created At"
              value={dateTimeFormat(notificationData?.createdAt ?? "")}
            />
            <DetailRow
              label="Created By"
              value={notificationData?.createdBy || "---"}
            />
            <DetailRow
              label="Last Updated"
              value={dateTimeFormat(notificationData?.updatedAt ?? "")}
            />
            <DetailRow
              label="Updated By"
              value={notificationData?.updatedBy || "---"}
              isLast
            />
          </DetailSection>
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            No notification data available
          </p>
        </div>
      )}
    </DetailModal>
  );
}
