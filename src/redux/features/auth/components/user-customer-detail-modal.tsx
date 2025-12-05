"use client";

import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { UserModel } from "@/models/dashboard/user/plateform-user/user.response";
import { getUserByIdService } from "@/services/dashboard/user/plateform-user/plateform-user.service";
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

interface UserDetailModalProps {
  userId?: string;
  isOpen: boolean;
  onClose: () => void;
}

export function UserCustomerDetailModal({
  userId,
  isOpen,
  onClose,
}: UserDetailModalProps) {
  const [userData, setUserData] = useState<UserModel | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!userId || !isOpen) return;

      setIsLoading(true);
      try {
        const data = await getUserByIdService(userId);
        setUserData(data);
      } catch (error: any) {
        console.error("Error fetching user data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [userId, isOpen]);

  const handleClose = () => {
    setUserData(null);
    onClose();
  };

  return (
    <DetailModal
      isOpen={isOpen}
      onClose={handleClose}
      isLoading={isLoading}
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
          </DetailSection>

          {/* Account Information */}
          <DetailSection title="Account Information">
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
          </DetailSection>

          {/* Roles */}
          {userData?.roles && userData?.roles.length > 0 && (
            <DetailSection title="Assigned Roles">
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
            </DetailSection>
          )}

          {/* Notes */}
          {userData?.notes && (
            <DetailSection title="Notes">
              <p className="text-sm text-muted-foreground bg-muted/50 p-3 rounded-md">
                {userData?.notes}
              </p>
            </DetailSection>
          )}

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
