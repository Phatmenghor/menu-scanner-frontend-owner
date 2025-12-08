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
  selectSelectedUser,
  selectIsFetchingDetail,
} from "../store/selectors/users-selectors";

interface UserDetailModalProps {
  userId?: string;
  isOpen: boolean;
  onClose: () => void;
}

export function UserBusinessDetailModal({
  userId,
  isOpen,
  onClose,
}: UserDetailModalProps) {
  const dispatch = useAppDispatch();

  // Use SEPARATE loading state - won't affect main page
  const isFetchingDetail = useAppSelector(selectIsFetchingDetail);

  // Get selected user from Redux
  const userData = useAppSelector(selectSelectedUser);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!userId || !isOpen) return;

      try {
        await dispatch(fetchUserByIdService(userId)).unwrap();
      } catch (error: any) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, [userId, isOpen, dispatch]);

  const handleClose = () => {
    dispatch(clearSelectedUser());
    onClose();
  };

  return (
    <DetailModal
      isOpen={isOpen}
      onClose={handleClose}
      isLoading={isFetchingDetail}
      title={userData?.fullName || "User Details"}
      description={userData?.email || "Loading user information..."}
      avatarUrl={userData?.profileImageUrl}
      avatarName={userData?.firstName}
      badges={
        userData && (
          <>
            <Badge
              variant="outline"
              className={getUserTypeColor(userData?.userType ?? null)}
            >
              {getUserTypeIcon(userData?.userType ?? null)}
              <span className="ml-1.5">
                {formatEnumToDisplay(userData?.userType ?? "")}
              </span>
            </Badge>
            <Badge
              variant="outline"
              className={getStatusColor(userData?.accountStatus ?? "")}
            >
              {formatEnumToDisplay(userData?.accountStatus ?? "")}
            </Badge>
          </>
        )
      }
    >
      {userData ? (
        <div className="space-y-6">
          {/* Personal Information */}
          <DetailSection title="Personal Information">
            <DetailRow label="Full Name" value={userData?.fullName || "---"} />

            <DetailRow label="Email" value={userData?.email || "---"} />

            <DetailRow
              label="Phone Number"
              value={userData?.phoneNumber || "---"}
            />

            <DetailRow label="Position" value={userData?.position || "---"} />

            <DetailRow
              label="Address"
              value={userData?.address || "---"}
              isLast
            />

            <DetailRow
              label="User Identifier"
              value={userData?.userIdentifier || "---"}
            />

            <DetailRow
              label="User Type"
              value={
                <Badge
                  variant="outline"
                  className={getUserTypeColor(userData?.userType ?? null)}
                >
                  {getUserTypeIcon(userData?.userType ?? null)}
                  <span className="ml-1.5">
                    {formatEnumToDisplay(userData?.userType ?? "")}
                  </span>
                </Badge>
              }
            />

            <DetailRow
              label="Account Status"
              value={
                <Badge
                  variant="outline"
                  className={getStatusColor(userData?.accountStatus ?? "")}
                >
                  {formatEnumToDisplay(userData?.accountStatus ?? "")}
                </Badge>
              }
              isLast={!userData?.businessName}
            />

            {userData?.businessName && (
              <DetailRow
                label="Business"
                value={userData?.businessName}
                isLast
              />
            )}

            {userData?.roles && userData?.roles.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {userData?.roles?.map((role, index) => (
                  <Badge
                    key={index}
                    variant="outline"
                    className={getUserRoleColor(role)}
                  >
                    {formatEnumToDisplay(role)}
                  </Badge>
                ))}
              </div>
            )}

            {/* Notes */}
            {userData?.notes && (
              <p className="text-sm text-muted-foreground bg-muted/50 p-3 rounded-md">
                {userData?.notes}
              </p>
            )}
          </DetailSection>

          {/* System Information */}
          <DetailSection title="System Information">
            <DetailRow
              label="User ID"
              value={
                <span className="text-xs font-mono bg-muted px-2 py-1 rounded">
                  {userData?.id}
                </span>
              }
            />
            <DetailRow
              label="Created At"
              value={dateTimeFormat(userData?.createdAt ?? "")}
            />
            <DetailRow
              label="Created By"
              value={userData?.createdBy || "---"}
            />
            <DetailRow
              label="Last Updated"
              value={dateTimeFormat(userData?.updatedAt ?? "")}
            />
            <DetailRow
              label="Updated By"
              value={userData?.updatedBy || "---"}
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
