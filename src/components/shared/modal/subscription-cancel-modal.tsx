"use client";

import type React from "react";
import { useState } from "react";
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
import { Loader2, AlertTriangle } from "lucide-react";
import { SubscriptionModel } from "@/models/dashboard/subscription/subscription.response.model";

// Updated request interface to match Java DTO
export interface CancelSubscriptionRequest {
  reason?: string | null;
  notes?: string | null;
  refundAmount?: number | null;
  refundNotes?: string | null;
}

interface CancelSubscriptionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  subscription: SubscriptionModel | null;
  onSubmit: (data: CancelSubscriptionRequest) => void;
  isSubmitting?: boolean;
}

const CANCELLATION_REASONS = [
  { value: "too-expensive", label: "Too expensive" },
  { value: "not-using", label: "Not using enough" },
  { value: "missing-features", label: "Missing features" },
  { value: "found-alternative", label: "Found alternative" },
  { value: "technical-issues", label: "Technical issues" },
  { value: "business-closed", label: "Business closed" },
  { value: "other", label: "Other" },
];

export function CancelSubscriptionModal({
  open,
  onOpenChange,
  subscription,
  onSubmit,
  isSubmitting = false,
}: CancelSubscriptionModalProps) {
  const [formData, setFormData] = useState<CancelSubscriptionRequest>({
    reason: null,
    notes: null,
    refundAmount: null,
    refundNotes: null,
  });

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
    }
  };

  const hasRefundAmount =
    formData.refundAmount !== null && formData.refundAmount > 0;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-md">
        {/* Header */}
        <DialogHeader className="text-center space-y-4">
          <div className="mx-auto p-3 bg-red-100 rounded-full w-fit">
            <AlertTriangle className="h-6 w-6 text-red-600" />
          </div>
          <div>
            <DialogTitle className="text-xl font-semibold text-destructive">
              Cancel Subscription
            </DialogTitle>
            <DialogDescription className="text-sm text-muted-foreground mt-2">
              {subscription?.businessName && (
                <span>
                  Canceling subscription for{" "}
                  <strong>{subscription.businessName}</strong>
                  <br />
                  Current plan: <strong>{subscription.planName}</strong>
                </span>
              )}
            </DialogDescription>
          </div>
        </DialogHeader>

        {/* Content */}
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          {/* Cancellation Reason */}
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
                {CANCELLATION_REASONS.map((reason) => (
                  <SelectItem key={reason.value} value={reason.value}>
                    {reason.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Additional Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes" className="text-sm font-medium">
              Additional Notes
            </Label>
            <Textarea
              id="notes"
              placeholder="Tell us more about your experience or how we could improve..."
              value={formData.notes || ""}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, notes: e.target.value }))
              }
              rows={3}
              disabled={isSubmitting}
            />
          </div>

          {/* Refund Section */}
          <div className="space-y-3 p-4 bg-muted/50 rounded-lg border">
            <h4 className="text-sm font-medium">Refund Information</h4>

            <div className="space-y-2">
              <Label htmlFor="refundAmount" className="text-sm font-medium">
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
                <Label htmlFor="refundNotes" className="text-sm font-medium">
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
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
              className="flex-1"
            >
              Keep Subscription
            </Button>
            <Button
              type="submit"
              variant="destructive"
              disabled={isSubmitting}
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
        </form>
      </DialogContent>
    </Dialog>
  );
}
