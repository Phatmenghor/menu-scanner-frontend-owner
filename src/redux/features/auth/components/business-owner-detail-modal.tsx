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
  selectSelectedBusinessOwner,
} from "../store/selectors/business-owner-selectors";
import { fetchBusinessOwnerByIdService } from "../store/thunks/business-owner-thunks";
import { clearSelectedBusinessOwner } from "../store/slice/business-owner-slice";

interface BusinessOwnerDetailModalProps {
  businessOwnerId?: string;
  isOpen: boolean;
  onClose: () => void;
}

export function BusinessOwnerDetailModal({
  businessOwnerId,
  isOpen,
  onClose,
}: BusinessOwnerDetailModalProps) {
  const dispatch = useAppDispatch();

  // Use SEPARATE loading state - won't affect main page
  const isFetchingDetail = useAppSelector(selectIsFetchingDetail);

  // Get selected business Owner from Redux
  const businessOwnerData = useAppSelector(selectSelectedBusinessOwner);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!businessOwnerId || !isOpen) return;

      try {
        await dispatch(fetchBusinessOwnerByIdService(businessOwnerId)).unwrap();
      } catch (error: any) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, [businessOwnerId, isOpen, dispatch]);

  const handleClose = () => {
    dispatch(clearSelectedBusinessOwner());
    onClose();
  };

  return (
    <DetailModal
      isOpen={isOpen}
      onClose={handleClose}
      isLoading={isFetchingDetail}
      title={"Businesss Owner Details"}
      description={
        businessOwnerData?.ownerFullName ||
        "Loading business Owner information..."
      }
      avatarUrl={businessOwnerData?.ownerProfileImageUrl}
      avatarName={businessOwnerData?.ownerFullName}
    >
      {businessOwnerData ? (
        <div className="space-y-6">
          {/* Personal Information */}
          <DetailSection title="Owner Information">
            <DetailRow
              label="User Identifier"
              value={businessOwnerData?.ownerId || "---"}
            />

            <DetailRow
              label="Full Name"
              value={businessOwnerData?.ownerUserIdentifier || "---"}
            />

            <DetailRow
              label="Email"
              value={businessOwnerData?.ownerEmail || "---"}
            />

            <DetailRow
              label="Phone Number"
              value={businessOwnerData?.ownerFullName || "---"}
            />

            <DetailRow
              label="Position"
              value={businessOwnerData?.ownerPhone || "---"}
            />

            <DetailRow
              label="Address"
              value={businessOwnerData?.ownerAccountStatus || "---"}
              isLast
            />
          </DetailSection>

          <DetailSection title="Business Information">
            <DetailRow
              label="Full Name"
              value={businessOwnerData?.businessId || "---"}
            />

            <DetailRow
              label="Email"
              value={businessOwnerData?.businessName || "---"}
            />

            <DetailRow
              label="Phone Number"
              value={businessOwnerData?.businessEmail || "---"}
            />

            <DetailRow
              label="Position"
              value={businessOwnerData?.businessPhone || "---"}
            />

            <DetailRow
              label="Address"
              value={businessOwnerData?.businessAddress || "---"}
              isLast
            />

            <DetailRow
              label="User Identifier"
              value={businessOwnerData?.businessStatus || "---"}
            />
          </DetailSection>

          <DetailSection title="Other Information">
            <DetailRow
              label="Full Name"
              value={businessOwnerData?.isSubscriptionActive || "---"}
            />

            <DetailRow
              label="Email"
              value={dateTimeFormat(businessOwnerData?.businessCreatedAt ?? "")}
            />

            <DetailRow
              label="Phone Number"
              value={businessOwnerData?.currentSubscriptionId || "---"}
            />

            <DetailRow
              label="Position"
              value={businessOwnerData?.currentPlanName || "---"}
            />

            <DetailRow
              label="Address"
              value={businessOwnerData?.currentPlanPrice || "---"}
              isLast
            />

            <DetailRow
              label="User Identifier"
              value={businessOwnerData?.currentPlanDurationDays || "---"}
            />

            <DetailRow
              label="Email"
              value={dateTimeFormat(
                businessOwnerData?.subscriptionStartDate ?? ""
              )}
            />

            <DetailRow
              label="Email"
              value={dateTimeFormat(
                businessOwnerData?.subscriptionEndDate ?? ""
              )}
            />

            <DetailRow
              label="User Identifier"
              value={businessOwnerData?.daysRemaining || "---"}
            />

            <DetailRow
              label="User Identifier"
              value={businessOwnerData?.daysActive || "---"}
            />

            <DetailRow
              label="User Identifier"
              value={businessOwnerData?.subscriptionStatus || "---"}
            />

            <DetailRow
              label="User Identifier"
              value={businessOwnerData?.autoRenew || "---"}
            />

            <DetailRow
              label="User Identifier"
              value={businessOwnerData?.isExpiringSoon || "---"}
            />
          </DetailSection>

          <DetailSection title="Payment Information">
            <DetailRow
              label="Full Name"
              value={businessOwnerData?.totalPaid || "---"}
            />

            <DetailRow
              label="Phone Number"
              value={businessOwnerData?.totalPending || "---"}
            />

            <DetailRow
              label="Position"
              value={businessOwnerData?.totalPayments || "---"}
            />

            <DetailRow
              label="Address"
              value={businessOwnerData?.completedPayments || "---"}
            />

            <DetailRow
              label="Address"
              value={businessOwnerData?.pendingPayments || "---"}
            />

            <DetailRow
              label="Address"
              value={businessOwnerData?.paymentStatus || "---"}
            />

            <DetailRow
              label="Created At"
              value={dateTimeFormat(businessOwnerData?.lastPaymentDate ?? "")}
            />
          </DetailSection>

          {/* System Information */}
          <DetailSection title="System Information">
            <DetailRow
              label="User ID"
              value={
                <span className="text-xs font-mono bg-muted px-2 py-1 rounded">
                  {businessOwnerData?.id}
                </span>
              }
            />
            <DetailRow
              label="Created At"
              value={dateTimeFormat(businessOwnerData?.createdAt ?? "")}
            />
            <DetailRow
              label="Created By"
              value={businessOwnerData?.createdBy || "---"}
            />
            <DetailRow
              label="Last Updated"
              value={dateTimeFormat(businessOwnerData?.updatedAt ?? "")}
            />
            <DetailRow
              label="Updated By"
              value={businessOwnerData?.updatedBy || "---"}
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
