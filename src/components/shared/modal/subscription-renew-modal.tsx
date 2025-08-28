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
import { CreditCard, Upload, RotateCcw, Loader2, X } from "lucide-react";
import { SubscriptionModel } from "@/models/dashboard/master-data/subscription/subscription.response.model";
import { getSubscriptionByIdService } from "@/services/dashboard/subscription/subscription.service";
import { ComboboxSelectPlan } from "../combo-box/combobox-plan";
import type { SubscriptionPlanModel } from "@/models/dashboard/master-data/subscription-plan/subscription-plan-response";
import type { UploadImageRequest } from "@/models/dashboard/image/image.request.model";
import { uploadImageService } from "@/services/dashboard/image/image.service";
import {
  PAYMENT_METHODS_CREATE_UPDATE,
  PAYMENT_STATUS_CREATE_UPDATE,
} from "@/constants/AppResource/status/create-update-status";
import { PaymentStatus } from "@/constants/AppResource/status/status";
import Loading from "@/components/shared/common/loading";
import { RenewSubscriptionRequest } from "@/models/dashboard/master-data/subscription/subscription.request.model";

// Updated request interface to match Java DTO

interface RenewSubscriptionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  subscriptionId?: string;
  onSubmit: (data: RenewSubscriptionRequest) => void;
  isSubmitting?: boolean;
}

export function RenewSubscriptionModal({
  open,
  onOpenChange,
  subscriptionId,
  onSubmit,
  isSubmitting = false,
}: RenewSubscriptionModalProps) {
  const [subscriptionData, setSubscriptionData] =
    useState<SubscriptionModel | null>(null);
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [selectedPlan, setSelectedPlan] =
    useState<SubscriptionPlanModel | null>(null);

  const [formData, setFormData] = useState<RenewSubscriptionRequest>({
    newPlanId: "",
    customDurationDays: 30,
    createPayment: false,
    paymentAmount: 0,
    paymentImageUrl: "",
    paymentMethod: "",
    paymentNotes: "",
    paymentReferenceNumber: "",
    paymentStatus: PaymentStatus.COMPLETED,
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

  // Reset form when modal opens and subscription data is loaded
  useEffect(() => {
    if (open && subscriptionData) {
      setFormData({
        newPlanId: subscriptionData.planId || "",
        customDurationDays: subscriptionData.planDurationDays || 30,
        createPayment: false,
        paymentAmount: 0,
        paymentImageUrl: "",
        paymentMethod: "",
        paymentNotes: "",
        paymentReferenceNumber: "",
        paymentStatus: PaymentStatus.COMPLETED,
      });

      // Set current plan as selected
      setSelectedPlan({
        id: subscriptionData.planId,
        name: subscriptionData.planName,
        price: subscriptionData.planPrice,
        durationDays: subscriptionData.planDurationDays,
      } as SubscriptionPlanModel);
    }
  }, [open, subscriptionData]);

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
          const fullImageUrl =
            process.env.NEXT_PUBLIC_API_BASE_URL + response.imageUrl;
          setLogoPreview(response.imageUrl);
          setFormData((prev) => ({
            ...prev,
            paymentImageUrl: fullImageUrl,
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

    const payload: RenewSubscriptionRequest = {
      newPlanId: formData.newPlanId,
      customDurationDays: formData.customDurationDays,
      createPayment: formData.createPayment,
      ...(formData.createPayment && {
        paymentAmount: formData.paymentAmount,
        paymentImageUrl: formData.paymentImageUrl,
        paymentMethod: formData.paymentMethod,
        paymentStatus: formData.paymentStatus,
        paymentReferenceNumber: formData.paymentReferenceNumber,
        paymentNotes: formData.paymentNotes,
      }),
    };

    onSubmit(payload);
  };

  const handleOpenChange = (newOpen: boolean) => {
    onOpenChange(newOpen);
    if (!newOpen) {
      setSelectedPlan(null);
      setLogoPreview(null);
      setSubscriptionData(null);
    }
  };

  const handlePlanChange = (plan: SubscriptionPlanModel | null) => {
    setSelectedPlan(plan);
    setFormData((prev) => ({
      ...prev,
      newPlanId: plan?.id || "",
      customDurationDays: plan?.durationDays || prev.customDurationDays,
      paymentAmount:
        prev.createPayment && plan ? plan.price || 0 : prev.paymentAmount,
    }));
  };

  const handleCreatePaymentChange = (checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      createPayment: checked,
      paymentAmount: checked && selectedPlan ? selectedPlan.price || 0 : 0,
      paymentStatus: checked ? "PENDING" : "",
    }));
  };

  const getImageSource = () => {
    return logoPreview?.startsWith("http")
      ? logoPreview
      : (process.env.NEXT_PUBLIC_API_BASE_URL ?? "") + logoPreview;
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-2xl h-[90vh] p-0 gap-0 flex flex-col">
        {/* Header */}
        <DialogHeader className="px-6 py-4 border-b bg-muted/30 flex-shrink-0">
          <div className="flex items-center gap-4 pr-8">
            <div className="p-2 bg-blue-100 rounded-full">
              <RotateCcw className="h-5 w-5 text-blue-600" />
            </div>
            <div className="flex-1">
              <DialogTitle className="text-xl font-semibold">
                Renew Subscription
              </DialogTitle>
              <DialogDescription className="text-base text-muted-foreground">
                {subscriptionData?.businessName ? (
                  <>
                    Renewing subscription for{" "}
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
                {/* Subscription Details */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <div className="w-1 h-6 bg-blue-600 rounded-full"></div>
                    <h3 className="text-lg font-semibold text-foreground">
                      Renewal Details
                    </h3>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label
                        htmlFor="newPlanId"
                        className="text-sm font-medium"
                      >
                        New Plan <span className="text-red-500">*</span>
                      </Label>
                      <ComboboxSelectPlan
                        dataSelect={selectedPlan}
                        onChangeSelected={handlePlanChange}
                        disabled={isSubmitting}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="customDurationDays"
                        className="text-sm font-medium"
                      >
                        Duration (Days) <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="customDurationDays"
                        type="number"
                        min="1"
                        value={formData.customDurationDays?.toString() || ""}
                        onChange={(e) => {
                          const value = parseInt(e.target.value) || 0;
                          setFormData((prev) => ({
                            ...prev,
                            customDurationDays: value,
                          }));
                        }}
                        placeholder="Enter number of days"
                        required
                        disabled={isSubmitting}
                      />
                      <p className="text-xs text-muted-foreground">
                        Enter the number of days for subscription renewal
                      </p>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Payment Section */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <div className="w-1 h-6 bg-green-600 rounded-full"></div>
                    <h3 className="text-lg font-semibold text-foreground">
                      Payment Information
                    </h3>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="createPayment"
                      checked={formData.createPayment}
                      onCheckedChange={handleCreatePaymentChange}
                      disabled={isSubmitting}
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
                          <Label
                            htmlFor="paymentAmount"
                            className="text-sm font-medium"
                          >
                            Payment Amount{" "}
                            <span className="text-red-500">*</span>
                          </Label>
                          <Input
                            id="paymentAmount"
                            type="number"
                            min="0"
                            step="0.01"
                            placeholder="Enter amount"
                            value={formData.paymentAmount?.toString() || ""}
                            onChange={(e) => {
                              const value = parseFloat(e.target.value) || 0;
                              setFormData((prev) => ({
                                ...prev,
                                paymentAmount: value,
                              }));
                            }}
                            required={formData.createPayment}
                            disabled={isSubmitting}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label
                            htmlFor="paymentMethod"
                            className="text-sm font-medium"
                          >
                            Payment Method
                          </Label>
                          <Select
                            value={formData.paymentMethod}
                            onValueChange={(value) =>
                              setFormData((prev) => ({
                                ...prev,
                                paymentMethod: value,
                              }))
                            }
                            disabled={isSubmitting}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Choose payment method" />
                            </SelectTrigger>
                            <SelectContent>
                              {PAYMENT_METHODS_CREATE_UPDATE.map((method) => (
                                <SelectItem
                                  key={method.value}
                                  value={method.value}
                                >
                                  {method.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label
                            htmlFor="paymentReferenceNumber"
                            className="text-sm font-medium"
                          >
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
                            disabled={isSubmitting}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label
                            htmlFor="paymentStatus"
                            className="text-sm font-medium"
                          >
                            Payment Status
                          </Label>
                          <Select
                            value={formData.paymentStatus}
                            onValueChange={(value) =>
                              setFormData((prev) => ({
                                ...prev,
                                paymentStatus: value,
                              }))
                            }
                            disabled={isSubmitting}
                          >
                            <SelectTrigger id="paymentStatus">
                              <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                            <SelectContent>
                              {PAYMENT_STATUS_CREATE_UPDATE.map((status) => (
                                <SelectItem
                                  key={status.value}
                                  value={status.value}
                                >
                                  {status.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      {/* Payment Receipt Upload */}
                      <div className="space-y-2">
                        <Label className="text-sm font-medium">
                          Payment Receipt/Proof
                        </Label>
                        <div className="flex flex-col items-center gap-4">
                          {logoPreview ? (
                            <div className="relative">
                              <img
                                src={getImageSource()}
                                alt="Payment Receipt"
                                className="w-24 h-24 rounded-lg object-cover border border-gray-300"
                              />
                              <button
                                type="button"
                                onClick={handleRemoveLogo}
                                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 text-xs flex items-center justify-center hover:bg-red-600"
                                title="Remove receipt image"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </div>
                          ) : (
                            <div
                              className="w-24 h-24 rounded-lg bg-gray-100 flex flex-col items-center justify-center border border-dashed border-gray-400 hover:border-blue-500 cursor-pointer transition-colors"
                              onClick={() => fileInputRef.current?.click()}
                            >
                              <Upload className="h-6 w-6 text-gray-400" />
                              <span className="text-xs text-gray-500 mt-1">
                                {isUploading ? "Uploading..." : "Upload"}
                              </span>
                            </div>
                          )}

                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => fileInputRef.current?.click()}
                            disabled={isUploading || isSubmitting}
                            className="text-xs"
                          >
                            {isUploading ? (
                              <>
                                <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                                Uploading...
                              </>
                            ) : (
                              <>
                                <Upload className="mr-2 h-3 w-3" />
                                {logoPreview
                                  ? "Change Receipt"
                                  : "Upload Receipt"}
                              </>
                            )}
                          </Button>

                          <input
                            type="file"
                            ref={fileInputRef}
                            accept="image/*"
                            className="hidden"
                            onChange={handleFileChange}
                            disabled={isUploading || isSubmitting}
                          />

                          <p className="text-xs text-muted-foreground text-center">
                            Upload payment receipt or proof of payment
                          </p>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label
                          htmlFor="paymentNotes"
                          className="text-sm font-medium"
                        >
                          Payment Notes
                        </Label>
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
                          disabled={isSubmitting}
                        />
                      </div>
                    </div>
                  )}
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
              disabled={isSubmitting || isUploading || isLoadingData}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={
                !formData.newPlanId ||
                isSubmitting ||
                isUploading ||
                isLoadingData ||
                !subscriptionData
              }
              className="flex-1"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : isUploading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Uploading...
                </>
              ) : (
                "Renew Subscription"
              )}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
