"use client";

import type React from "react";
import { useEffect, useState } from "react";
import {
  User,
  Phone,
  Mail,
  MapPin,
  Shield,
  Calendar,
  FileText,
  UserCheck,
  Users,
  Briefcase,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Crown,
  Building2,
} from "lucide-react";
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

interface UserDetailSheetProps {
  userId?: string;
  isOpen: boolean;
  onClose: () => void;
}

export function UserDetailModal({
  userId,
  isOpen,
  onClose,
}: UserDetailSheetProps) {
  const [userData, setUserData] = useState<UserModel | null>(null);
  const [isLoadingData, setIsLoadingData] = useState(false);

  // Fetch user data when userId is provided
  useEffect(() => {
    const fetchUserData = async () => {
      if (!userId || !isOpen) return;

      setIsLoadingData(true);

      try {
        const data = await getUserByIdService(userId);
        setUserData(data);
      } catch (error: any) {
        console.error("Error fetching user data:", error);
      } finally {
        setIsLoadingData(false);
      }
    };

    fetchUserData();
  }, [userId, isOpen]);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return "bg-green-100 text-green-800 border-green-200";
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "suspended":
        return "bg-red-100 text-red-800 border-red-200";
      case "inactive":
        return "bg-gray-100 text-gray-800 border-gray-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getUserTypeColor = (userType: string | null) => {
    switch (userType?.toLowerCase()) {
      case "platform_user":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "business_user":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "admin":
        return "bg-orange-100 text-orange-800 border-orange-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getRoleColor = (role: string) => {
    const colors = [
      "bg-blue-100 text-blue-800",
      "bg-green-100 text-green-800",
      "bg-purple-100 text-purple-800",
      "bg-orange-100 text-orange-800",
      "bg-pink-100 text-pink-800",
    ];
    return colors[role.length % colors.length];
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getUserTypeIcon = (userType: string | null) => {
    switch (userType?.toLowerCase()) {
      case "platform_user":
        return <Crown className="h-4 w-4" />;
      case "business_user":
        return <UserCheck className="h-4 w-4" />;
      default:
        return <User className="h-4 w-4" />;
    }
  };

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
            <Avatar className="h-12 w-12">
              <AvatarImage
                src={userData?.profileImageUrl ? profileImageUrl : ""}
                alt={userData?.fullName}
              />
              <AvatarFallback className="text-lg bg-primary/10 text-primary">
                {userData?.firstName?.[0]}
                {userData?.lastName?.[0]}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <DialogTitle className="text-xl font-semibold">
                User Details
              </DialogTitle>
              <DialogDescription className="text-base text-muted-foreground">
                {userData?.fullName
                  ? `Information for "${userData.fullName}"`
                  : "Loading user information..."}
              </DialogDescription>
              {userData && (
                <div className="flex items-center gap-2 mt-2">
                  <Badge
                    className={getStatusColor(userData?.accountStatus ?? "")}
                  >
                    {userData?.accountStatus}
                  </Badge>
                  <Badge
                    className={getUserTypeColor(userData?.userType ?? null)}
                  >
                    {getUserTypeIcon(userData?.userType ?? null)}
                    <span className="ml-1">{userData?.userType}</span>
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
                  <div className="flex items-center gap-2">
                    <div className="w-1 h-6 bg-blue-600 rounded-full"></div>
                    <h3 className="text-lg font-semibold text-foreground">
                      Personal Information
                    </h3>
                  </div>

                  <div className="space-y-3">
                    <div className="grid grid-cols-3">
                      <Label className="text-sm font-medium text-muted-foreground">
                        User Identifier:
                      </Label>
                      <span className="col-span-2 text-sm">
                        {userData?.userIdentifier || "---"}
                      </span>
                    </div>

                    <div className="grid grid-cols-3">
                      <Label className="text-sm font-medium text-muted-foreground">
                        Email:
                      </Label>
                      <span className="col-span-2 text-sm">
                        {userData?.email || "---"}
                      </span>
                    </div>

                    <div className="grid grid-cols-3">
                      <Label className="text-sm font-medium text-muted-foreground">
                        First Name:
                      </Label>
                      <span className="col-span-2 text-sm">
                        {userData?.firstName}
                      </span>
                    </div>

                    <div className="grid grid-cols-3">
                      <Label className="text-sm font-medium text-muted-foreground">
                        Last Name:
                      </Label>
                      <span className="col-span-2 text-sm">
                        {userData?.lastName}
                      </span>
                    </div>

                    <div className="grid grid-cols-3">
                      <Label className="text-sm font-medium text-muted-foreground">
                        Full Name:
                      </Label>
                      <span className="col-span-2 text-sm">
                        {userData?.fullName}
                      </span>
                    </div>

                    <div className="grid grid-cols-3">
                      <Label className="text-sm font-medium text-muted-foreground">
                        Phone Number:
                      </Label>
                      <span className="col-span-2 text-sm flex items-center gap-2">
                        <Phone className="h-4 w-4" />
                        {userData?.phoneNumber}
                      </span>
                    </div>

                    <div className="grid grid-cols-3">
                      <Label className="text-sm font-medium text-muted-foreground">
                        Position:
                      </Label>
                      <span className="col-span-2 text-sm flex items-center gap-2">
                        <Briefcase className="h-4 w-4" />
                        {userData?.position || "---"}
                      </span>
                    </div>

                    <div className="grid grid-cols-3">
                      <Label className="text-sm font-medium text-muted-foreground">
                        Address:
                      </Label>
                      <span className="col-span-2 text-sm flex items-start gap-2">
                        <MapPin className="h-4 w-4 mt-0.5" />
                        {userData?.address || "No address provided"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Account Information */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <div className="w-1 h-6 bg-green-600 rounded-full"></div>
                    <h3 className="text-lg font-semibold text-foreground">
                      Account Information
                    </h3>
                  </div>

                  <div className="space-y-3">
                    <div className="grid grid-cols-3">
                      <Label className="text-sm font-medium text-muted-foreground">
                        User Type:
                      </Label>
                      <div className="col-span-2 flex items-center gap-2">
                        {getUserTypeIcon(userData?.userType ?? null)}
                        <span className="text-sm">{userData?.userType}</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-3">
                      <Label className="text-sm font-medium text-muted-foreground">
                        Account Status:
                      </Label>
                      <div className="col-span-2 flex items-center gap-2">
                        {userData?.accountStatus.toLowerCase() === "active" ? (
                          <CheckCircle className="h-4 w-4 text-green-600" />
                        ) : userData?.accountStatus.toLowerCase() ===
                          "pending" ? (
                          <AlertTriangle className="h-4 w-4 text-yellow-600" />
                        ) : (
                          <XCircle className="h-4 w-4 text-red-600" />
                        )}
                        <span className="text-sm">
                          {userData?.accountStatus}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Business Association */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <div className="w-1 h-6 bg-orange-600 rounded-full"></div>
                    <h3 className="text-lg font-semibold text-foreground">
                      Business Association
                    </h3>
                  </div>

                  <div className="space-y-3">
                    <div className="grid grid-cols-3">
                      <Label className="text-sm font-medium text-muted-foreground">
                        Business Name:
                      </Label>
                      <span className="col-span-2 text-sm flex items-center gap-2">
                        <Building2 className="h-4 w-4" />
                        {userData?.businessName || "---"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Roles & Permissions */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <div className="w-1 h-6 bg-purple-600 rounded-full"></div>
                    <h3 className="text-lg font-semibold text-foreground">
                      Roles & Permissions
                    </h3>
                  </div>

                  <div className="space-y-3">
                    <div className="grid grid-cols-3">
                      <Label className="text-sm font-medium text-muted-foreground">
                        Assigned Roles:
                      </Label>
                      <div className="col-span-2">
                        <div className="flex flex-wrap gap-2">
                          {userData?.roles?.map((role, index) => (
                            <Badge
                              key={index}
                              variant="outline"
                              className={getRoleColor(role)}
                            >
                              <Users className="w-3 h-3 mr-1" />
                              {role}
                            </Badge>
                          ))}
                        </div>
                        {userData?.roles?.length === 0 && (
                          <span className="text-sm text-muted-foreground italic">
                            No roles assigned
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Notes */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <div className="w-1 h-6 bg-gray-600 rounded-full"></div>
                    <h3 className="text-lg font-semibold text-foreground">
                      Notes
                    </h3>
                  </div>

                  <div className="space-y-3">
                    <div className="grid grid-cols-3">
                      <Label className="text-sm font-medium text-muted-foreground">
                        Additional Notes:
                      </Label>
                      <div className="col-span-2">
                        <div className="min-h-[100px] p-3 border rounded-md bg-gray-50">
                          {userData?.notes ? (
                            <p className="text-sm whitespace-pre-wrap">
                              {userData?.notes}
                            </p>
                          ) : (
                            <p className="text-sm text-muted-foreground italic">
                              No notes available
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* System Information */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <div className="w-1 h-6 bg-red-600 rounded-full"></div>
                    <h3 className="text-lg font-semibold text-foreground">
                      System Information
                    </h3>
                  </div>

                  <div className="space-y-3">
                    <div className="grid grid-cols-3">
                      <Label className="text-sm font-medium text-muted-foreground">
                        User ID:
                      </Label>
                      <span className="col-span-2 text-sm font-mono">
                        {userData?.id}
                      </span>
                    </div>

                    <div className="grid grid-cols-3">
                      <Label className="text-sm font-medium text-muted-foreground">
                        Created:
                      </Label>
                      <span className="col-span-2 text-sm flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        {formatDate(userData?.createdAt ?? "")}
                      </span>
                    </div>

                    <div className="grid grid-cols-3">
                      <Label className="text-sm font-medium text-muted-foreground">
                        Last Updated:
                      </Label>
                      <span className="col-span-2 text-sm flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        {formatDate(userData?.updatedAt ?? "")}
                      </span>
                    </div>

                    <div className="grid grid-cols-3">
                      <Label className="text-sm font-medium text-muted-foreground">
                        Created By:
                      </Label>
                      <span className="col-span-2 text-sm">
                        {userData?.createdBy || "---"}
                      </span>
                    </div>

                    <div className="grid grid-cols-3">
                      <Label className="text-sm font-medium text-muted-foreground">
                        Updated By:
                      </Label>
                      <span className="col-span-2 text-sm">
                        {userData?.updatedBy || "---"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No user data available</p>
              </div>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
