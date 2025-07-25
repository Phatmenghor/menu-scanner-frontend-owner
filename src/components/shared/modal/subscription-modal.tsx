import React, { useCallback, useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ModalMode } from "@/constants/AppResource/status/status";
import {
  CreateSubscriptionSchema,
  SubscriptionFormData,
  UpdateSubscriptionSchema,
} from "@/models/dashboard/subscription/subscription.schema";
import { Checkbox } from "@/components/ui/checkbox";
import { ComboboxSelectBusiness } from "../combo-box/combobox-business";
import { BusinessModel } from "@/models/dashboard/master-data/business/business.response.model";
import { SubscriptionPlanModel } from "@/models/dashboard/master-data/subscription-plan/subscription-plan-response";
import { ComboboxSelectPlan } from "../combo-box/combobox-plan";
import { addDays, format } from "date-fns";

type Props = {
  mode: ModalMode;
  Data?: SubscriptionFormData | null;
  onClose: () => void;
  isOpen: boolean;
  isSubmitting?: boolean;
  onSave: (data: SubscriptionFormData) => void;
};

export default function ModalSubscription({
  isOpen,
  onClose,
  Data,
  mode,
  onSave,
  isSubmitting = false,
}: Props) {
  const [selectedBusiness, setSelectedBusiness] =
    useState<BusinessModel | null>(null);
  const [selectedPlan, setSelectedPlan] =
    useState<SubscriptionPlanModel | null>(null);

  const isCreate = mode === ModalMode.CREATE_MODE;
  const schema = isCreate ? CreateSubscriptionSchema : UpdateSubscriptionSchema;

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    trigger,
    watch,
    formState: { errors },
  } = useForm<SubscriptionFormData>({
    resolver: zodResolver(schema), // Use dynamic schema instead of hardcoded UserFormSchema
    defaultValues: {
      autoRenew: false,
      businessId: "",
      endDate: "",
      id: "",
      isActive: false,
      notes: "",
      planId: "",
      startDate: "",
    },
    mode: "onChange",
  });

  watch("businessId");
  watch("planId");

  // Reset form when modal opens or data changes
  useEffect(() => {
    if (isOpen) {
      const formData = {
        id: Data?.id || "",
        planId: Data?.planId || "",
        businessId: Data?.businessId || "",
        autoRenew: Data?.autoRenew || false,
        endDate: Data?.endDate || "",
        isActive: Data?.isActive || false,
        notes: Data?.notes || "",
        startDate: Data?.startDate || "",
      };

      reset(formData);
    }
  }, [isOpen, Data, reset]);

  const onSubmit = (data: SubscriptionFormData) => {
    console.log("Form submitted with mode:", mode, "Data:", data); // Debug log

    const today = new Date();
    const formattedStartDate = format(today, "yyyy-MM-dd");

    const calculatedEndDate = selectedPlan?.durationDays
      ? format(addDays(today, selectedPlan.durationDays), "yyyy-MM-dd")
      : undefined;

    const payload: SubscriptionFormData = {
      id: Data?.id?.trim() || undefined,
      planId: data?.planId.trim() || "",
      businessId: data?.businessId?.trim() || undefined,
      startDate: formattedStartDate || "",
      endDate: calculatedEndDate || undefined,
      notes: data?.notes || undefined,
      autoRenew: data?.autoRenew || false,
      isActive: data?.isActive || false,
    };
    console.log(" Payload:", payload);
    onSave(payload);
    onClose();
  };

  const handleBusinessChange = useCallback(
    (business: BusinessModel | null) => {
      console.log("business changed:", business);
      setSelectedBusiness(business);
      setValue("businessId", business?.id, {
        shouldValidate: true,
        shouldDirty: true,
      });
      trigger("businessId");
    },
    [selectedBusiness]
  );

  const handlePlanChange = useCallback(
    (plan: SubscriptionPlanModel | null) => {
      console.log("Plan changed:", plan);
      setSelectedPlan(plan);
      setValue("planId", plan?.id ?? "", {
        shouldValidate: true,
        shouldDirty: true,
      });
      trigger("planId");
    },
    [selectedPlan]
  );

  const handleClose = () => {
    reset(); // Reset form when closing
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="w-full max-w-lg md:max-w-xl lg:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isCreate ? "Create Subscription" : "Edit Subscription"}
          </DialogTitle>
          <DialogDescription>
            {isCreate
              ? "Fill out the form to create a new Subscription."
              : "Update Subscription information below."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Business ID (only for create) */}
          {isCreate && (
            <div className="space-y-1">
              <Label htmlFor="businessId">
                Business ID <span className="text-red-500">*</span>
              </Label>
              <Controller
                name="businessId"
                control={control}
                render={({ field }) => (
                  <ComboboxSelectBusiness
                    dataSelect={selectedBusiness}
                    onChangeSelected={handleBusinessChange}
                    disabled={isSubmitting}
                  />
                )}
              />
              {errors.businessId && (
                <p className="text-sm text-destructive">
                  {errors.businessId.message}
                </p>
              )}
            </div>
          )}

          {/* Plan ID */}
          <div className="space-y-1">
            <Label htmlFor="planId">
              Plan ID <span className="text-red-500">*</span>
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
              <p className="text-sm text-destructive">
                {errors.planId.message}
              </p>
            )}
          </div>

          {/* End Date */}
          {!isCreate && (
            <div className="space-y-1">
              <Label htmlFor="endDate">End Date</Label>
              <Controller
                name="endDate"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    id="endDate"
                    type="date"
                    disabled={isSubmitting}
                    className={errors.endDate ? "border-red-500" : ""}
                  />
                )}
              />
              {errors.endDate && (
                <p className="text-sm text-destructive">
                  {errors.endDate.message}
                </p>
              )}
            </div>
          )}

          <div className="flex flex-wrap gap-4">
            {/* Auto Renew */}
            <div className="flex items-center gap-1">
              <Controller
                name="autoRenew"
                control={control}
                render={({ field }) => (
                  <Checkbox
                    id="autoRenew"
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    disabled={isSubmitting}
                  />
                )}
              />
              <Label htmlFor="autoRenew">Auto Renew</Label>
            </div>

            {/* Is Active */}
            <div className="flex items-center gap-1">
              <Controller
                name="isActive"
                control={control}
                render={({ field }) => (
                  <Checkbox
                    id="isActive"
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    disabled={isSubmitting}
                  />
                )}
              />
              <Label htmlFor="isActive">Is Active</Label>
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-1">
            <Label htmlFor="notes">Notes</Label>
            <Controller
              name="notes"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  id="notes"
                  placeholder="Notes"
                  disabled={isSubmitting}
                  className={errors.notes ? "border-red-500" : ""}
                />
              )}
            />
            {errors.notes && (
              <p className="text-sm text-destructive">{errors.notes.message}</p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Processing..." : isCreate ? "Create" : "Update"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
