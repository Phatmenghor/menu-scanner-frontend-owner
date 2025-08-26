"use client";

import type React from "react";
import { useEffect, useState } from "react";
import {
  Phone,
  Mail,
  MapPin,
  Building2,
  DollarSign,
  Percent,
  Shield,
  Users,
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
import { BusinessModel } from "@/models/dashboard/master-data/business/business-response-model";
import { getBusinessByIdService } from "@/services/dashboard/master-data/business/business.service";
import Loading from "@/components/shared/common/loading";
import { formatDate } from "@/utils/date/date-time-format";
import { CustomAvatar } from "@/components/shared/common/custom-avator";

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
  const [businessData, setBusinessData] = useState<BusinessModel | null>(null);
  const [isLoadingData, setIsLoadingData] = useState(false);

  // Fetch business data when businessId is provided
  useEffect(() => {
    const fetchBusinessData = async () => {
      if (!businessId || !isOpen) return;

      setIsLoadingData(true);

      try {
        const data = await getBusinessByIdService(businessId);
        setBusinessData(data);
      } catch (error: any) {
        console.error("Error fetching business data:", error);
      } finally {
        setIsLoadingData(false);
      }
    };

    fetchBusinessData();
  }, [businessId, isOpen]);

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

  const handleClose = () => {
    setBusinessData(null);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl h-[90vh] p-0 gap-0 flex flex-col">
        {/* Header */}
        <DialogHeader className="px-6 py-4 border-b bg-muted/30 flex-shrink-0">
          <div className="flex items-center gap-4 pr-8">
            <CustomAvatar
              imageUrl={businessData?.imageUrl}
              name={businessData?.name}
              size="lg"
            />
            <div className="flex-1">
              <DialogTitle className="text-xl font-semibold">
                Business Details
              </DialogTitle>
              <DialogDescription className="text-base text-muted-foreground">
                {businessData?.name
                  ? `Information for "${businessData.name}"`
                  : "Loading business information..."}
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
            ) : businessData ? (
              <div className="space-y-6">
                {/* Basic Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-foreground">
                    Basic Information
                  </h3>

                  <div className="space-y-3">
                    <div className="grid grid-cols-3">
                      <Label className="text-sm font-medium text-muted-foreground">
                        Business Name:
                      </Label>
                      <span className="col-span-2 text-sm">
                        {businessData.name}
                      </span>
                    </div>

                    <div className="grid grid-cols-3">
                      <Label className="text-sm font-medium text-muted-foreground">
                        Email:
                      </Label>
                      <span className="col-span-2 text-sm">
                        {businessData.email}
                      </span>
                    </div>

                    <div className="grid grid-cols-3">
                      <Label className="text-sm font-medium text-muted-foreground">
                        Phone:
                      </Label>
                      <span className="col-span-2 text-sm">
                        {businessData.phone}
                      </span>
                    </div>

                    <div className="grid grid-cols-3">
                      <Label className="text-sm font-medium text-muted-foreground">
                        Status:
                      </Label>
                      <div className="col-span-2">
                        <Badge
                          className={getStatusColor(
                            businessData.status ?? null
                          )}
                        >
                          {businessData.status}
                        </Badge>
                      </div>
                    </div>

                    <div className="grid grid-cols-3">
                      <Label className="text-sm font-medium text-muted-foreground">
                        Address:
                      </Label>
                      <span className="col-span-2 text-sm">
                        {businessData.address}
                      </span>
                    </div>

                    <div className="grid grid-cols-3">
                      <Label className="text-sm font-medium text-muted-foreground">
                        Description:
                      </Label>
                      <span className="col-span-2 text-sm">
                        {businessData.description}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Financial Settings */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-foreground">
                    Financial Settings
                  </h3>

                  <div className="space-y-3">
                    <div className="grid grid-cols-3">
                      <Label className="text-sm font-medium text-muted-foreground">
                        USD to KHR Rate:
                      </Label>
                      <span className="col-span-2 text-sm">
                        {businessData.usdToKhrRate?.toLocaleString()} KHR
                      </span>
                    </div>

                    <div className="grid grid-cols-3">
                      <Label className="text-sm font-medium text-muted-foreground">
                        Tax Rate:
                      </Label>
                      <span className="col-span-2 text-sm">
                        {businessData.taxRate}%
                      </span>
                    </div>
                  </div>
                </div>

                {/* Business Statistics */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-foreground">
                    Business Statistics
                  </h3>

                  <div className="space-y-3">
                    <div className="grid grid-cols-3">
                      <Label className="text-sm font-medium text-muted-foreground">
                        Total Staff:
                      </Label>
                      <span className="col-span-2 text-sm">
                        {businessData.totalStaff}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Subscription Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-foreground">
                    Subscription Information
                  </h3>

                  <div className="space-y-3">
                    <div className="grid grid-cols-3">
                      <Label className="text-sm font-medium text-muted-foreground">
                        Current Plan:
                      </Label>
                      <span className="col-span-2 text-sm">
                        {businessData.currentSubscriptionPlan}
                      </span>
                    </div>

                    <div className="grid grid-cols-3">
                      <Label className="text-sm font-medium text-muted-foreground">
                        Subscription Active:
                      </Label>
                      <span className="col-span-2 text-sm">
                        {businessData.isSubscriptionActive ? "Yes" : "No"}
                      </span>
                    </div>

                    <div className="grid grid-cols-3">
                      <Label className="text-sm font-medium text-muted-foreground">
                        Start Date:
                      </Label>
                      <span className="col-span-2 text-sm">
                        {formatDate(businessData.subscriptionStartDate)}
                      </span>
                    </div>

                    <div className="grid grid-cols-3">
                      <Label className="text-sm font-medium text-muted-foreground">
                        End Date:
                      </Label>
                      <span className="col-span-2 text-sm">
                        {formatDate(businessData.subscriptionEndDate)}
                      </span>
                    </div>

                    <div className="grid grid-cols-3">
                      <Label className="text-sm font-medium text-muted-foreground">
                        Days Remaining:
                      </Label>
                      <span className="col-span-2 text-sm">
                        {businessData.daysRemaining} days
                      </span>
                    </div>

                    <div className="grid grid-cols-3">
                      <Label className="text-sm font-medium text-muted-foreground">
                        Expiring Soon:
                      </Label>
                      <span className="col-span-2 text-sm">
                        {businessData.isExpiringSoon ? "Yes" : "No"}
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
                        {businessData.id}
                      </span>
                    </div>

                    <div className="grid grid-cols-3">
                      <Label className="text-sm font-medium text-muted-foreground">
                        Created:
                      </Label>
                      <span className="col-span-2 text-sm">
                        {formatDate(businessData.createdAt)}
                      </span>
                    </div>

                    <div className="grid grid-cols-3">
                      <Label className="text-sm font-medium text-muted-foreground">
                        Last Updated:
                      </Label>
                      <span className="col-span-2 text-sm">
                        {formatDate(businessData.updatedAt)}
                      </span>
                    </div>

                    <div className="grid grid-cols-3">
                      <Label className="text-sm font-medium text-muted-foreground">
                        Created By:
                      </Label>
                      <span className="col-span-2 text-sm">
                        {businessData.createdBy}
                      </span>
                    </div>

                    <div className="grid grid-cols-3">
                      <Label className="text-sm font-medium text-muted-foreground">
                        Updated By:
                      </Label>
                      <span className="col-span-2 text-sm">
                        {businessData.updatedBy}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground">
                  No business data available
                </p>
              </div>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
