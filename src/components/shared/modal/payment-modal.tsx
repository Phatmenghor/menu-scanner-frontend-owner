import React, { useCallback, useEffect, useRef, useState } from "react";
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
  PAYMENT_STATUS_OPTIONS,
} from "@/constants/AppResource/status/status";
import { UploadImageRequest } from "@/models/dashboard/image/image.request.model";
import { uploadImageService } from "@/services/dashboard/image/image.service";
import { Card, CardContent } from "@/components/ui/card";
import {
  CreatePaymentFormData,
  CreatePaymentSchema,
  UpdatePaymentFormData,
  UpdatePaymentSchema,
} from "@/models/dashboard/payment/payment/payment.schema";
import { Textarea } from "@/components/ui/textarea";
import { ComboboxSelectPlan } from "../combo-box/combobox-plan";
import {
  CreatePaymentRequest,
  UpdatePaymentRequest,
} from "@/models/dashboard/payment/payment/payment.request.model";
import { SubscriptionPlanModel } from "@/models/dashboard/master-data/subscription-plan/subscription-plan-response";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { paymentMethodOptions } from "@/constants/AppResource/status/payment";
import { AlertCircle } from "lucide-react";

type Props = {
  mode: ModalMode;
  Data?: UpdatePaymentFormData | null;
  onClose: () => void;
  isOpen: boolean;
  isSubmitting?: boolean;
  onSave: (data: CreatePaymentFormData | UpdatePaymentFormData) => void;
};

export default function ModalPayment({
  isOpen,
  onClose,
  Data,
  mode,
  onSave,
  isSubmitting = false,
}: Props) {
  const isCreate = mode === ModalMode.CREATE_MODE;
  const schema = isCreate ? CreatePaymentSchema : UpdatePaymentSchema;
  const [showPassword, setShowPassword] = useState(false);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [selectedPlan, setSelectedPlan] =
    useState<SubscriptionPlanModel | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    trigger,
    watch,
    formState: { errors },
  } = useForm<CreatePaymentFormData | UpdatePaymentFormData>({
    resolver: zodResolver(schema), // Use dynamic schema instead of hardcoded UserFormSchema
    defaultValues: {
      amount: 0,
      id: "",
      imageUrl: "",
      notes: "",
      paymentMethod: "",
      referenceNumber: "",
      status: "",
      subscriptionId: "",
    },
    mode: "onChange",
  });

  const profileUrl = watch("imageUrl");

  useEffect(() => {
    if (profileUrl) {
      setLogoPreview(profileUrl);
    }
  }, [profileUrl]);

  // Reset form when modal opens or data changes
  useEffect(() => {
    if (isOpen) {
      const formData = {
        amount: Data?.amount || 0,
        id: Data?.id || "",
        imageUrl: Data?.imageUrl || "",
        notes: Data?.notes || "",
        paymentMethod: Data?.paymentMethod || "",
        referenceNumber: Data?.referenceNumber || "",
        status: Data?.status || "",
        subscriptionId: "",
      };

      reset(formData);
      setLogoPreview(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}${Data?.imageUrl}` || null
      );
    }
  }, [isOpen, Data, reset]);

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
          setValue(
            "imageUrl",
            process.env.NEXT_PUBLIC_API_BASE_URL + response?.imageUrl,
            {
              shouldValidate: true,
            }
          );
          console.log(
            "Image Preview URL:",
            process.env.NEXT_PUBLIC_API_BASE_URL + response.imageUrl
          );

          setLogoPreview(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}${response?.imageUrl}`
          );
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
    setValue("imageUrl", "", { shouldDirty: true });
  };

  const getImageSource = () => {
    return logoPreview?.startsWith("http") ? logoPreview : logoPreview;
  };

  const onSubmit = (
    formData: CreatePaymentFormData | UpdatePaymentFormData
  ) => {
    console.log("Form submitted with mode:", mode, "Data:", formData); // Debug log

    if (isCreate) {
      const data = formData as CreatePaymentFormData;
      const payload = {
        amount: data.amount,
        paymentMethod: data.paymentMethod,
        subscriptionId: data.subscriptionId,
        imageUrl: data.imageUrl,
        notes: data.notes,
        referenceNumber: data.referenceNumber,
        status: data.status,
      };
      console.log("Create Payload:", payload); // Debug log
      onSave(payload);
    } else {
      const data = formData as UpdatePaymentRequest;
      const payload = {
        id: Data?.id,
        amount: data.amount,
        paymentMethod: data.paymentMethod,
        imageUrl: data.imageUrl,
        notes: data.notes,
        referenceNumber: data.referenceNumber,
        status: data.status,
      };
      console.log("Update Payload:", payload);
      onSave(payload);
    }
    onClose();
  };

  const handlePlanChange = useCallback(
    (plan: SubscriptionPlanModel | null) => {
      console.log("Plan changed:", plan);
      setSelectedPlan(plan);
      setValue("subscriptionId", plan?.id ?? "", {
        shouldValidate: true,
        shouldDirty: true,
      });
      trigger("subscriptionId");
    },
    [selectedPlan]
  );

  const handleClose = () => {
    reset(); // Reset form when closing
    setLogoPreview(null);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="w-full max-w-lg md:max-w-xl lg:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isCreate ? "Create User" : "Edit User"}</DialogTitle>
          <DialogDescription>
            {isCreate
              ? "Fill out the form to create a new user."
              : "Update user information below."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-2">
          {/* userIdentifier Field */}
          {isCreate && (
            <div className="space-y-1">
              <Label htmlFor="amount">
                Amount <span className="text-red-500">*</span>
              </Label>
              <Controller
                control={control}
                name="amount"
                render={({ field }) => (
                  <Input
                    {...field}
                    id="amount"
                    type="text"
                    placeholder="12.00$"
                    disabled={isSubmitting}
                    autoComplete="userIdentifier"
                    className={errors.amount ? "border-red-500" : ""}
                  />
                )}
              />
              {errors.amount && (
                <p className="text-sm text-destructive">
                  {errors.amount.message}
                </p>
              )}
            </div>
          )}

          {/* Plan ID */}
          {isCreate && (
            <div className="space-y-1">
              <Label htmlFor="planId">
                Plan <span className="text-red-500">*</span>
              </Label>
              <Controller
                name="subscriptionId"
                control={control}
                render={({ field }) => (
                  <ComboboxSelectPlan
                    dataSelect={selectedPlan}
                    onChangeSelected={handlePlanChange}
                    disabled={isSubmitting}
                  />
                )}
              />
            </div>
          )}

          <div className="space-y-2">
            <Controller
              name="paymentMethod"
              control={control}
              defaultValue=""
              render={({ field: { value, onChange } }) => (
                <div className="space-y-2">
                  <Label
                    htmlFor="paymentMethod"
                    className="text-sm font-medium"
                  >
                    Payment Method <span className="text-red-500">*</span>
                  </Label>

                  <Select value={value} onValueChange={onChange}>
                    <SelectTrigger
                      className={`w-full ${
                        errors.paymentMethod ? "border-red-500" : ""
                      }`}
                    >
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

                  {errors.paymentMethod && (
                    <p className="text-sm text-red-500 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4 flex-shrink-0" />
                      {errors.paymentMethod.message || "This field is required"}
                    </p>
                  )}
                </div>
              )}
            />
          </div>

          {/* First Name Field */}
          <div className="space-y-1">
            <Label htmlFor="refNumber">
              Reference Number <span className="text-red-500">*</span>
            </Label>
            <Controller
              control={control}
              name="referenceNumber"
              render={({ field }) => (
                <Input
                  {...field}
                  id="refNumber"
                  type="text"
                  placeholder="John"
                  disabled={isSubmitting}
                  autoComplete="refNumber"
                  className={errors.referenceNumber ? "border-red-500" : ""}
                />
              )}
            />
            {errors.referenceNumber && (
              <p className="text-sm text-destructive">
                {errors.referenceNumber.message}
              </p>
            )}
          </div>

          {/* Status */}
          {!isCreate && (
            <div className="space-y-1">
              <Label htmlFor="status">
                Status <span className="text-red-500">*</span>
              </Label>
              <Controller
                name="status"
                control={control}
                render={({ field }) => (
                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
                    disabled={isSubmitting}
                  >
                    <SelectTrigger
                      id="status"
                      className={`bg-white dark:bg-inherit ${
                        errors.status ? "border-red-500" : ""
                      }`}
                    >
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      {PAYMENT_STATUS_OPTIONS.map((status) => (
                        <SelectItem key={status.value} value={status.value}>
                          {status.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
          )}

          <div className="space-y-1">
            <Label htmlFor="paymentNotes" className="text-sm font-medium">
              Notes
            </Label>
            <Controller
              control={control}
              name="notes"
              render={({ field }) => (
                <Textarea
                  {...field}
                  id="paymentNotes"
                  placeholder="Note about the payment..."
                  rows={3}
                  className="w-full resize-none"
                />
              )}
            />
          </div>

          <Card className="mt-16">
            <CardContent className="p-4">
              {/* Profile URL Field */}
              <div className="flex flex-col items-center gap-2">
                {/* Profile Image Preview or Placeholder */}
                {logoPreview ? (
                  <div className="relative w-24 h-24">
                    <img
                      src={getImageSource() ?? undefined}
                      alt="Profile Preview"
                      className="w-full h-full rounded-full object-cover border border-gray-300"
                    />
                    {/* Remove Button (X) */}
                    <button
                      type="button"
                      onClick={handleRemoveLogo}
                      className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center hover:bg-red-600"
                      title="Remove profile image"
                    >
                      ×
                    </button>
                  </div>
                ) : (
                  <div
                    className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center border border-dashed border-gray-400 hover:border-blue-500 cursor-pointer"
                    onClick={() => fileInputRef.current?.click()}
                    title="Upload profile image"
                  >
                    <span className="text-gray-500 text-2xl">+</span>
                  </div>
                )}

                {/* Hidden File Input */}
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileChange}
                  title="Upload profile image"
                  placeholder="Choose profile image"
                />
              </div>
            </CardContent>
          </Card>

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
