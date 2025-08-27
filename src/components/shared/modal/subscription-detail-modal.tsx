"use client";

import type React from "react";
import { useEffect, useState } from "react";
import {
  Calendar,
  Building2,
  CreditCard,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Package,
  DollarSign,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { SubscriptionModel } from "@/models/dashboard/subscription/subscription.response.model";
import { getSubscriptionByIdService } from "@/services/dashboard/subscription/subscription.service";
import Loading from "@/components/shared/common/loading";

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
  const [subscriptionData, setSubscriptionData] =
    useState<SubscriptionModel | null>(null);
  const [isLoadingData, setIsLoadingData] = useState(false);

  useEffect(() => {
    const fetchSubscriptionData = async () => {
      if (!subscriptionId || !isOpen) return;

      setIsLoadingData(true);
      try {
        const data = await getSubscriptionByIdService(subscriptionId);
        setSubscriptionData(data);
      } catch (error: any) {
        console.error("Error fetching subscription data:", error);
      } finally {
        setIsLoadingData(false);
      }
    };

    fetchSubscriptionData();
  }, [subscriptionId, isOpen]);

  const getStatusColor = (daysRemaining: number) => {
    if (daysRemaining <= 0) {
      return "bg-red-100 text-red-800 border-red-200";
    } else if (daysRemaining <= 7) {
      return "bg-yellow-100 text-yellow-800 border-yellow-200";
    } else {
      return "bg-green-100 text-green-800 border-green-200";
    }
  };

  const getStatusLabel = (daysRemaining: number) => {
    if (daysRemaining <= 0) return "Expired";
    if (daysRemaining <= 7) return "Expiring Soon";
    return "Active";
  };

  const getStatusIcon = (daysRemaining: number) => {
    if (daysRemaining <= 0) {
      return <XCircle className="h-4 w-4 text-red-600" />;
    } else if (daysRemaining <= 7) {
      return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
    } else {
      return <CheckCircle className="h-4 w-4 text-green-600" />;
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatDateTime = (dateString: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleClose = () => {
    setSubscriptionData(null);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl h-[90vh] p-0 gap-0 flex flex-col">
        {/* Header */}
        <DialogHeader className="px-6 py-4 border-b bg-muted/30 flex-shrink-0">
          <div className="flex items-center gap-4 pr-8">
            <div className="p-2 bg-blue-100 rounded-full">
              <Package className="h-5 w-5 text-blue-600" />
            </div>
            <div className="flex-1">
              <DialogTitle className="text-xl font-semibold">
                Subscription Details
              </DialogTitle>
              <DialogDescription className="text-base text-muted-foreground">
                {subscriptionData?.businessName
                  ? `Subscription information for "${subscriptionData.businessName}"`
                  : "Loading subscription information..."}
              </DialogDescription>
              {subscriptionData && (
                <div className="flex items-center gap-2 mt-2">
                  <Badge
                    className={getStatusColor(subscriptionData.daysRemaining)}
                  >
                    {getStatusLabel(subscriptionData.daysRemaining)}
                  </Badge>
                  <Badge
                    variant="outline"
                    className={
                      subscriptionData.autoRenew
                        ? "border-green-200 text-green-800"
                        : "border-gray-200 text-gray-800"
                    }
                  >
                    {subscriptionData.autoRenew ? "Auto-Renew" : "Manual"}
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
            ) : subscriptionData ? (
              <div className="space-y-6">
                {/* Business Information */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <div className="w-1 h-6 bg-blue-600 rounded-full"></div>
                    <h3 className="text-lg font-semibold">
                      Business Information
                    </h3>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <Label className="text-sm font-medium text-muted-foreground">
                        Business Name:
                      </Label>
                      <span className="text-sm flex items-center gap-2">
                        <Building2 className="h-4 w-4" />
                        {subscriptionData.businessName || "---"}
                      </span>
                    </div>

                    <div className="flex justify-between">
                      <Label className="text-sm font-medium text-muted-foreground">
                        Business ID:
                      </Label>
                      <span className="text-sm font-mono">
                        {subscriptionData.businessId || "---"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Plan Information */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <div className="w-1 h-6 bg-green-600 rounded-full"></div>
                    <h3 className="text-lg font-semibold">Plan Information</h3>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <Label className="text-sm font-medium text-muted-foreground">
                        Plan Name:
                      </Label>
                      <span className="text-sm flex items-center gap-2">
                        <Package className="h-4 w-4" />
                        {subscriptionData.planName || "---"}
                      </span>
                    </div>

                    <div className="flex justify-between">
                      <Label className="text-sm font-medium text-muted-foreground">
                        Plan Price:
                      </Label>
                      <span className="text-sm flex items-center gap-2 font-medium">
                        <DollarSign className="h-4 w-4" />$
                        {subscriptionData.planPrice || 0}
                      </span>
                    </div>

                    <div className="flex justify-between">
                      <Label className="text-sm font-medium text-muted-foreground">
                        Duration:
                      </Label>
                      <span className="text-sm flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        {subscriptionData.planDurationDays || 0} days
                      </span>
                    </div>

                    <div className="flex justify-between">
                      <Label className="text-sm font-medium text-muted-foreground">
                        Plan ID:
                      </Label>
                      <span className="text-sm font-mono">
                        {subscriptionData.planId || "---"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Subscription Status */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <div className="w-1 h-6 bg-orange-600 rounded-full"></div>
                    <h3 className="text-lg font-semibold">
                      Subscription Status
                    </h3>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <Label className="text-sm font-medium text-muted-foreground">
                        Status:
                      </Label>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(subscriptionData.daysRemaining)}
                        <span className="text-sm">
                          {getStatusLabel(subscriptionData.daysRemaining)}
                        </span>
                      </div>
                    </div>

                    <div className="flex justify-between">
                      <Label className="text-sm font-medium text-muted-foreground">
                        Days Remaining:
                      </Label>
                      <span
                        className={`text-sm font-medium ${
                          subscriptionData.daysRemaining <= 0
                            ? "text-red-600"
                            : subscriptionData.daysRemaining <= 7
                            ? "text-yellow-600"
                            : "text-green-600"
                        }`}
                      >
                        {subscriptionData.daysRemaining || 0} days
                      </span>
                    </div>

                    <div className="flex justify-between">
                      <Label className="text-sm font-medium text-muted-foreground">
                        Auto Renew:
                      </Label>
                      <div className="flex items-center gap-2">
                        {subscriptionData.autoRenew ? (
                          <CheckCircle className="h-4 w-4 text-green-600" />
                        ) : (
                          <XCircle className="h-4 w-4 text-red-600" />
                        )}
                        <span className="text-sm">
                          {subscriptionData.autoRenew ? "Enabled" : "Disabled"}
                        </span>
                      </div>
                    </div>

                    <div className="flex justify-between">
                      <Label className="text-sm font-medium text-muted-foreground">
                        Start Date:
                      </Label>
                      <span className="text-sm flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        {formatDate(subscriptionData.startDate)}
                      </span>
                    </div>

                    <div className="flex justify-between">
                      <Label className="text-sm font-medium text-muted-foreground">
                        End Date:
                      </Label>
                      <span className="text-sm flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        {formatDate(subscriptionData.endDate)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* System Information */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <div className="w-1 h-6 bg-red-600 rounded-full"></div>
                    <h3 className="text-lg font-semibold">
                      System Information
                    </h3>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <Label className="text-sm font-medium text-muted-foreground">
                        Subscription ID:
                      </Label>
                      <span className="text-sm font-mono">
                        {subscriptionData.id}
                      </span>
                    </div>

                    <div className="flex justify-between">
                      <Label className="text-sm font-medium text-muted-foreground">
                        Created:
                      </Label>
                      <span className="text-sm flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        {formatDateTime(subscriptionData.createdAt)}
                      </span>
                    </div>

                    <div className="flex justify-between">
                      <Label className="text-sm font-medium text-muted-foreground">
                        Last Updated:
                      </Label>
                      <span className="text-sm flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        {formatDateTime(subscriptionData.updatedAt)}
                      </span>
                    </div>

                    <div className="flex justify-between">
                      <Label className="text-sm font-medium text-muted-foreground">
                        Created By:
                      </Label>
                      <span className="text-sm">
                        {subscriptionData.createdBy || "---"}
                      </span>
                    </div>

                    <div className="flex justify-between">
                      <Label className="text-sm font-medium text-muted-foreground">
                        Updated By:
                      </Label>
                      <span className="text-sm">
                        {subscriptionData.updatedBy || "---"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground">
                  No subscription data available
                </p>
              </div>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
