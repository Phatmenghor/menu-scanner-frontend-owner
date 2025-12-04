"use client";

import type React from "react";
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { UserModel } from "@/models/dashboard/user/plateform-user/user.response";
import { getUserByIdService } from "@/services/dashboard/user/plateform-user/plateform-user.service";
import Loading from "@/components/shared/common/loading";
import {
  getUserRoleColor,
  getStatusColor,
  getUserTypeColor,
  getUserTypeIcon,
  formatEnumToDisplay,
} from "@/utils/styles/enum-style";
import { dateTimeFormat } from "@/utils/date/date-time-format";
import { CustomAvatar } from "@/components/shared/common/custom-avator";

interface UserDetailSheetProps {
  userId?: string;
  isOpen: boolean;
  onClose: () => void;
}

export function UserCustomerDetailModal({
  userId,
  isOpen,
  onClose,
}: UserDetailSheetProps) {
  const [userData, setUserData] = useState<UserModel | null>(null);
  const [isLoadingData, setIsLoadingData] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!userId || !isOpen) return;

      setIsLoadingData(true);
      try {
        const data = await getUserByIdService(userId);
        setUserData(data);
      } catch (error: any) {
        console.error("Error fetching user platform data:", error);
      } finally {
        setIsLoadingData(false);
      }
    };

    fetchUserData();
  }, [userId, isOpen]);

  const handleClose = () => {
    setUserData(null);
    onClose();
  };

  const profileImageUrl =
    userData?.profileImageUrl && process.env.NEXT_PUBLIC_API_BASE_URL
      ? `${process.env.NEXT_PUBLIC_API_BASE_URL}${userData.profileImageUrl}`
      : undefined;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl h-[90vh] p-0 gap-0 flex flex-col">
        {/* Header */}
        <DialogHeader className="px-6 py-4 border-b bg-muted/30 flex-shrink-0">
          <div className="flex items-center gap-4 pr-8">
            <CustomAvatar
              imageUrl={userData?.profileImageUrl}
              name={userData?.firstName}
              size="xl"
            />

            <div className="flex-1">
              <DialogTitle className="text-xl font-semibold">
                {userData?.fullName || "User Details"}
              </DialogTitle>
              <DialogDescription className="text-sm text-muted-foreground">
                {userData?.email || "Loading user information..."}
              </DialogDescription>
              {userData && (
                <div className="flex items-center gap-2 mt-2">
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
                </div>
              )}
            </div>
          </div>
        </DialogHeader>

        {/* Content */}
        <ScrollArea className="flex-1 min-h-0">
          <div className="p-6">
            {/* Loading State */}
            {isLoadingData ? (
              <Loading />
            ) : userData ? (
              <div className="space-y-6">
                {/* Personal Information */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-1 h-6 bg-primary rounded-full"></div>
                    <h3 className="text-base font-semibold">
                      Personal Information
                    </h3>
                  </div>

                  <div className="grid gap-3">
                    <div className="flex items-start justify-between py-2 border-b border-border/40">
                      <Label className="text-sm font-medium text-muted-foreground">
                        Full Name
                      </Label>
                      <span className="text-sm font-medium text-right">
                        {userData?.fullName || "---"}
                      </span>
                    </div>

                    <div className="flex items-start justify-between py-2 border-b border-border/40">
                      <Label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                        Email
                      </Label>
                      <span className="text-sm text-right">
                        {userData?.email || "---"}
                      </span>
                    </div>

                    <div className="flex items-start justify-between py-2 border-b border-border/40">
                      <Label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                        Phone Number
                      </Label>
                      <span className="text-sm text-right">
                        {userData?.phoneNumber || "---"}
                      </span>
                    </div>

                    <div className="flex items-start justify-between py-2 border-b border-border/40">
                      <Label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                        Position
                      </Label>
                      <span className="text-sm text-right">
                        {userData?.position || "---"}
                      </span>
                    </div>

                    <div className="flex items-start justify-between py-2 border-b border-border/40">
                      <Label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                        Address
                      </Label>
                      <span className="text-sm text-right max-w-[350px]">
                        {userData?.address || "---"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Account Information */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-1 h-6 bg-primary rounded-full"></div>
                    <h3 className="text-base font-semibold">
                      Account Information
                    </h3>
                  </div>

                  <div className="grid gap-3">
                    <div className="flex items-start justify-between py-2 border-b border-border/40">
                      <Label className="text-sm font-medium text-muted-foreground">
                        User Identifier
                      </Label>
                      <span className="text-sm text-right">
                        {userData?.userIdentifier || "---"}
                      </span>
                    </div>

                    <div className="flex items-start justify-between py-2 border-b border-border/40">
                      <Label className="text-sm font-medium text-muted-foreground">
                        User Type
                      </Label>
                      <Badge
                        variant="outline"
                        className={getUserTypeColor(userData?.userType ?? null)}
                      >
                        {getUserTypeIcon(userData?.userType ?? null)}
                        <span className="ml-1.5">
                          {formatEnumToDisplay(userData?.userType ?? "")}
                        </span>
                      </Badge>
                    </div>

                    <div className="flex items-start justify-between py-2 border-b border-border/40">
                      <Label className="text-sm font-medium text-muted-foreground">
                        Account Status
                      </Label>
                      <Badge
                        variant="outline"
                        className={getStatusColor(
                          userData?.accountStatus ?? ""
                        )}
                      >
                        {formatEnumToDisplay(userData?.accountStatus ?? "")}
                      </Badge>
                    </div>

                    {userData?.businessName && (
                      <div className="flex items-start justify-between py-2 border-b border-border/40">
                        <Label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                          Business
                        </Label>
                        <span className="text-sm text-right">
                          {userData?.businessName}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Roles */}
                {userData?.roles && userData?.roles.length > 0 && (
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-1 h-6 bg-primary rounded-full"></div>
                      <h3 className="text-base font-semibold">
                        Assigned Roles
                      </h3>
                    </div>

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
                  </div>
                )}

                {/* Additional Notes */}
                {userData?.notes && (
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-1 h-6 bg-primary rounded-full"></div>
                      <h3 className="text-base font-semibold">Notes</h3>
                    </div>
                    <p className="text-sm text-muted-foreground bg-muted/50 p-3 rounded-md">
                      {userData?.notes}
                    </p>
                  </div>
                )}

                {/* System Information */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-1 h-6 bg-primary rounded-full"></div>
                    <h3 className="text-base font-semibold">
                      System Information
                    </h3>
                  </div>

                  <div className="grid gap-3">
                    <div className="flex items-start justify-between py-2 border-b border-border/40">
                      <Label className="text-sm font-medium text-muted-foreground">
                        User ID
                      </Label>
                      <span className="text-xs font-mono bg-muted px-2 py-1 rounded">
                        {userData?.id}
                      </span>
                    </div>

                    <div className="flex items-start justify-between py-2 border-b border-border/40">
                      <Label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                        Created At
                      </Label>
                      <span className="text-sm text-right">
                        {dateTimeFormat(userData?.createdAt ?? "")}
                      </span>
                    </div>

                    <div className="flex items-start justify-between py-2 border-b border-border/40">
                      <Label className="text-sm font-medium text-muted-foreground">
                        Created By
                      </Label>
                      <span className="text-sm text-right">
                        {userData?.createdBy || "---"}
                      </span>
                    </div>

                    <div className="flex items-start justify-between py-2 border-b border-border/40">
                      <Label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                        Last Updated
                      </Label>
                      <span className="text-sm text-right">
                        {dateTimeFormat(userData?.updatedAt ?? "")}
                      </span>
                    </div>

                    <div className="flex items-start justify-between py-2">
                      <Label className="text-sm font-medium text-muted-foreground">
                        Updated By
                      </Label>
                      <span className="text-sm text-right">
                        {userData?.updatedBy || "---"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No user data available</p>
              </div>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
