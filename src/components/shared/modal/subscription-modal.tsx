"use client";

import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2, CalendarDays } from "lucide-react";
import {
  UpdateSubscriptionSchema,
  SubscriptionFormData,
} from "@/models/dashboard/master-data/subscription/subscription.schema";
import { SubscriptionModel } from "@/models/dashboard/master-data/subscription/subscription.response.model";
import { getSubscriptionByIdService } from "@/services/dashboard/subscription/subscription.service";
import { ComboboxSelectPlan } from "../combo-box/combobox-plan";
import { SubscriptionPlanModel } from "@/models/dashboard/master-data/subscription-plan/subscription-plan-response";
import Loading from "@/components/shared/common/loading";
import { CustomDatePicker } from "../common/custom-date-picker";

// Updated request interface to match Java DTO
export interface UpdateSubscriptionRequest {
  planId: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
  autoRenew: boolean;
}

type Props = {
  subscriptionId?: string;
  onClose: () => void;
  isOpen: boolean;
  isSubmitting?: boolean;
  onSave: (data: UpdateSubscriptionRequest) => void;
  error?: string | null;
};

export default function ModalSubscription({
  isOpen,
  onClose,
  subscriptionId,
  onSave,
  isSubmitting = false,
  error = null,
}: Props) {
  const [subscriptionData, setSubscriptionData] =
    useState<SubscriptionModel | null>(null);
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [selectedPlan, setSelectedPlan] =
    useState<SubscriptionPlanModel | null>(null);

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isDirty },
  } = useForm<SubscriptionFormData>({
    resolver: zodResolver(UpdateSubscriptionSchema),
    defaultValues: {
      id: "",
      planId: "",
      startDate: "",
      endDate: "",
      isActive: false,
      autoRenew: false,
      notes: "",
    },
    mode: "onChange",
  });

  // Fetch subscription data for edit mode
  useEffect(() => {
    const fetchSubscriptionData = async () => {
      if (!subscriptionId || !isOpen) return;

      setIsLoadingData(true);
      try {
        const data = await getSubscriptionByIdService(subscriptionId);
        setSubscriptionData(data);

        // Populate form with fetched data
        const formData = {
          id: data?.id || "",
          planId: data?.planId || "",
          startDate: data?.startDate
            ? new Date(data.startDate).toISOString().split("T")[0] // Format as YYYY-MM-DD
            : "",
          endDate: data?.endDate
            ? new Date(data.endDate).toISOString().split("T")[0] // Format as YYYY-MM-DD
            : "",
          isActive: data?.isActive || false,
          autoRenew: data?.autoRenew || false,
          notes: data?.notes || "",
        };
        reset(formData);

        // Set selected plan for combobox
        if (data?.planId) {
          setSelectedPlan({
            id: data.planId,
            name: data.planName,
            price: data.planPrice,
            durationDays: data.planDurationDays,
          } as SubscriptionPlanModel);
        }
      } catch (error: any) {
        console.error("Error fetching subscription data:", error);
      } finally {
        setIsLoadingData(false);
      }
    };

    fetchSubscriptionData();
  }, [subscriptionId, isOpen, reset]);

  const onSubmit = (data: SubscriptionFormData) => {
    const payload: UpdateSubscriptionRequest = {
      planId: (data.planId || "").trim(),
      startDate: data.startDate || "",
      endDate: data.endDate || "",
      isActive: data.isActive ?? false,
      autoRenew: data.autoRenew ?? false,
    };

    onSave(payload);
  };

  const handlePlanChange = (plan: SubscriptionPlanModel | null) => {
    setSelectedPlan(plan);
    setValue("planId", plan?.id || "", {
      shouldValidate: true,
      shouldDirty: true,
    });
  };

  const handleClose = () => {
    reset();
    setSubscriptionData(null);
    setSelectedPlan(null);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl h-[90vh] p-0 gap-0 flex flex-col">
        {/* Header */}
        <DialogHeader className="px-6 py-4 border-b bg-muted/30 flex-shrink-0">
          <div className="flex items-center gap-4 pr-8">
            <div className="p-2 bg-green-100 rounded-full">
              <CalendarDays className="h-5 w-5 text-green-600" />
            </div>
            <div className="flex-1">
              <DialogTitle className="text-xl font-semibold">
                Edit Subscription
              </DialogTitle>
              <DialogDescription className="text-base text-muted-foreground">
                {subscriptionData?.businessName
                  ? `Update subscription for "${subscriptionData.businessName}"`
                  : "Loading subscription information..."}
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
            ) : subscriptionData ? (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                {/* Error Display */}
                {error && (
                  <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-md">
                    <p className="text-sm text-destructive font-medium">
                      {error}
                    </p>
                  </div>
                )}

                {/* Plan Selection */}
                <div className="space-y-2">
                  <Label htmlFor="planId" className="text-sm font-medium">
                    Plan <span className="text-red-500">*</span>
                  </Label>
                  <Controller
                    name="planId"
                    control={control}
                    render={({ field }) => (
                      <ComboboxSelectPlan
                        dataSelect={selectedPlan}
                        onChangeSelected={handlePlanChange}
                        disabled={isSubmitting}
                      />
                    )}
                  />
                  {errors.planId && (
                    <p className="text-sm text-red-600">
                      {errors.planId.message}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Start Date */}
                  <div className="space-y-2">
                    <Label htmlFor="startDate" className="text-sm font-medium">
                      Start Date <span className="text-red-500">*</span>
                    </Label>
                    <Controller
                      name="startDate"
                      control={control}
                      render={({ field }) => (
                        <CustomDatePicker
                          value={field.value}
                          onChange={(date) => {
                            field.onChange(date);
                            setValue("startDate", date, {
                              shouldDirty: true,
                              shouldTouch: true,
                            });
                          }}
                          disabled={isSubmitting}
                          placeholder="Select start date"
                          error={!!errors.startDate}
                        />
                      )}
                    />
                    {errors.startDate && (
                      <p className="text-sm text-red-600">
                        {errors.startDate.message}
                      </p>
                    )}
                  </div>

                  {/* End Date */}
                  <div className="space-y-2">
                    <Label htmlFor="endDate" className="text-sm font-medium">
                      End Date
                    </Label>
                    <Controller
                      name="endDate"
                      control={control}
                      render={({ field }) => (
                        <CustomDatePicker
                          value={field.value}
                          onChange={(date) => {
                            field.onChange(date);
                            setValue("endDate", date, {
                              shouldDirty: true,
                              shouldTouch: true,
                            });
                          }}
                          disabled={isSubmitting}
                          placeholder="Select end date"
                          error={!!errors.endDate}
                        />
                      )}
                    />
                    {errors.endDate && (
                      <p className="text-sm text-red-600">
                        {errors.endDate.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Is Active */}
                  <div className="space-y-2">
                    <Label htmlFor="isActive" className="text-sm font-medium">
                      Status
                    </Label>
                    <Controller
                      name="isActive"
                      control={control}
                      render={({ field }) => (
                        <Select
                          value={field.value ? "true" : "false"}
                          onValueChange={(value) => {
                            const isActive = value === "true";
                            field.onChange(isActive);
                            setValue("isActive", isActive, {
                              shouldDirty: true,
                              shouldTouch: true,
                            });
                          }}
                          disabled={isSubmitting}
                        >
                          <SelectTrigger className="transition-colors focus:border-green-500">
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="true">
                              <div className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                Active
                              </div>
                            </SelectItem>
                            <SelectItem value="false">
                              <div className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                                Inactive
                              </div>
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    />
                    {errors.isActive && (
                      <p className="text-sm text-red-600">
                        {errors.isActive.message}
                      </p>
                    )}
                  </div>

                  {/* Auto Renew */}
                  <div className="space-y-2">
                    <Label htmlFor="autoRenew" className="text-sm font-medium">
                      Auto Renew
                    </Label>
                    <Controller
                      name="autoRenew"
                      control={control}
                      render={({ field }) => (
                        <Select
                          value={field.value ? "true" : "false"}
                          onValueChange={(value) => {
                            const autoRenew = value === "true";
                            field.onChange(autoRenew);
                            setValue("autoRenew", autoRenew, {
                              shouldDirty: true,
                              shouldTouch: true,
                            });
                          }}
                          disabled={isSubmitting}
                        >
                          <SelectTrigger className="transition-colors focus:border-green-500">
                            <SelectValue placeholder="Select auto renew" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="true">
                              <div className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                Yes
                              </div>
                            </SelectItem>
                            <SelectItem value="false">
                              <div className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                                No
                              </div>
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    />
                    {errors.autoRenew && (
                      <p className="text-sm text-red-600">
                        {errors.autoRenew.message}
                      </p>
                    )}
                  </div>
                </div>

                {/* Additional Info Card */}
                {subscriptionData && (
                  <div className="mt-6 p-4 bg-muted/30 rounded-lg border border-border">
                    <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                      Current Subscription Details
                    </h4>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Business:</span>
                        <p className="font-medium">
                          {subscriptionData.businessName}
                        </p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">
                          Current Plan:
                        </span>
                        <p className="font-medium">
                          {subscriptionData.planName}
                        </p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Price:</span>
                        <p className="font-medium">
                          ${subscriptionData.planPrice}
                        </p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Duration:</span>
                        <p className="font-medium">
                          {subscriptionData.planDurationDays} days
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </form>
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground">
                  No subscription data available
                </p>
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Footer */}
        <div className="flex justify-between items-center p-6 border-t bg-muted/30 flex-shrink-0">
          <div className="text-sm text-muted-foreground flex items-center gap-2">
            {isSubmitting ? (
              <>
                <Loader2 className="h-3 w-3 animate-spin" />
                Updating subscription...
              </>
            ) : isDirty ? (
              <>
                <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                You have unsaved changes
              </>
            ) : (
              <>
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                No changes made
              </>
            )}
          </div>
          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit(onSubmit)}
              disabled={isSubmitting || !isDirty}
              className="min-w-[120px]"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                "Update Subscription"
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
