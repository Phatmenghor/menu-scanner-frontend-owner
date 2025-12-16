"use client";

import { useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { dateTimeFormat } from "@/utils/date/date-time-format";
import { DetailModal } from "@/components/shared/modal/detail-modal";
import {
  DetailRow,
  DetailSection,
} from "@/components/shared/modal/detail-section";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import {
  selectIsFetchingDetail,
  selectSelectedSubscription,
} from "../store/selectors/subscription-selector";
import { fetchSubscriptionByIdService } from "../store/thunks/subscription-thunks";
import { clearSelectedSubscription } from "../store/slice/subscription-slice";

interface SubscriptionDetailModalProps {
  subscriptionId?: string;
  isOpen: boolean;
  onClose: () => void;
}

export function SubscriptionDetailModal({
  subscriptionId,
  isOpen,
  onClose,
}: SubscriptionDetailModalProps) {
  const dispatch = useAppDispatch();

  // Use SEPARATE loading state - won't affect main page
  const isFetchingDetail = useAppSelector(selectIsFetchingDetail);

  // Get selected subscription from Redux
  const subscriptionData = useAppSelector(selectSelectedSubscription);

  useEffect(() => {
    const fetchSubscriptionData = async () => {
      if (!subscriptionId || !isOpen) return;

      try {
        await dispatch(fetchSubscriptionByIdService(subscriptionId)).unwrap();
      } catch (error: any) {
        console.error("Error fetching subscription data:", error);
      }
    };

    fetchSubscriptionData();
  }, [subscriptionId, isOpen, dispatch]);

  const handleClose = () => {
    dispatch(clearSelectedSubscription());
    onClose();
  };

  return (
    <DetailModal
      isOpen={isOpen}
      onClose={handleClose}
      isLoading={isFetchingDetail}
      title={"Subscription Details"}
      description={
        subscriptionData?.businessName || "Loading subscrition information..."
      }
    >
      {subscriptionData ? (
        <div className="space-y-6">
          {/* Subscription Information */}
          <DetailSection title="Subscription Information">
            <DetailRow
              label="Business Name"
              value={subscriptionData?.businessName || "---"}
            />

            <DetailRow
              label="Plan Name"
              value={subscriptionData?.planName || "---"}
            />

            <DetailRow
              label="Plan Price"
              value={subscriptionData?.planPrice || "---"}
            />

            <DetailRow
              label="Plan DurationDays"
              value={subscriptionData?.planDurationDays || "---"}
            />

            <DetailRow
              label="Start Date"
              value={dateTimeFormat(subscriptionData?.startDate ?? "")}
            />

            <DetailRow
              label="End Date"
              value={dateTimeFormat(subscriptionData?.endDate ?? "")}
            />

            <DetailRow
              label="Auto Renew"
              value={subscriptionData?.autoRenew || "---"}
            />

            <DetailRow
              label="Days Remaining"
              value={subscriptionData?.daysRemaining || "---"}
            />

            <DetailRow
              label="Status"
              value={subscriptionData?.status || "---"}
            />

            <DetailRow
              label="Payment Amount"
              value={subscriptionData?.paymentAmount || "---"}
            />

            <DetailRow
              label="Payment Status"
              value={subscriptionData?.paymentStatus || "---"}
            />
          </DetailSection>

          {/* System Information */}
          <DetailSection title="System Information">
            <DetailRow
              label="Subscription ID"
              value={
                <span className="text-xs font-mono bg-muted px-2 py-1 rounded">
                  {subscriptionData?.id}
                </span>
              }
            />
            <DetailRow
              label="Created At"
              value={dateTimeFormat(subscriptionData?.createdAt ?? "")}
            />
            <DetailRow
              label="Created By"
              value={subscriptionData?.createdBy || "---"}
            />
            <DetailRow
              label="Last Updated"
              value={dateTimeFormat(subscriptionData?.updatedAt ?? "")}
            />
            <DetailRow
              label="Updated By"
              value={subscriptionData?.updatedBy || "---"}
              isLast
            />
          </DetailSection>
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            No subscription data available
          </p>
        </div>
      )}
    </DetailModal>
  );
}
