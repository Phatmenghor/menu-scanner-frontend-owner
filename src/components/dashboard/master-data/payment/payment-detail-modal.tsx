"use client";

import type React from "react";
import { useEffect, useState } from "react";
import {
  Calendar,
  DollarSign,
  CreditCard,
  Building2,
  Package,
  FileText,
  User,
  Hash,
  Image as ImageIcon,
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
import { PaymentModel } from "@/models/dashboard/payment/payment/payment.response.model";
import { PaymentStatusBadge } from "@/components/shared/badge/payment-status-badge";
import Loading from "@/components/shared/common/loading";
import { getPaymentByIdService } from "@/services/dashboard/payment/payment/payment.service";

interface PaymentDetailModalProps {
  paymentId?: string;
  isOpen: boolean;
  onClose: () => void;
}

export function PaymentDetailModal({
  paymentId,
  isOpen,
  onClose,
}: PaymentDetailModalProps) {
  const [paymentData, setPaymentData] = useState<PaymentModel | null>(null);
  const [isLoadingData, setIsLoadingData] = useState(false);

  useEffect(() => {
    const fetchPaymentData = async () => {
      if (!paymentId || !isOpen) return;

      setIsLoadingData(true);
      try {
        const data = await getPaymentByIdService(paymentId);
        setPaymentData(data);
      } catch (error: any) {
        console.error("Error fetching payment data:", error);
      } finally {
        setIsLoadingData(false);
      }
    };

    fetchPaymentData();
  }, [paymentId, isOpen]);

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
    setPaymentData(null);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl h-[90vh] p-0 gap-0 flex flex-col">
        {/* Header */}
        <DialogHeader className="px-6 py-4 border-b bg-muted/30 flex-shrink-0">
          <div className="flex items-center gap-4 pr-8">
            <div className="p-2 bg-green-100 rounded-full">
              <CreditCard className="h-5 w-5 text-green-600" />
            </div>
            <div className="flex-1">
              <DialogTitle className="text-xl font-semibold">
                Payment Details
              </DialogTitle>
              <DialogDescription className="text-base text-muted-foreground">
                {paymentData
                  ? `Payment information - ${
                      paymentData.referenceNumber || "Payment"
                    }`
                  : "Loading payment information..."}
              </DialogDescription>
              {paymentData && (
                <div className="flex items-center gap-2 mt-2">
                  <PaymentStatusBadge status={paymentData.status} />
                  <Badge variant="outline" className="text-xs">
                    {paymentData.paymentMethod}
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
            ) : paymentData ? (
              <div className="space-y-6">
                {/* Payment Information */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <div className="w-1 h-6 bg-green-600 rounded-full"></div>
                    <h3 className="text-lg font-semibold">
                      Payment Information
                    </h3>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <Label className="text-sm font-medium text-muted-foreground">
                        Amount (USD):
                      </Label>
                      <div className="text-right">
                        <div className="text-sm font-semibold text-green-700 flex items-center gap-2">
                          <DollarSign className="h-4 w-4" />
                          {paymentData.formattedAmount || "$0.00"}
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-between">
                      <Label className="text-sm font-medium text-muted-foreground">
                        Amount (KHR):
                      </Label>
                      <div className="text-right">
                        <div className="text-sm font-medium text-muted-foreground">
                          {paymentData.formattedAmountKhr || "0 ៛"}
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-between">
                      <Label className="text-sm font-medium text-muted-foreground">
                        Payment Method:
                      </Label>
                      <div className="flex items-center gap-2">
                        <CreditCard className="h-4 w-4 text-muted-foreground" />
                        <Badge variant="outline">
                          {paymentData.paymentMethod || "---"}
                        </Badge>
                      </div>
                    </div>

                    <div className="flex justify-between">
                      <Label className="text-sm font-medium text-muted-foreground">
                        Reference Number:
                      </Label>
                      <span className="text-sm font-mono flex items-center gap-2">
                        <Hash className="h-4 w-4" />
                        {paymentData.referenceNumber || "---"}
                      </span>
                    </div>

                    <div className="flex justify-between">
                      <Label className="text-sm font-medium text-muted-foreground">
                        Payment ID:
                      </Label>
                      <span className="text-sm font-mono">
                        {paymentData.id}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Business & Subscription Information */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <div className="w-1 h-6 bg-blue-600 rounded-full"></div>
                    <h3 className="text-lg font-semibold">
                      Business & Subscription
                    </h3>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <Label className="text-sm font-medium text-muted-foreground">
                        Business Name:
                      </Label>
                      <span className="text-sm flex items-center gap-2">
                        <Building2 className="h-4 w-4" />
                        {paymentData.businessName || "---"}
                      </span>
                    </div>

                    <div className="flex justify-between">
                      <Label className="text-sm font-medium text-muted-foreground">
                        Plan Name:
                      </Label>
                      <span className="text-sm flex items-center gap-2">
                        <Package className="h-4 w-4" />
                        {paymentData.planName || "---"}
                      </span>
                    </div>

                    <div className="flex justify-between">
                      <Label className="text-sm font-medium text-muted-foreground">
                        Subscription:
                      </Label>
                      <span className="text-sm">
                        {paymentData.subscriptionDisplayName || "---"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Status Information */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <div className="w-1 h-6 bg-orange-600 rounded-full"></div>
                    <h3 className="text-lg font-semibold">
                      Status Information
                    </h3>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <Label className="text-sm font-medium text-muted-foreground">
                        Status:
                      </Label>
                      <PaymentStatusBadge status={paymentData.status} />
                    </div>

                    <div className="flex justify-between">
                      <Label className="text-sm font-medium text-muted-foreground">
                        Status Description:
                      </Label>
                      <span className="text-sm">
                        {paymentData.statusDescription || "---"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Payment Receipt */}
                {paymentData.imageUrl && (
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <div className="w-1 h-6 bg-purple-600 rounded-full"></div>
                      <h3 className="text-lg font-semibold">Payment Receipt</h3>
                    </div>

                    <div className="p-4 bg-muted/50 rounded-lg border">
                      <div className="flex items-center gap-4">
                        <ImageIcon className="h-8 w-8 text-muted-foreground" />
                        <div className="flex-1">
                          <p className="text-sm font-medium">
                            Payment Receipt Image
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Click to view full size
                          </p>
                        </div>
                        <img
                          src={paymentData.imageUrl}
                          alt="Payment Receipt"
                          className="w-16 h-16 rounded object-cover border cursor-pointer hover:scale-105 transition-transform"
                          onClick={() =>
                            window.open(paymentData.imageUrl, "_blank")
                          }
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Notes Section */}
                {paymentData.notes && (
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <div className="w-1 h-6 bg-yellow-600 rounded-full"></div>
                      <h3 className="text-lg font-semibold">Notes</h3>
                    </div>

                    <div className="p-4 bg-muted/50 rounded-lg border">
                      <div className="flex items-start gap-2">
                        <FileText className="h-4 w-4 mt-0.5 text-muted-foreground" />
                        <p className="text-sm text-muted-foreground">
                          {paymentData.notes}
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
                        {formatDateTime(paymentData.createdAt)}
                      </span>
                    </div>

                    <div className="flex justify-between">
                      <Label className="text-sm font-medium text-muted-foreground">
                        Last Updated:
                      </Label>
                      <span className="text-sm flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        {formatDateTime(paymentData.updatedAt)}
                      </span>
                    </div>

                    <div className="flex justify-between">
                      <Label className="text-sm font-medium text-muted-foreground">
                        Created By:
                      </Label>
                      <span className="text-sm flex items-center gap-2">
                        <User className="h-4 w-4" />
                        {paymentData.createdBy || "---"}
                      </span>
                    </div>

                    <div className="flex justify-between">
                      <Label className="text-sm font-medium text-muted-foreground">
                        Updated By:
                      </Label>
                      <span className="text-sm flex items-center gap-2">
                        <User className="h-4 w-4" />
                        {paymentData.updatedBy || "---"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground">
                  No payment data available
                </p>
              </div>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
