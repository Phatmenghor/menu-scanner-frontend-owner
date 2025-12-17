"use client";

import { useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { getStatusColor, formatEnumToDisplay } from "@/utils/styles/enum-style";
import { dateTimeFormat } from "@/utils/date/date-time-format";
import { DetailModal } from "@/components/shared/modal/detail-modal";
import {
  DetailRow,
  DetailSection,
} from "@/components/shared/modal/detail-section";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import { clearSelectedBusiness } from "../store/slice/business-slice";
import {
  Status,
  SubscriptionPlanStatus,
} from "@/constants/app-resource/status/status";
import {
  selectIsFetchingDetail,
  selectSelectedSubscriptionPlan,
} from "../store/selectors/subscription-plan-selector";
import { fetchSubscriptionPlanByIdService } from "../store/thunks/subscription-plan-thunks";

interface SubscriptionPlanDetailModalProps {
  planId?: string;
  isOpen: boolean;
  onClose: () => void;
}

export function SubscriptionPlanDetailModal({
  planId,
  isOpen,
  onClose,
}: SubscriptionPlanDetailModalProps) {
  const dispatch = useAppDispatch();

  // Use SEPARATE loading state - won't affect main page
  const isFetchingDetail = useAppSelector(selectIsFetchingDetail);

  // Get selected SubscriptionPlan from Redux
  const subscriptionPlanData = useAppSelector(selectSelectedSubscriptionPlan);

  useEffect(() => {
    const fetctSubscriptionPlanData = async () => {
      if (!planId || !isOpen) return;

      try {
        await dispatch(fetchSubscriptionPlanByIdService(planId)).unwrap();
      } catch (error: any) {
        console.error("Error fetching SubscriptionPlan data:", error);
      }
    };

    fetctSubscriptionPlanData();
  }, [planId, isOpen, dispatch]);

  const handleClose = () => {
    dispatch(clearSelectedBusiness());
    onClose();
  };

  return (
    <DetailModal
      isOpen={isOpen}
      onClose={handleClose}
      isLoading={isFetchingDetail}
      title={"Exchange Rate Details"}
      description={
        subscriptionPlanData?.name.toString() ||
        "Loading subscriptio plan  information..."
      }
      badges={
        subscriptionPlanData && (
          <>
            <Badge
              variant="outline"
              className={getStatusColor(
                subscriptionPlanData?.status == SubscriptionPlanStatus.PUBLIC
                  ? Status.ACTIVE
                  : Status.INACTIVE
              )}
            >
              <span className="ml-1.5">
                {formatEnumToDisplay(
                  subscriptionPlanData?.status == SubscriptionPlanStatus.PUBLIC
                    ? Status.ACTIVE
                    : Status.INACTIVE
                )}
              </span>
            </Badge>
          </>
        )
      }
    >
      {subscriptionPlanData ? (
        <div className="space-y-6">
          {/* Personal Information */}
          <DetailSection title="Personal Information">
            <DetailRow
              label="Name"
              value={subscriptionPlanData?.name || "---"}
            />

            <DetailRow
              label="Price"
              value={subscriptionPlanData?.price || "---"}
            />

            <DetailRow
              label="Duration Days"
              value={subscriptionPlanData?.durationDays || "---"}
            />

            <DetailRow
              label="Active Subscriptions Count"
              value={subscriptionPlanData?.activeSubscriptionsCount || "---"}
            />

            <DetailRow
              label="Status"
              value={
                <Badge
                  variant="outline"
                  className={getStatusColor(
                    subscriptionPlanData?.status ==
                      SubscriptionPlanStatus.PUBLIC
                      ? Status.ACTIVE
                      : Status.INACTIVE
                  )}
                >
                  <span className="ml-1.5">
                    {formatEnumToDisplay(
                      subscriptionPlanData?.status ==
                        SubscriptionPlanStatus.PUBLIC
                        ? Status.ACTIVE
                        : Status.INACTIVE
                    )}
                  </span>
                </Badge>
              }
            />

            <DetailRow
              label="Description"
              value={subscriptionPlanData?.description || "---"}
            />
          </DetailSection>

          {/* System Information */}
          <DetailSection title="System Information">
            <DetailRow
              label="Subscription Plan ID"
              value={
                <span className="text-xs font-mono bg-muted px-2 py-1 rounded">
                  {subscriptionPlanData?.id}
                </span>
              }
            />
            <DetailRow
              label="Created At"
              value={dateTimeFormat(subscriptionPlanData?.createdAt ?? "")}
            />
            <DetailRow
              label="Created By"
              value={subscriptionPlanData?.createdBy || "---"}
            />
            <DetailRow
              label="Last Updated"
              value={dateTimeFormat(subscriptionPlanData?.updatedAt ?? "")}
            />
            <DetailRow
              label="Updated By"
              value={subscriptionPlanData?.updatedBy || "---"}
              isLast
            />
          </DetailSection>
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No user data available</p>
        </div>
      )}
    </DetailModal>
  );
}
