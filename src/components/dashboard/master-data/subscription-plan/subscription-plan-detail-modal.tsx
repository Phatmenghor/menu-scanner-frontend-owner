"use client";

import type React from "react";
import { useEffect, useState } from "react";
import { Crown } from "lucide-react";
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
import { SubscriptionPlanModel } from "@/models/dashboard/master-data/subscription-plan/subscription-plan-response";
import { getSubscriptionPlanByIdService } from "@/services/dashboard/master-data/subscrion-plan/subscription-plan.service";
import Loading from "@/components/shared/common/loading";

interface SubscriptionPlanDetailModalProps {
  subscriptionPlanId?: string;
  isOpen: boolean;
  onClose: () => void;
}

export function SubscriptionPlanDetailModal({
  subscriptionPlanId,
  isOpen,
  onClose,
}: SubscriptionPlanDetailModalProps) {
  const [planData, setPlanData] = useState<SubscriptionPlanModel | null>(null);
  const [isLoadingData, setIsLoadingData] = useState(false);

  // Fetch subscription plan data when subscriptionPlanId is provided
  useEffect(() => {
    const fetchPlanData = async () => {
      if (!subscriptionPlanId || !isOpen) return;

      setIsLoadingData(true);

      try {
        const data = await getSubscriptionPlanByIdService(subscriptionPlanId);
        setPlanData(data);
      } catch (error: any) {
        console.error("Error fetching subscription plan data:", error);
      } finally {
        setIsLoadingData(false);
      }
    };

    fetchPlanData();
  }, [subscriptionPlanId, isOpen]);

  const getStatusColor = (status: string | null) => {
    switch (status?.toLowerCase()) {
      case "public":
        return "bg-green-100 text-green-800 border-green-200";
      case "private":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "inactive":
        return "bg-red-100 text-red-800 border-red-200";
      case "draft":
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

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const formatDuration = (days: number) => {
    if (days === 0) return "Unlimited";
    if (days < 30) return `${days} days`;
    if (days < 365) return `${Math.round(days / 30)} months`;
    return `${Math.round(days / 365)} years`;
  };

  const handleClose = () => {
    setPlanData(null);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl h-[90vh] p-0 gap-0 flex flex-col">
        {/* Header */}
        <DialogHeader className="px-6 py-4 border-b bg-muted/30 flex-shrink-0">
          <div className="flex items-center gap-4 pr-8">
            <div className="p-2 bg-purple-100 rounded-full">
              <Crown className="h-5 w-5 text-purple-600" />
            </div>
            <div className="flex-1">
              <DialogTitle className="text-xl font-semibold">
                Subscription Plan Details
              </DialogTitle>
              <DialogDescription className="text-base text-muted-foreground">
                {planData?.name
                  ? `Information for "${planData.name}"`
                  : "Loading subscription plan information..."}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {/* Content */}
        <ScrollArea className="flex-1 min-h-0">
          <div className="p-6">
            {/* Loading State */}
            {isLoadingData ? (
              <Loading />
            ) : planData ? (
              <div className="space-y-6">
                {/* Basic Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-foreground">
                    Basic Information
                  </h3>

                  <div className="space-y-3">
                    <div className="grid grid-cols-3">
                      <Label className="text-sm font-medium text-muted-foreground">
                        Plan Name:
                      </Label>
                      <span className="col-span-2 text-sm">
                        {planData.name}
                      </span>
                    </div>

                    <div className="grid grid-cols-3">
                      <Label className="text-sm font-medium text-muted-foreground">
                        Description:
                      </Label>
                      <span className="col-span-2 text-sm">
                        {planData.description || "---"}
                      </span>
                    </div>

                    <div className="grid grid-cols-3">
                      <Label className="text-sm font-medium text-muted-foreground">
                        Status:
                      </Label>
                      <div className="col-span-2">
                        <Badge
                          className={getStatusColor(planData.status ?? null)}
                        >
                          {planData.status}
                        </Badge>
                      </div>
                    </div>

                    <div className="grid grid-cols-3">
                      <Label className="text-sm font-medium text-muted-foreground">
                        Price:
                      </Label>
                      <span className="col-span-2 text-sm font-semibold">
                        {formatCurrency(planData.price)}
                      </span>
                    </div>

                    <div className="grid grid-cols-3">
                      <Label className="text-sm font-medium text-muted-foreground">
                        Duration:
                      </Label>
                      <span className="col-span-2 text-sm">
                        {formatDuration(planData.durationDays)} (
                        {planData.durationDays} days)
                      </span>
                    </div>
                  </div>
                </div>

                {/* Usage Statistics */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-foreground">
                    Usage Statistics
                  </h3>

                  <div className="space-y-3">
                    <div className="grid grid-cols-3">
                      <Label className="text-sm font-medium text-muted-foreground">
                        Active Subscriptions:
                      </Label>
                      <span className="col-span-2 text-sm font-semibold">
                        {planData.activeSubscriptionsCount}
                      </span>
                    </div>
                  </div>
                </div>

                {/* System Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-foreground">
                    System Information
                  </h3>

                  <div className="space-y-3">
                    <div className="grid grid-cols-3">
                      <Label className="text-sm font-medium text-muted-foreground">
                        ID:
                      </Label>
                      <span className="col-span-2 text-sm font-mono">
                        {planData.id}
                      </span>
                    </div>

                    <div className="grid grid-cols-3">
                      <Label className="text-sm font-medium text-muted-foreground">
                        Created:
                      </Label>
                      <span className="col-span-2 text-sm">
                        {formatDate(planData.createdAt)}
                      </span>
                    </div>

                    <div className="grid grid-cols-3">
                      <Label className="text-sm font-medium text-muted-foreground">
                        Last Updated:
                      </Label>
                      <span className="col-span-2 text-sm">
                        {formatDate(planData.updatedAt)}
                      </span>
                    </div>

                    <div className="grid grid-cols-3">
                      <Label className="text-sm font-medium text-muted-foreground">
                        Created By:
                      </Label>
                      <span className="col-span-2 text-sm">
                        {planData.createdBy}
                      </span>
                    </div>

                    <div className="grid grid-cols-3">
                      <Label className="text-sm font-medium text-muted-foreground">
                        Updated By:
                      </Label>
                      <span className="col-span-2 text-sm">
                        {planData.updatedBy}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground">
                  No subscription plan data available
                </p>
              </div>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
