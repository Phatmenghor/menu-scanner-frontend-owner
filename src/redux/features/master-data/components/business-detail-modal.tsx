"use client";

import { useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import {
  getUserRoleColor,
  getStatusColor,
  getUserTypeColor,
  getUserTypeIcon,
  formatEnumToDisplay,
} from "@/utils/styles/enum-style";
import { dateTimeFormat } from "@/utils/date/date-time-format";
import { DetailModal } from "@/components/shared/modal/detail-modal";
import {
  DetailRow,
  DetailSection,
} from "@/components/shared/modal/detail-section";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import { fetchUserByIdService } from "@/redux/features/auth/store/thunks/users-thunks";
import { clearSelectedUser } from "@/redux/features/auth/store/slice/users-slice";
import {
  selectIsFetchingDetail,
  selectSelectedBusiness,
} from "../store/selectors/business-selector";
import { fetchBusinessByIdService } from "../store/thunks/business-thunks";
import { clearSelectedBusiness } from "../store/slice/business-slice";

interface BusinessDetailModalProps {
  businessId?: string;
  isOpen: boolean;
  onClose: () => void;
}

export function BusinessDetailModal({
  businessId,
  isOpen,
  onClose,
}: BusinessDetailModalProps) {
  const dispatch = useAppDispatch();

  // Use SEPARATE loading state - won't affect main page
  const isFetchingDetail = useAppSelector(selectIsFetchingDetail);

  // Get selected user from Redux
  const businessData = useAppSelector(selectSelectedBusiness);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!businessId || !isOpen) return;

      try {
        await dispatch(fetchBusinessByIdService(businessId)).unwrap();
      } catch (error: any) {
        console.error("Error fetching business data:", error);
      }
    };

    fetchUserData();
  }, [businessId, isOpen, dispatch]);

  const handleClose = () => {
    dispatch(clearSelectedBusiness());
    onClose();
  };

  return (
    <DetailModal
      isOpen={isOpen}
      onClose={handleClose}
      isLoading={isFetchingDetail}
      title={businessData?.name || "Business Details"}
      description={businessData?.email || "Loading user information..."}
      avatarUrl={""}
      avatarName={businessData?.name}
      badges={
        businessData && (
          <>
            <Badge
              variant="outline"
              className={getStatusColor(businessData?.status ?? null)}
            >
              <span className="ml-1.5">
                {formatEnumToDisplay(businessData?.status ?? "")}
              </span>
            </Badge>
          </>
        )
      }
    >
      {businessData ? (
        <div className="space-y-6">
          {/* Personal Information */}
          <DetailSection title="Personal Information">
            <DetailRow label="Full Name" value={businessData?.name || "---"} />

            <DetailRow label="Email" value={businessData?.email || "---"} />

            <DetailRow
              label="Phone Number"
              value={businessData?.phone || "---"}
            />

            <DetailRow label="Address" value={businessData?.address || "---"} />

            <DetailRow
              label="Description"
              value={businessData?.description || "---"}
              isLast
            />

            <DetailRow label="Status" value={businessData?.status || "---"} />

            <DetailRow
              label="User Type"
              value={
                <Badge
                  variant="outline"
                  className={getStatusColor(businessData?.status ?? null)}
                >
                  <span className="ml-1.5">
                    {formatEnumToDisplay(businessData?.status ?? "")}
                  </span>
                </Badge>
              }
            />
          </DetailSection>

          {/* System Information */}
          <DetailSection title="System Information">
            <DetailRow
              label="Business ID"
              value={
                <span className="text-xs font-mono bg-muted px-2 py-1 rounded">
                  {businessData?.id}
                </span>
              }
            />
            <DetailRow
              label="Created At"
              value={dateTimeFormat(businessData?.createdAt ?? "")}
            />
            <DetailRow
              label="Created By"
              value={businessData?.createdBy || "---"}
            />
            <DetailRow
              label="Last Updated"
              value={dateTimeFormat(businessData?.updatedAt ?? "")}
            />
            <DetailRow
              label="Updated By"
              value={businessData?.updatedBy || "---"}
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
