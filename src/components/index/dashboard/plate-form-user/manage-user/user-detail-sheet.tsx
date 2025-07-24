"use client";

import type React from "react";

import { useState } from "react";
import {
  Eye,
  User,
  Phone,
  Mail,
  MapPin,
  Building2,
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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { UserModel } from "@/models/dashboard/user/plateform-user/user.response";

interface UserDetailSheetProps {
  open: boolean;
  onClose: () => void;
  user: UserModel | null;
  trigger?: React.ReactNode;
}

export function UserDetailSheet({
  onClose,
  open,
  user,
  trigger,
}: UserDetailSheetProps) {
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
      case "admin":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "manager":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "staff":
        return "bg-green-100 text-green-800 border-green-200";
      case "owner":
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
      case "PLATFORM_USER":
        return <Crown className="h-4 w-4" />;
      case "BUSINESS_USER":
        return <UserCheck className="h-4 w-4" />;
      default:
        return <User className="h-4 w-4" />;
    }
  };

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent className="w-[600px] sm:w-[700px] sm:max-w-none">
        <SheetHeader className="space-y-4">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarImage
                src={user?.profileImageUrl || "/placeholder.svg"}
                alt={user?.fullName}
              />
              <AvatarFallback className="text-lg">
                {user?.firstName[0]}
                {user?.lastName[0]}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <SheetTitle className="text-xl">{user?.fullName}</SheetTitle>
              <SheetDescription className="text-base">
                {user?.position}
              </SheetDescription>
              <div className="flex items-center gap-2 mt-2">
                <Badge className={getStatusColor(user?.accountStatus ?? "")}>
                  {user?.accountStatus}
                </Badge>
                <Badge className={getUserTypeColor(user?.userType ?? null)}>
                  {getUserTypeIcon(user?.userType ?? null)}
                  <span className="ml-1">{user?.userType}</span>
                </Badge>
              </div>
            </div>
          </div>
        </SheetHeader>

        <ScrollArea className="h-[calc(100vh-200px)] mt-6">
          <div className="space-y-6">
            {/* Personal Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Personal Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      First Name
                    </label>
                    <p className="mt-1 font-medium">{user?.firstName}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Last Name
                    </label>
                    <p className="mt-1 font-medium">{user?.lastName}</p>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Full Name
                  </label>
                  <p className="mt-1 font-medium">{user?.fullName}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Position
                  </label>
                  <p className="mt-1 flex items-center gap-2">
                    <Briefcase className="h-4 w-4" />
                    {user?.position}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Account Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Account Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      User Type
                    </label>
                    <div className="mt-1 flex items-center gap-2">
                      {getUserTypeIcon(user?.userType ?? null)}
                      <span className="font-medium">{user?.userType}</span>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Account Status
                    </label>
                    <div className="mt-1 flex items-center gap-2">
                      {user?.accountStatus.toLowerCase() === "active" ? (
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      ) : user?.accountStatus.toLowerCase() === "pending" ? (
                        <AlertTriangle className="h-4 w-4 text-yellow-600" />
                      ) : (
                        <XCircle className="h-4 w-4 text-red-600" />
                      )}
                      <span className="font-medium">{user?.accountStatus}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Business Association */}
            {/* <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5" />
                  Business Association
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Business Name
                  </label>
                  <p className="mt-1 font-medium">{user?.businessName}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Business ID
                  </label>
                  <p className="mt-1 font-mono text-sm bg-gray-100 px-2 py-1 rounded">
                    {user?.businessId}
                  </p>
                </div>
              </CardContent>
            </Card> */}

            {/* Roles & Permissions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Roles & Permissions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div>
                  <label className="text-sm font-medium text-muted-foreground mb-3 block">
                    Assigned Roles
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {user?.roles.map((role, index) => (
                      <Badge
                        key={index}
                        variant="outline"
                        className={getRoleColor(role)}
                      >
                        {role}
                      </Badge>
                    ))}
                  </div>
                  {user?.roles.length === 0 && (
                    <p className="text-sm text-muted-foreground italic">
                      No roles assigned
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Phone className="h-5 w-5" />
                  Contact Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span>{user?.email}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span>{user?.phoneNumber}</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                    <span className="text-sm">
                      {user?.address || "No address provided"}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Notes */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Notes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">
                    Additional Notes
                  </label>
                  <div className="min-h-[100px] p-3 border rounded-md bg-gray-50">
                    {user?.notes ? (
                      <p className="text-sm whitespace-pre-wrap">
                        {user?.notes}
                      </p>
                    ) : (
                      <p className="text-sm text-muted-foreground italic">
                        No notes available
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* System Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  System Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm font-medium text-muted-foreground">
                    Created
                  </span>
                  <span className="text-sm">{formatDate(user?.createdAt)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium text-muted-foreground">
                    Last Updated
                  </span>
                  <span className="text-sm">{formatDate(user?.updatedAt)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium text-muted-foreground">
                    Created By
                  </span>
                  <span className="text-sm">{user?.createdBy}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium text-muted-foreground">
                    Updated By
                  </span>
                  <span className="text-sm">{user?.updatedBy}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
