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
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2, Crown, CreditCard, X } from "lucide-react";
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
  SubscriptionPlanFormData,
  SubscriptionPlanSchema,
} from "@/models/dashboard/master-data/subscription-plan/subscription-plan.schema";

type Props = {
  mode: ModalMode;
  Data?: SubscriptionPlanFormData | null;
  onClose: () => void;
  isOpen: boolean;
  isSubmitting?: boolean;
  onSave: (data: SubscriptionPlanFormData) => Promise<void>;
  error?: string | null;
};

// Default form values
const DEFAULT_FORM_VALUES: SubscriptionPlanFormData = {
  id: "",
  name: "",
  price: 0,
  description: "",
  durationDays: 30,
  status: "active",
};

export default function ModalSubscriptionPlan({
  isOpen,
  onClose,
  Data,
  mode,
  onSave,
  isSubmitting = false,
  error = null,
}: Props) {
  const isCreate = mode === ModalMode.CREATE_MODE;
  const isEdit = mode === ModalMode.UPDATE_MODE;

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isDirty, isValid },
    watch,
  } = useForm<SubscriptionPlanFormData>({
    resolver: zodResolver(SubscriptionPlanSchema),
    defaultValues: DEFAULT_FORM_VALUES,
    mode: "onChange",
  });

  // Watch form values for debugging
  const watchedValues = watch();

  // Reset form when modal opens or data changes
  useEffect(() => {
    if (isOpen) {
      if (isCreate) {
        // For create mode, use default values
        reset(DEFAULT_FORM_VALUES);
      } else if (isEdit && Data) {
        // For edit mode, populate with existing data
        const formData: SubscriptionPlanFormData = {
          id: Data.id || "",
          name: Data.name || "",
          status: Data.status || "active",
          price: Data.price || 0,
          durationDays: Data.durationDays || 30,
          description: Data.description || "",
        };
        reset(formData);
      }
    }
  }, [isOpen, Data, mode, reset, isCreate, isEdit]);

  const onSubmit = async (data: SubscriptionPlanFormData) => {
    try {
      console.log("Form submitted with mode:", mode, "Data:", data);

      const payload: SubscriptionPlanFormData = {
        // Only include ID for edit mode
        ...(isEdit && Data?.id && { id: Data.id }),
        name: data.name?.trim() || "",
        status: data.status || "active",
        price: data.price || 0,
        durationDays: data.durationDays || 30,
        description: data.description?.trim() || "",
      };

      console.log("Payload:", payload);
      await onSave(payload);

      // Only close modal if save was successful
      handleClose();
    } catch (error) {
      console.error("Error saving subscription plan:", error);
      // Don't close modal on error - let parent component handle error display
    }
  };

  const handleClose = () => {
    reset(DEFAULT_FORM_VALUES);
    onClose();
  };

  // Form validation helper
  const isSubmitDisabled = isSubmitting || !isValid || (isEdit && !isDirty);

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl h-[90vh] p-0 gap-0 flex flex-col">
        {/* Header */}
        <DialogHeader className="px-6 py-4 border-b bg-muted/30 flex-shrink-0">
          <div className="flex items-center gap-3 pr-8">
            <div className="p-2 bg-purple-100 rounded-full">
              {isCreate ? (
                <Crown className="h-5 w-5 text-purple-600" />
              ) : (
                <CreditCard className="h-5 w-5 text-purple-600" />
              )}
            </div>
            <div>
              <DialogTitle className="text-xl">
                {isCreate
                  ? "Create Subscription Plan"
                  : "Edit Subscription Plan"}
              </DialogTitle>
              <DialogDescription className="text-base">
                {isCreate
                  ? "Fill out the form to create a new subscription plan."
                  : `Update "${Data?.name || "plan"}" information below.`}
              </DialogDescription>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="absolute right-4 top-4"
            onClick={handleClose}
            disabled={isSubmitting}
          >
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>

        {/* Content */}
        <ScrollArea className="flex-1 min-h-0">
          <div className="p-6">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Error Display */}
              {error && (
                <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-md">
                  <p className="text-sm text-destructive font-medium">
                    {error}
                  </p>
                </div>
              )}

              {/* Basic Information Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-foreground">
                  Plan Information
                </h3>

                {/* Plan Name */}
                <div className="space-y-2">
                  <Label htmlFor="name">
                    Plan Name <span className="text-red-500">*</span>
                  </Label>
                  <Controller
                    control={control}
                    name="name"
                    render={({ field }) => (
                      <Input
                        {...field}
                        id="name"
                        type="text"
                        placeholder="Enter plan name (e.g., Premium Plan)"
                        disabled={isSubmitting}
                        className={`transition-colors ${
                          errors.name
                            ? "border-red-500 focus:border-red-500"
                            : "focus:border-purple-500"
                        }`}
                      />
                    )}
                  />
                  {errors.name && (
                    <p className="text-sm text-red-600">
                      {errors.name.message}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Price */}
                  <div className="space-y-2">
                    <Label htmlFor="price">
                      Price (USD) <span className="text-red-500">*</span>
                    </Label>
                    <Controller
                      control={control}
                      name="price"
                      render={({ field }) => (
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
                            $
                          </span>
                          <Input
                            {...field}
                            id="price"
                            type="number"
                            step="0.01"
                            min="0"
                            placeholder="0.00"
                            onChange={(e) =>
                              field.onChange(parseFloat(e.target.value) || 0)
                            }
                            disabled={isSubmitting}
                            className={`pl-8 transition-colors ${
                              errors.price
                                ? "border-red-500 focus:border-red-500"
                                : "focus:border-purple-500"
                            }`}
                          />
                        </div>
                      )}
                    />
                    {errors.price && (
                      <p className="text-sm text-red-600">
                        {errors.price.message}
                      </p>
                    )}
                  </div>

                  {/* Duration Days */}
                  <div className="space-y-2">
                    <Label htmlFor="duration">
                      Duration (Days) <span className="text-red-500">*</span>
                    </Label>
                    <Controller
                      control={control}
                      name="durationDays"
                      render={({ field }) => (
                        <Input
                          {...field}
                          id="duration"
                          type="number"
                          min="1"
                          placeholder="30"
                          onChange={(e) =>
                            field.onChange(parseInt(e.target.value) || 30)
                          }
                          disabled={isSubmitting}
                          className={`transition-colors ${
                            errors.durationDays
                              ? "border-red-500 focus:border-red-500"
                              : "focus:border-purple-500"
                          }`}
                        />
                      )}
                    />
                    {errors.durationDays && (
                      <p className="text-sm text-red-600">
                        {errors.durationDays.message}
                      </p>
                    )}
                  </div>
                </div>

                {/* Status */}
                <div className="space-y-2">
                  <Label htmlFor="status-select">
                    Status <span className="text-red-500">*</span>
                  </Label>
                  <Controller
                    control={control}
                    name="status"
                    render={({ field }) => (
                      <Select
                        value={field.value || "active"}
                        onValueChange={field.onChange}
                        disabled={isSubmitting}
                      >
                        <SelectTrigger
                          id="status-select"
                          className={`transition-colors ${
                            errors.status
                              ? "border-red-500 focus:border-red-500"
                              : "focus:border-purple-500"
                          }`}
                        >
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          {SUBSCRIPTION_PLAN_OPTIONS.map((status) => (
                            <SelectItem
                              key={status.value || "unknown"}
                              value={String(status.value || "active")}
                            >
                              <div className="flex items-center gap-2">
                                <div
                                  className={`w-2 h-2 rounded-full ${
                                    status.value === "active"
                                      ? "bg-green-500"
                                      : status.value === "pending"
                                      ? "bg-yellow-500"
                                      : status.value === "inactive"
                                      ? "bg-red-500"
                                      : "bg-gray-500"
                                  }`}
                                />
                                {status.label}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.status && (
                    <p className="text-sm text-red-600">
                      {errors.status.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Description Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-foreground">
                  Plan Description
                </h3>

                {/* Description */}
                <div className="space-y-2">
                  <Label htmlFor="description">Plan Description</Label>
                  <Controller
                    control={control}
                    name="description"
                    render={({ field }) => (
                      <Textarea
                        {...field}
                        id="description"
                        placeholder="Describe what this subscription plan offers, features included, target audience, etc..."
                        disabled={isSubmitting}
                        className={`min-h-[120px] transition-colors ${
                          errors.description
                            ? "border-red-500 focus:border-red-500"
                            : "focus:border-purple-500"
                        }`}
                        rows={5}
                      />
                    )}
                  />
                  {errors.description && (
                    <p className="text-sm text-red-600">
                      {errors.description.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Plan Preview */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-foreground">
                  Plan Preview
                </h3>
                <div className="p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg border">
                  <div className="flex items-center gap-3 mb-2">
                    <Crown className="h-5 w-5 text-purple-600" />
                    <span className="font-semibold text-lg">
                      {watchedValues.name || "Plan Name"}
                    </span>
                  </div>
                  <div className="flex items-baseline gap-2 mb-2">
                    <span className="text-2xl font-bold text-purple-600">
                      ${watchedValues.price || 0}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      for {watchedValues.durationDays || 30} days
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {watchedValues.description || "No description provided"}
                  </p>
                </div>
              </div>

              {/* Debug Info (remove in production) */}
              {process.env.NODE_ENV === "development" && (
                <details className="text-xs text-muted-foreground">
                  <summary>Debug Info</summary>
                  <pre className="mt-2 p-2 bg-muted rounded text-xs">
                    Mode: {mode}
                    {"\n"}isCreate: {isCreate.toString()}
                    {"\n"}isEdit: {isEdit.toString()}
                    {"\n"}isDirty: {isDirty.toString()}
                    {"\n"}isValid: {isValid.toString()}
                    {"\n"}Data: {JSON.stringify(Data, null, 2)}
                    {"\n"}Form Values: {JSON.stringify(watchedValues, null, 2)}
                  </pre>
                </details>
              )}
            </form>
          </div>
        </ScrollArea>

        {/* Footer */}
        <div className="flex justify-between items-center p-6 border-t bg-muted/30 flex-shrink-0">
          <div className="text-sm text-muted-foreground">
            {isDirty
              ? "You have unsaved changes"
              : isCreate
              ? "Ready to create plan"
              : "No changes made"}
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
              disabled={isSubmitDisabled}
              className="min-w-[140px]"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {isCreate ? "Creating..." : "Updating..."}
                </>
              ) : (
                <>
                  {isCreate ? (
                    <>
                      <Crown className="mr-2 h-4 w-4" />
                      Create Plan
                    </>
                  ) : (
                    <>
                      <CreditCard className="mr-2 h-4 w-4" />
                      Update Plan
                    </>
                  )}
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
