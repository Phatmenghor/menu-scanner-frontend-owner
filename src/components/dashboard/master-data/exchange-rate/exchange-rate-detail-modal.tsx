"use client";

import type React from "react";
import { useEffect, useState } from "react";
import {
  Calendar,
  DollarSign,
  Package,
  CheckCircle,
  XCircle,
  FileText,
  User,
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
import { ExchangeRateModel } from "@/models/dashboard/payment/exchange-rate/exchange-rate.response.model";
import { getExchangeRateByIdService } from "@/services/dashboard/payment/exchange-rate/exchange-rate.service";
import Loading from "@/components/shared/common/loading";

interface ExchangeRateDetailModalProps {
  exchangeRateId?: string;
  isOpen: boolean;
  onClose: () => void;
}

export function ExchangeRateDetailModal({
  exchangeRateId,
  isOpen,
  onClose,
}: ExchangeRateDetailModalProps) {
  const [exchangeRateData, setExchangeRateData] =
    useState<ExchangeRateModel | null>(null);
  const [isLoadingData, setIsLoadingData] = useState(false);

  useEffect(() => {
    const fetchExchangeRateData = async () => {
      if (!exchangeRateId || !isOpen) return;

      setIsLoadingData(true);
      try {
        const data = await getExchangeRateByIdService(exchangeRateId);
        setExchangeRateData(data);
      } catch (error: any) {
        console.error("Error fetching exchange rate data:", error);
      } finally {
        setIsLoadingData(false);
      }
    };

    fetchExchangeRateData();
  }, [exchangeRateId, isOpen]);

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
    setExchangeRateData(null);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl h-[90vh] p-0 gap-0 flex flex-col">
        {/* Header */}
        <DialogHeader className="px-6 py-4 border-b bg-muted/30 flex-shrink-0">
          <div className="flex items-center gap-4 pr-8">
            <div className="p-2 bg-blue-100 rounded-full">
              <DollarSign className="h-5 w-5 text-blue-600" />
            </div>
            <div className="flex-1">
              <DialogTitle className="text-xl font-semibold">
                Exchange Rate Details
              </DialogTitle>
              <DialogDescription className="text-base text-muted-foreground">
                {exchangeRateData
                  ? `Exchange rate information - ${exchangeRateData.usdToKhrRate.toLocaleString()} KHR per USD`
                  : "Loading exchange rate information..."}
              </DialogDescription>
              {exchangeRateData && (
                <div className="flex items-center gap-2 mt-2">
                  <Badge
                    variant={
                      exchangeRateData.isActive ? "default" : "secondary"
                    }
                    className={
                      exchangeRateData.isActive
                        ? "bg-green-100 text-green-800 border-green-200"
                        : "bg-red-100 text-red-800 border-red-200"
                    }
                  >
                    {exchangeRateData.isActive ? "Active" : "Inactive"}
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
            ) : exchangeRateData ? (
              <div className="space-y-6">
                {/* Exchange Rate Information */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <div className="w-1 h-6 bg-blue-600 rounded-full"></div>
                    <h3 className="text-lg font-semibold">
                      Exchange Rate Information
                    </h3>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <Label className="text-sm font-medium text-muted-foreground">
                        USD to KHR Rate:
                      </Label>
                      <div className="text-right">
                        <div className="text-sm font-semibold flex items-center gap-2">
                          <DollarSign className="h-4 w-4" />
                          {exchangeRateData.usdToKhrRate.toLocaleString()}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          KHR per USD
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-between">
                      <Label className="text-sm font-medium text-muted-foreground">
                        Exchange Rate ID:
                      </Label>
                      <span className="text-sm font-mono">
                        {exchangeRateData.id}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Status Information */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <div className="w-1 h-6 bg-green-600 rounded-full"></div>
                    <h3 className="text-lg font-semibold">
                      Status Information
                    </h3>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <Label className="text-sm font-medium text-muted-foreground">
                        Status:
                      </Label>
                      <div className="flex items-center gap-2">
                        {exchangeRateData.isActive ? (
                          <CheckCircle className="h-4 w-4 text-green-600" />
                        ) : (
                          <XCircle className="h-4 w-4 text-red-600" />
                        )}
                        <span className="text-sm">
                          {exchangeRateData.isActive ? "Active" : "Inactive"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Notes Section */}
                {exchangeRateData.notes && (
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <div className="w-1 h-6 bg-orange-600 rounded-full"></div>
                      <h3 className="text-lg font-semibold">Notes</h3>
                    </div>

                    <div className="p-4 bg-muted/50 rounded-lg border">
                      <div className="flex items-start gap-2">
                        <FileText className="h-4 w-4 mt-0.5 text-muted-foreground" />
                        <p className="text-sm text-muted-foreground">
                          {exchangeRateData.notes}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

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
                        Created:
                      </Label>
                      <span className="text-sm flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        {formatDateTime(exchangeRateData.createdAt)}
                      </span>
                    </div>

                    <div className="flex justify-between">
                      <Label className="text-sm font-medium text-muted-foreground">
                        Last Updated:
                      </Label>
                      <span className="text-sm flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        {formatDateTime(exchangeRateData.updatedAt)}
                      </span>
                    </div>

                    <div className="flex justify-between">
                      <Label className="text-sm font-medium text-muted-foreground">
                        Created By:
                      </Label>
                      <span className="text-sm flex items-center gap-2">
                        <User className="h-4 w-4" />
                        {exchangeRateData.createdBy || "---"}
                      </span>
                    </div>

                    <div className="flex justify-between">
                      <Label className="text-sm font-medium text-muted-foreground">
                        Updated By:
                      </Label>
                      <span className="text-sm flex items-center gap-2">
                        <User className="h-4 w-4" />
                        {exchangeRateData.updatedBy || "---"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground">
                  No exchange rate data available
                </p>
              </div>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
