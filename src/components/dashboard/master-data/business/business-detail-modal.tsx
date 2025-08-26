"use client";

import type React from "react";
import {
  Phone,
  Mail,
  MapPin,
  Users,
  Calendar,
  Building2,
  ChefHat,
  DollarSign,
  Percent,
  Shield,
  CheckCircle,
  AlertTriangle,
  X,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { BusinessModel } from "@/models/dashboard/master-data/business/business.response.model";
import { AppIcons } from "@/constants/AppResource/icons/AppIcon";

interface BusinessDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  business: BusinessModel | null;
}

export function BusinessDetailModal({
  isOpen,
  onClose,
  business,
}: BusinessDetailModalProps) {
  const getStatusColor = (status: string | null) => {
    switch (status?.toLowerCase()) {
      case "active":
        return "bg-green-100 text-green-800 border-green-200";
      case "pending approval":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "suspended":
        return "bg-red-100 text-red-800 border-red-200";
      case "inactive":
        return "bg-gray-100 text-gray-800 border-gray-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (!business) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl h-[90vh] p-0 gap-0 flex flex-col">
        {/* Header */}
        <DialogHeader className="px-6 py-4 border-b bg-muted/30 flex-shrink-0">
          <div className="flex items-center gap-4 pr-8">
            <Avatar className="h-16 w-16">
              <AvatarImage src={business?.imageUrl} alt={business?.name} />
              <AvatarFallback className="text-lg">
                {business?.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <DialogTitle className="text-xl">
                {business?.name || "---"}
              </DialogTitle>
              <div className="flex items-center gap-2 mt-2 flex-wrap">
                <Badge className={getStatusColor(business?.status ?? null)}>
                  {business?.status}
                </Badge>
                {business?.hasActiveSubscription && (
                  <Badge
                    variant="outline"
                    className="text-green-600 border-green-200"
                  >
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Active Subscription
                  </Badge>
                )}
                {business?.isExpiringSoon && (
                  <Badge
                    variant="outline"
                    className="text-orange-600 border-orange-200"
                  >
                    <AlertTriangle className="h-3 w-3 mr-1" />
                    Expiring Soon
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </DialogHeader>

        {/* Content */}
        <ScrollArea className="flex-1 min-h-0">
          <div className="space-y-6 p-6">
            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Building2 className="h-5 w-5" />
                  Business Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Business Type
                    </label>
                    <p className="flex items-center gap-2 mt-1">
                      <ChefHat className="h-4 w-4" />
                      {business?.businessType || "---"}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Two Column Layout for Contact and Social */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Contact Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Phone className="h-5 w-5" />
                    Contact Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span className="break-all">
                        {business?.email || "---"}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span>{business?.phone || "---"}</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                      <span className="text-sm">
                        {business?.address || "---"}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Social Media */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">
                    Social Media & Communication
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={AppIcons.Facebook}
                      alt="Facebook Icon"
                      className="h-4 w-4 text-muted-foreground"
                    />
                    {business?.facebookUrl ? (
                      <a
                        href={business?.facebookUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline break-all"
                      >
                        Facebook Page
                      </a>
                    ) : (
                      <span>---</span>
                    )}
                  </div>
                  <div className="flex items-center gap-3">
                    <img
                      src={AppIcons.Instagram}
                      alt="Instagram Icon"
                      className="h-4 w-4 text-muted-foreground"
                    />
                    {business?.instagramUrl ? (
                      <a
                        href={business?.instagramUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-pink-600 hover:underline break-all"
                      >
                        Instagram Profile
                      </a>
                    ) : (
                      <span>---</span>
                    )}
                  </div>
                  <div className="flex items-center gap-3">
                    <img
                      src={AppIcons.Telegram}
                      alt="Telegram Icon"
                      className="h-4 w-4 text-muted-foreground"
                    />
                    <span className="break-all">
                      {business?.telegramUrl || "---"}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Financial Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <DollarSign className="h-5 w-5" />
                  Financial Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      USD to KHR Rate
                    </label>
                    <p className="text-lg font-semibold mt-1">
                      {business?.usdToKhrRate?.toLocaleString()} KHR
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Tax Rate
                    </label>
                    <p className="text-lg font-semibold mt-1 flex items-center gap-1">
                      <Percent className="h-4 w-4" />
                      {business?.taxRate || "---"}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Business Statistics */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Users className="h-5 w-5" />
                  Business Statistics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <p className="text-2xl font-bold text-blue-600">
                      {business?.totalStaff || "0"}
                    </p>
                    <p className="text-xs text-muted-foreground">Total Staff</p>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <p className="text-2xl font-bold text-green-600">
                      {business?.totalCustomers || "0"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Total Customers
                    </p>
                  </div>
                  <div className="text-center p-4 bg-orange-50 rounded-lg">
                    <p className="text-2xl font-bold text-orange-600">
                      {business?.totalMenuItems || "0"}
                    </p>
                    <p className="text-xs text-muted-foreground">Menu Items</p>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <p className="text-2xl font-bold text-purple-600">
                      {business?.totalTables || "0"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Total Tables
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Two Column Layout for Subscription and System Info */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Subscription Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Shield className="h-5 w-5" />
                    Subscription Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Current Plan</span>
                    <Badge variant="outline">
                      {business?.currentSubscriptionPlan || "---"}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Status</span>
                    <Badge
                      className={
                        business?.isSubscriptionActive
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }
                    >
                      {business?.isSubscriptionActive ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                  {business?.isSubscriptionActive && (
                    <>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Start Date</span>
                        <span className="text-sm">
                          {formatDate(business?.subscriptionStartDate)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">End Date</span>
                        <span className="text-sm">
                          {formatDate(business?.subscriptionEndDate)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">
                          Days Remaining
                        </span>
                        <span
                          className={`text-sm font-semibold ${
                            business?.daysRemaining <= 7
                              ? "text-red-600"
                              : "text-green-600"
                          }`}
                        >
                          {business?.daysRemaining || "---"} days
                        </span>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>

              {/* System Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Calendar className="h-5 w-5" />
                    System Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-muted-foreground">
                      Created
                    </span>
                    <span className="text-sm">
                      {formatDate(business?.createdAt)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-muted-foreground">
                      Last Updated
                    </span>
                    <span className="text-sm">
                      {formatDate(business?.updatedAt)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-muted-foreground">
                      Created By
                    </span>
                    <span className="text-sm">
                      {business?.createdBy || "---"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-muted-foreground">
                      Updated By
                    </span>
                    <span className="text-sm">
                      {business?.updatedBy || "---"}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
