import React, { useEffect } from "react";
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
import {
  ModalMode,
  SUBSCRIPTION_PLAN_OPTIONS,
} from "@/constants/AppResource/status/status";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  createSubscriptionPlanSchema,
  SubscriptionPlanFormData,
  updateSubscriptionPlanSchema,
} from "@/models/dashboard/master-data/subscription-plan/subscription-plan.schema";

type Props = {
  mode: ModalMode;
  Data?: SubscriptionPlanFormData | null;
  onClose: () => void;
  isOpen: boolean;
  isSubmitting?: boolean;
  onSave: (data: SubscriptionPlanFormData) => void;
};

export default function ModalSubscriptionPlan({
  isOpen,
  onClose,
  Data,
  mode,
  onSave,
  isSubmitting = false,
}: Props) {
  const isCreate = mode === ModalMode.CREATE_MODE;
  const schema = isCreate
    ? createSubscriptionPlanSchema
    : updateSubscriptionPlanSchema;

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SubscriptionPlanFormData>({
    resolver: zodResolver(schema), // Always use the form schema
    defaultValues: {
      id: "",
      name: "",
      price: 0,
      description: "",
      durationDays: 0,
      status: "",
    },
    mode: "onChange",
  });

  // Reset form when modal opens or data changes
  useEffect(() => {
    if (isOpen) {
      const formData = {
        id: Data?.id ?? "",
        name: Data?.name ?? "",
        status: Data?.status ?? "",
        price: Data?.price ?? 0,
        durationDays: Data?.durationDays ?? 0,
        description: Data?.description ?? "",
      };

      reset(formData);
    }
  }, [isOpen, Data, reset]);

  const onSubmit = (data: SubscriptionPlanFormData) => {
    console.log("Form submitted with mode:", mode, "Data:", data); // Debug log

    const payload = {
      id: Data?.id?.trim(),
      name: data?.name.trim(),
      status: data?.status.trim(),
      price: data?.price ?? 0,
      durationDays: data?.durationDays ?? 0,
      description: data?.description?.trim(),
    };
    console.log(" Payload:", payload);
    onSave(payload);
    onClose();
  };

  const handleClose = () => {
    reset(); // Reset form when closing
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="w-full max-w-lg md:max-w-xl lg:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isCreate ? "Create Subscription Plan" : "Edit Subscription Plan"}
          </DialogTitle>
          <DialogDescription>
            {isCreate
              ? "Fill out the form to create a new Subscription Plan."
              : "Update Subscription Plan information below."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-2 pt-4">
          {/* name Field */}
          <div className="space-y-1">
            <Label htmlFor="name">
              Name <span className="text-red-500">*</span>
            </Label>
            <Controller
              control={control}
              name="name"
              render={({ field }) => (
                <Input
                  {...field}
                  id="name"
                  type="text"
                  placeholder="Restaurant name"
                  disabled={isSubmitting}
                  autoComplete="username"
                  className={errors.name ? "border-red-500" : ""}
                />
              )}
            />
            {errors.name && (
              <p className="text-sm text-destructive">{errors.name.message}</p>
            )}
          </div>

          {/* Duration Days Field */}
          <div className="space-y-1">
            <Label htmlFor="duration">
              Duration Days <span className="text-red-500">*</span>
            </Label>
            <Controller
              control={control}
              name="durationDays"
              render={({ field }) => (
                <Input
                  {...field}
                  id="duration"
                  type="text"
                  inputMode="numeric"
                  placeholder="Enter number of days"
                  onChange={(e) => field.onChange(e.target.value)}
                  disabled={isSubmitting}
                  autoComplete="off"
                  className={errors.durationDays ? "border-red-500" : ""}
                />
              )}
            />
            {errors.durationDays && (
              <p className="text-sm text-destructive">
                {errors.durationDays.message}
              </p>
            )}
          </div>

          {/* Price Field */}
          <div className="space-y-1">
            <Label htmlFor="price">
              Price <span className="text-red-500">*</span>
            </Label>
            <Controller
              control={control}
              name="price"
              render={({ field }) => (
                <Input
                  {...field}
                  id="price"
                  type="text"
                  inputMode="decimal"
                  placeholder="Enter price"
                  onChange={(e) => field.onChange(e.target.value)}
                  disabled={isSubmitting}
                  autoComplete="off"
                  className={errors.price ? "border-red-500" : ""}
                />
              )}
            />
            {errors.price && (
              <p className="text-sm text-destructive">{errors.price.message}</p>
            )}
          </div>

          {/* Status Field */}
          <div className="space-y-1">
            <Label htmlFor="status-select">
              Status <span className="text-red-500">*</span>
            </Label>
            <Controller
              control={control}
              name="status"
              render={({ field }) => (
                <Select
                  value={field.value}
                  onValueChange={field.onChange}
                  disabled={isSubmitting}
                >
                  <SelectTrigger
                    id="status-select"
                    className={`bg-white dark:bg-inherit ${
                      errors.status ? "border-red-500" : ""
                    }`}
                  >
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    {SUBSCRIPTION_PLAN_OPTIONS.map((status) => (
                      <SelectItem key={status.value} value={status.value}>
                        {status.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.status && (
              <p className="text-sm text-destructive">
                {errors.status.message}
              </p>
            )}
          </div>

          {/* Notes Field - Optional */}
          <div className="space-y-1">
            <Label htmlFor="description">Description</Label>
            <Controller
              control={control}
              name="description"
              render={({ field }) => (
                <Input
                  {...field}
                  id="description"
                  type="text"
                  placeholder="Description"
                  disabled={isSubmitting}
                  className={errors.description ? "border-red-500" : ""}
                />
              )}
            />
            {errors.description && (
              <p className="text-sm text-destructive">
                {errors.description.message}
              </p>
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
