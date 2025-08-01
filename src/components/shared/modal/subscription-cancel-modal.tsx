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
import { SubscriptionModel } from "@/models/dashboard/subscription/subscription.response.model";
import { CancelSubscriptionRequest } from "@/models/dashboard/subscription/subscription.request.model";

interface CancelSubscriptionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  subscription: SubscriptionModel | null;
  onSubmit: (data: CancelSubscriptionRequest) => void;
}

export function CancelSubscriptionModal({
  open,
  onOpenChange,
  subscription,
  onSubmit,
}: CancelSubscriptionModalProps) {
  const [formData, setFormData] = useState<CancelSubscriptionRequest>({
    reason: "",
    notes: "",
    refundAmount: 0,
    refundNotes: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      notes: formData.notes ?? null,
      reason: formData.reason ?? null,
      refundAmount: formData.refundAmount ?? null,
      refundNotes: formData.refundNotes ?? null,
    });
    onOpenChange(false);
    // Reset form
    setFormData({
      reason: "",
      notes: "",
      refundAmount: 0,
      refundNotes: "",
    });
  };

  const handleOpenChange = (newOpen: boolean) => {
    onOpenChange(newOpen);
    if (!newOpen) {
      // Reset form when closing
      setFormData({
        reason: "",
        notes: "",
        refundAmount: 0,
        refundNotes: "",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="w-full max-w-lg md:max-w-xl lg:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Cancel Subscription</DialogTitle>
          <DialogDescription>
            Canceling subscription for {subscription?.businessName} - Current
            plan: {subscription?.displayName}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="reason">Reason for Cancellation</Label>
            <Select
              value={formData.reason}
              onValueChange={(value) =>
                setFormData((prev) => ({ ...prev, reason: value }))
              }
            >
              <SelectTrigger id="reason">
                <SelectValue placeholder="Select a reason (optional)" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="too-expensive">Too expensive</SelectItem>
                <SelectItem value="not-using">Not using enough</SelectItem>
                <SelectItem value="missing-features">
                  Missing features
                </SelectItem>
                <SelectItem value="found-alternative">
                  Found alternative
                </SelectItem>
                <SelectItem value="technical-issues">
                  Technical issues
                </SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="cancelNotes">Additional Notes</Label>
            <Textarea
              id="cancelNotes"
              placeholder="Tell us more about your experience or how we could improve..."
              value={formData.notes}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, notes: e.target.value }))
              }
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="refundAmount">Refund Amount ($)</Label>
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
                  refundAmount: Number.parseFloat(e.target.value) || 0,
                }))
              }
            />
            <p className="text-sm text-muted-foreground">
              Optional: Specify refund amount if applicable
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="refundNotes">Refund Notes</Label>
            <Textarea
              id="refundNotes"
              placeholder="Add notes about the refund..."
              value={formData.refundNotes}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  refundNotes: e.target.value,
                }))
              }
              rows={2}
            />
          </div>

          <DialogFooter className="gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Keep Subscription
            </Button>
            <Button type="submit" variant="destructive">
              Cancel Subscription
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
