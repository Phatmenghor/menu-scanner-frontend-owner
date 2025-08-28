"use client";

import type React from "react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2, AlertTriangle } from "lucide-react";
import { SubscriptionModel } from "@/models/dashboard/master-data/subscription/subscription.response.model";
import { getSubscriptionByIdService } from "@/services/dashboard/subscription/subscription.service";
import Loading from "@/components/shared/common/loading";
import { CancelSubscriptionRequest } from "@/models/dashboard/master-data/subscription/subscription.request.model";
import { CANCELLATION_REASONS_CREATE_UPDATE } from "@/constants/AppResource/status/create-update-status";

interface CancelSubscriptionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  subscriptionId?: string;
  onSubmit: (data: CancelSubscriptionRequest) => void;
  isSubmitting?: boolean;
}

export function CancelSubscriptionModal({
  open,
  onOpenChange,
  subscriptionId,
  onSubmit,
  isSubmitting = false,
}: CancelSubscriptionModalProps) {
  const [subscriptionData, setSubscriptionData] =
    useState<SubscriptionModel | null>(null);
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [formData, setFormData] = useState<CancelSubscriptionRequest>({
    reason: null,
    notes: null,
    refundAmount: null,
    refundNotes: null,
  });

  useEffect(() => {
    const fetchSubscriptionData = async () => {
      if (!subscriptionId || !open) return;

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
  }, [subscriptionId, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const payload: CancelSubscriptionRequest = {
      reason: formData.reason?.trim() || null,
      notes: formData.notes?.trim() || null,
      refundAmount:
        formData.refundAmount && formData.refundAmount > 0
          ? formData.refundAmount
          : null,
      refundNotes: formData.refundNotes?.trim() || null,
    };

    onSubmit(payload);
  };

  const handleOpenChange = (newOpen: boolean) => {
    onOpenChange(newOpen);
    if (!newOpen) {
      // Reset form when closing
      setFormData({
        reason: null,
        notes: null,
        refundAmount: null,
        refundNotes: null,
      });
      setSubscriptionData(null);
    }
  };

  const hasRefundAmount =
    (formData.refundAmount ?? null) !== null &&
    (formData.refundAmount ?? 0) > 0;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-2xl h-[90vh] p-0 gap-0 flex flex-col">
        {/* Header */}
        <DialogHeader className="px-6 py-4 border-b bg-muted/30 flex-shrink-0">
          <div className="flex items-center gap-4 pr-8">
            <div className="p-2 bg-red-100 rounded-full">
              <AlertTriangle className="h-5 w-5 text-red-600" />
            </div>
            <div className="flex-1">
              <DialogTitle className="text-xl font-semibold text-destructive">
                Cancel Subscription
              </DialogTitle>
              <DialogDescription className="text-base text-muted-foreground">
                {subscriptionData?.businessName ? (
                  <>
                    Canceling subscription for{" "}
                    <strong>{subscriptionData.businessName}</strong>
                    <br />
                    Current plan: <strong>{subscriptionData.planName}</strong>
                  </>
                ) : (
                  "Loading subscription information..."
                )}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {/* Content */}
        <div className="flex-1 min-h-0 overflow-y-auto">
          <div className="p-6">
            {/* Loading State */}
            {isLoadingData ? (
              <Loading />
            ) : subscriptionData ? (
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Cancellation Details */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <div className="w-1 h-6 bg-red-600 rounded-full"></div>
                    <h3 className="text-lg font-semibold text-foreground">
                      Cancellation Details
                    </h3>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="reason" className="text-sm font-medium">
                        Reason for Cancellation
                      </Label>
                      <Select
                        value={formData.reason || ""}
                        onValueChange={(value) =>
                          setFormData((prev) => ({ ...prev, reason: value }))
                        }
                        disabled={isSubmitting}
                      >
                        <SelectTrigger id="reason">
                          <SelectValue placeholder="Select a reason (optional)" />
                        </SelectTrigger>
                        <SelectContent>
                          {CANCELLATION_REASONS_CREATE_UPDATE.map((reason) => (
                            <SelectItem key={reason.value} value={reason.value}>
                              {reason.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="notes" className="text-sm font-medium">
                        Additional Notes
                      </Label>
                      <Textarea
                        id="notes"
                        placeholder="Tell us more about your experience or how we could improve..."
                        value={formData.notes || ""}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            notes: e.target.value,
                          }))
                        }
                        rows={3}
                        disabled={isSubmitting}
                      />
                      <p className="text-xs text-muted-foreground">
                        Help us understand your decision and improve our service
                      </p>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Refund Section */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <div className="w-1 h-6 bg-green-600 rounded-full"></div>
                    <h3 className="text-lg font-semibold text-foreground">
                      Refund Information
                    </h3>
                  </div>

                  <div className="space-y-4 p-4 border rounded-lg bg-muted/50">
                    <div className="space-y-2">
                      <Label
                        htmlFor="refundAmount"
                        className="text-sm font-medium"
                      >
                        Refund Amount ($)
                      </Label>
                      <Input
                        id="refundAmount"
                        type="number"
                        min="0"
                        step="0.01"
                        placeholder="0.00"
                        value={formData.refundAmount || ""}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            refundAmount: parseFloat(e.target.value) || null,
                          }))
                        }
                        disabled={isSubmitting}
                      />
                      <p className="text-xs text-muted-foreground">
                        Optional: Specify refund amount if applicable
                      </p>
                    </div>

                    {hasRefundAmount && (
                      <div className="space-y-2">
                        <Label
                          htmlFor="refundNotes"
                          className="text-sm font-medium"
                        >
                          Refund Notes
                        </Label>
                        <Textarea
                          id="refundNotes"
                          placeholder="Add notes about the refund..."
                          value={formData.refundNotes || ""}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              refundNotes: e.target.value,
                            }))
                          }
                          rows={2}
                          disabled={isSubmitting}
                        />
                        <p className="text-xs text-muted-foreground">
                          Provide details about the refund process or reason
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </form>
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground">
                  No subscription data available
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <DialogFooter className="p-6 border-t bg-muted/30 flex-shrink-0">
          <div className="flex gap-3 w-full">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting || isLoadingData}
              className="flex-1"
            >
              Keep Subscription
            </Button>
            <Button
              onClick={handleSubmit}
              variant="destructive"
              disabled={isSubmitting || isLoadingData || !subscriptionData}
              className="flex-1"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Canceling...
                </>
              ) : (
                "Cancel Subscription"
              )}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
