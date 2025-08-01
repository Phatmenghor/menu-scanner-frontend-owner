"use client";

import type React from "react";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
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
import type { SubscriptionModel } from "@/models/dashboard/subscription/subscription.response.model";
import type { RenewSubscriptionRequest } from "@/models/dashboard/subscription/subscription.request.model";
import { ComboboxSelectPlan } from "../combo-box/combobox-plan";
import type { SubscriptionPlanModel } from "@/models/dashboard/master-data/subscription-plan/subscription-plan-response";
import { CreditCard, Upload } from "lucide-react";
import { paymentMethodOptions } from "@/constants/AppResource/status/payment";
import { PAYMENT_STATUS_OPTIONS } from "@/constants/AppResource/status/status";
import type { UploadImageRequest } from "@/models/dashboard/image/image.request.model";
import { uploadImageService } from "@/services/dashboard/image/image.service";

interface RenewSubscriptionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  subscription: SubscriptionModel | null;
  onSubmit: (data: RenewSubscriptionRequest) => void;
  loading?: boolean;
}

export function RenewSubscriptionModal({
  open,
  onOpenChange,
  subscription,
  onSubmit,
  loading = false,
}: RenewSubscriptionModalProps) {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [formData, setFormData] = useState<RenewSubscriptionRequest>({
    newPlanId: "",
    customDurationDays: 30,
    createPayment: false,
    paymentAmount: 0,
    paymentImageUrl: "",
    paymentMethod: "",
    paymentNotes: "",
    paymentReferenceNumber: "",
    paymentStatus: "",
  });

  const [selectedPlan, setSelectedPlan] =
    useState<SubscriptionPlanModel | null>(null);

  const resetForm = () => {
    setFormData({
      newPlanId: "",
      customDurationDays: 30,
      createPayment: false,
      paymentAmount: 0,
      paymentImageUrl: "",
      paymentMethod: "",
      paymentNotes: "",
      paymentReferenceNumber: "",
      paymentStatus: "",
    });
    setSelectedPlan(null);
    setLogoPreview(null);
  };

  // Clean up blob URLs
  useEffect(() => {
    return () => {
      if (logoPreview?.startsWith("blob:")) {
        URL.revokeObjectURL(logoPreview);
      }
    };
  }, [logoPreview]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64String = reader.result as string;
        const base64Data = base64String.split(",")[1];
        const payload: UploadImageRequest = {
          base64: base64Data,
          type: file.type,
        };

        const response = await uploadImageService(payload);
        if (response?.imageUrl) {
          console.log(
            "Image Preview URL:",
            process.env.NEXT_PUBLIC_API_BASE_URL + response.imageUrl
          );
          setLogoPreview(response?.imageUrl);
          setFormData((prev) => ({
            ...prev,
            paymentImageUrl:
              process.env.NEXT_PUBLIC_API_BASE_URL + response.imageUrl,
          }));
        }
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error("Failed to upload image", error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveLogo = () => {
    setLogoPreview(null);
    setFormData((prev) => ({
      ...prev,
      paymentImageUrl: "",
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleOpenChange = (newOpen: boolean) => {
    onOpenChange(newOpen);

    if (!newOpen) {
      resetForm();
    }
  };

  const handlePlanChange = (data: SubscriptionPlanModel) => {
    setSelectedPlan(data);
    setFormData((prev) => ({
      ...prev,
      newPlanId: data.id,
      // Auto-calculate payment amount based on plan price if available
      paymentAmount: prev.createPayment ? data.price || 0 : 0,
    }));
  };

  const getImageSource = () => {
    return logoPreview?.startsWith("http")
      ? logoPreview
      : (process.env.NEXT_PUBLIC_API_BASE_URL ?? "") + logoPreview;
  };

  const handleCreatePaymentChange = (checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      createPayment: checked,
      paymentAmount: checked && selectedPlan ? selectedPlan.price || 0 : 0,
      paymentStatus: checked ? "pending" : "",
    }));
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="w-full max-w-lg md:max-w-xl lg:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Renew Subscription</DialogTitle>
          <DialogDescription>
            Renewing subscription for {subscription?.businessName} - Current
            plan: {subscription?.displayName}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Subscription Details */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="newPlanId">New Plan *</Label>
              <ComboboxSelectPlan
                dataSelect={selectedPlan}
                onChangeSelected={handlePlanChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="customDurationDays">Duration (Days) *</Label>
              <Input
                id="customDurationDays"
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                value={formData.customDurationDays?.toString() || ""}
                onChange={(e) => {
                  const raw = e.target.value;
                  const parsed = parseInt(raw);
                  setFormData((prev) => ({
                    ...prev,
                    customDurationDays: isNaN(parsed) ? 0 : parsed,
                  }));
                }}
                placeholder="Enter number of days"
                required
                disabled={loading}
              />
              <p className="text-sm text-muted-foreground">
                Enter the number of days for subscription renewal
              </p>
            </div>
          </div>

          <Separator />

          {/* Payment Section */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="createPayment"
                checked={formData.createPayment}
                onCheckedChange={handleCreatePaymentChange}
                disabled={loading}
              />
              <Label
                htmlFor="createPayment"
                className="flex items-center gap-2"
              >
                <CreditCard className="h-4 w-4" />
                Create Payment Record
              </Label>
            </div>

            {formData.createPayment && (
              <div className="space-y-4 p-4 border rounded-lg bg-muted/50">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="paymentAmount">Payment Amount *</Label>
                    <Input
                      id="paymentAmount"
                      type="text"
                      inputMode="decimal"
                      pattern="^\d*\.?\d*$"
                      placeholder="Enter amount"
                      value={formData.paymentAmount?.toString() || ""}
                      onChange={(e) => {
                        const raw = e.target.value;
                        const parsed = parseFloat(raw);
                        setFormData((prev) => ({
                          ...prev,
                          paymentAmount: isNaN(parsed) ? 0 : parsed,
                        }));
                      }}
                      required={formData.createPayment}
                      disabled={loading}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="paymentMethod">Payment Method</Label>
                    <Select
                      value={formData.paymentMethod}
                      onValueChange={(value) =>
                        setFormData((prev) => ({
                          ...prev,
                          paymentMethod: value,
                        }))
                      }
                      disabled={loading}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Choose payment method" />
                      </SelectTrigger>
                      <SelectContent>
                        {paymentMethodOptions.map((item) => (
                          <SelectItem key={item.value} value={item.value}>
                            💳 {item.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="paymentReferenceNumber">
                      Reference Number
                    </Label>
                    <Input
                      id="paymentReferenceNumber"
                      placeholder="Transaction ID, Check #, etc."
                      value={formData.paymentReferenceNumber}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          paymentReferenceNumber: e.target.value,
                        }))
                      }
                      disabled={loading}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="paymentStatus">Payment Status</Label>
                    <Select
                      value={formData.paymentStatus}
                      onValueChange={(value) =>
                        setFormData((prev) => ({
                          ...prev,
                          paymentStatus: value,
                        }))
                      }
                      disabled={loading}
                    >
                      <SelectTrigger id="paymentStatus">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        {PAYMENT_STATUS_OPTIONS.map((payment) => (
                          <SelectItem key={payment.value} value={payment.value}>
                            {payment.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="paymentImageUrl">Payment Receipt/Proof</Label>
                  <div className="flex flex-col items-center gap-4">
                    {logoPreview ? (
                      <div className="relative">
                        <img
                          src={getImageSource() || "/placeholder.svg"}
                          alt="Payment Receipt"
                          className="w-32 h-32 rounded-lg object-cover border border-gray-300"
                        />
                        <button
                          type="button"
                          onClick={handleRemoveLogo}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 text-sm flex items-center justify-center hover:bg-red-600"
                          title="Remove receipt image"
                        >
                          ×
                        </button>
                      </div>
                    ) : (
                      <div
                        className="w-32 h-32 rounded-lg bg-gray-100 flex flex-col items-center justify-center border border-dashed border-gray-400 hover:border-blue-500 cursor-pointer"
                        onClick={() => fileInputRef.current?.click()}
                        title="Upload receipt image"
                      >
                        <Upload className="h-8 w-8 text-gray-400 mb-2" />
                        <span className="text-sm text-gray-500 text-center">
                          {isUploading ? "Uploading..." : "Upload Receipt"}
                        </span>
                      </div>
                    )}

                    <input
                      type="file"
                      ref={fileInputRef}
                      accept="image/*"
                      className="hidden"
                      onChange={handleFileChange}
                      disabled={isUploading || loading}
                    />

                    <p className="text-sm text-muted-foreground text-center">
                      Upload payment receipt or proof of payment
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="paymentNotes">Payment Notes</Label>
                  <Textarea
                    id="paymentNotes"
                    placeholder="Additional payment details or notes..."
                    value={formData.paymentNotes}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        paymentNotes: e.target.value,
                      }))
                    }
                    rows={3}
                    disabled={loading}
                  />
                </div>
              </div>
            )}
          </div>

          <DialogFooter className="gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!formData.newPlanId || loading || isUploading}
            >
              {loading
                ? "Processing..."
                : isUploading
                ? "Uploading..."
                : "Renew Subscription"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
