import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Crown, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
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
import { SubscriptionPlanModel } from "@/models/dashboard/master-data/subscription-plan/subscription-plan-response";
import { getSubscriptionPlanByIdService } from "@/services/dashboard/master-data/subscrion-plan/subscription-plan.service";
import { ScrollArea } from "@/components/ui/scroll-area";
import Loading from "../common/loading";
import { Label } from "@/components/ui/label";

// Status options
const SUBSCRIPTION_PLAN_STATUS_OPTIONS = [
  { value: "PUBLIC", label: "Public" },
  { value: "PRIVATE", label: "Private" },
  { value: "INACTIVE", label: "Inactive" },
  { value: "DRAFT", label: "Draft" },
];

type ModalSubscriptionPlanProps = {
  subscriptionPlanId?: string;
  onClose: () => void;
  isOpen: boolean;
  isSubmitting?: boolean;
  onSave: (data: SubscriptionPlanFormData) => Promise<void>;
  error?: string | null;
};

export default function ModalSubscriptionPlan({
  isOpen,
  onClose,
  subscriptionPlanId,
  onSave,
  isSubmitting = false,
  error = null,
}: ModalSubscriptionPlanProps) {
  const [planData, setPlanData] = useState<SubscriptionPlanModel | null>(null);
  const [isLoadingData, setIsLoadingData] = useState(false);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<SubscriptionPlanFormData>({
    resolver: zodResolver(SubscriptionPlanSchema),
    defaultValues: {
      id: "",
      name: "",
      description: "",
      price: 0,
      durationDays: 30,
      status: "PUBLIC",
    },
    mode: "onChange",
  });

  // Fetch plan data when subscriptionPlanId is provided
  useEffect(() => {
    const fetchPlanData = async () => {
      if (!subscriptionPlanId || !isOpen) return;

      setIsLoadingData(true);

      try {
        const data = await getSubscriptionPlanByIdService(subscriptionPlanId);
        setPlanData(data);
      } catch (error: any) {
        console.error("Error fetching subscription plan data:", error);
      } finally {
        setIsLoadingData(false);
      }
    };

    fetchPlanData();
  }, [subscriptionPlanId, isOpen]);

  useEffect(() => {
    if (isOpen) {
      if (planData) {
        const formData = {
          id: planData.id || "",
          name: planData.name || "",
          description: planData.description || "",
          price: planData.price || 0,
          durationDays: planData.durationDays || 30,
          status: planData.status || "PUBLIC",
        };
        reset(formData);
      } else if (!subscriptionPlanId) {
        // New plan - reset to empty form
        reset({
          id: "",
          name: "",
          description: "",
          price: 0,
          durationDays: 30,
          status: "PUBLIC",
        });
      }
    }
  }, [isOpen, planData, subscriptionPlanId, reset]);

  const onSubmit = async (data: SubscriptionPlanFormData) => {
    try {
      const payload = {
        id: data.id || "",
        name: data.name?.trim() || "",
        description: data.description?.trim() || "",
        price: data.price || 0,
        durationDays: data.durationDays || 30,
        status: data.status || "PUBLIC",
      };

      await onSave(payload);
      handleClose();
    } catch (error) {
      console.error("Error saving subscription plan:", error);
    }
  };

  const handleClose = () => {
    reset();
    setPlanData(null);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl h-[90vh] p-0 gap-0 flex flex-col">
        {/* Header */}
        <DialogHeader className="px-6 py-4 border-b bg-muted/30 flex-shrink-0">
          <div className="flex items-center gap-4 pr-8">
            <div className="p-2 bg-purple-100 rounded-full">
              <Crown className="h-5 w-5 text-purple-600" />
            </div>
            <div className="flex-1">
              <DialogTitle className="text-xl font-semibold">
                {subscriptionPlanId
                  ? "Edit Subscription Plan"
                  : "Add New Subscription Plan"}
              </DialogTitle>
              <DialogDescription className="text-base text-muted-foreground">
                {subscriptionPlanId
                  ? `Update "${planData?.name || "plan"}" information below.`
                  : "Enter the subscription plan information below."}
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
            ) : (
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
                  <div className="flex items-center gap-2">
                    <div className="w-1 h-6 bg-purple-600 rounded-full"></div>
                    <h3 className="text-lg font-semibold text-foreground">
                      Basic Information
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 gap-4">
                    {/* Plan Name */}
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-sm font-medium">
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
                            placeholder="Enter plan name"
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

                    {/* Description */}
                    <div className="space-y-2">
                      <Label
                        htmlFor="description"
                        className="text-sm font-medium"
                      >
                        Description
                      </Label>
                      <Controller
                        control={control}
                        name="description"
                        render={({ field }) => (
                          <Textarea
                            {...field}
                            id="description"
                            placeholder="Enter plan description"
                            disabled={isSubmitting}
                            className={`min-h-[100px] transition-colors ${
                              errors.description
                                ? "border-red-500 focus:border-red-500"
                                : "focus:border-purple-500"
                            }`}
                            rows={4}
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

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Price */}
                    <div className="space-y-2">
                      <Label htmlFor="price" className="text-sm font-medium">
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
                      <Label
                        htmlFor="durationDays"
                        className="text-sm font-medium"
                      >
                        Duration (Days) <span className="text-red-500">*</span>
                      </Label>
                      <Controller
                        control={control}
                        name="durationDays"
                        render={({ field }) => (
                          <Input
                            {...field}
                            id="durationDays"
                            type="number"
                            min={subscriptionPlanId ? "0" : "1"}
                            placeholder="30"
                            onChange={(e) =>
                              field.onChange(
                                parseInt(e.target.value) ||
                                  (subscriptionPlanId ? 0 : 1)
                              )
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
                    <Label
                      htmlFor="status-select"
                      className="text-sm font-medium"
                    >
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
                            className={`transition-colors ${
                              errors.status
                                ? "border-red-500 focus:border-red-500"
                                : "focus:border-purple-500"
                            }`}
                          >
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                          <SelectContent>
                            {SUBSCRIPTION_PLAN_STATUS_OPTIONS.map((status) => (
                              <SelectItem
                                key={status.value}
                                value={status.value}
                              >
                                <div className="flex items-center gap-2">
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
              </form>
            )}
          </div>
        </ScrollArea>

        {/* Footer */}
        <div className="flex justify-between items-center p-6 border-t bg-muted/30 flex-shrink-0">
          <div className="text-sm text-muted-foreground">
            {isLoadingData
              ? "Loading data..."
              : isDirty
              ? "You have unsaved changes"
              : "No changes made"}
          </div>
          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isSubmitting || isLoadingData}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit(onSubmit)}
              disabled={isSubmitting || !isDirty || isLoadingData}
              className="min-w-[120px]"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {subscriptionPlanId ? "Updating..." : "Creating..."}
                </>
              ) : subscriptionPlanId ? (
                "Update Plan"
              ) : (
                "Create Plan"
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
