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
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle, Upload, X, Loader2 } from "lucide-react";
import { ModalMode } from "@/constants/AppResource/status/status";
import { UploadImageRequest } from "@/models/dashboard/image/image.request.model";
import { uploadImageService } from "@/services/dashboard/image/image.service";
import {
  CreatePaymentFormData,
  CreatePaymentSchema,
  UpdatePaymentFormData,
  UpdatePaymentSchema,
} from "@/models/dashboard/payment/payment/payment.schema";
import { PaymentModel } from "@/models/dashboard/payment/payment/payment.response.model";
import { ComboboxSelectBusiness } from "../combo-box/combobox-business";
import { BusinessModel } from "@/models/dashboard/master-data/business/business-response-model";

const PAYMENT_METHOD_OPTIONS = [
  { label: "Cash", value: "CASH" },
  { label: "Bank Transfer", value: "BANK_TRANSFER" },
  { label: "Credit Card", value: "CREDIT_CARD" },
  { label: "Digital Wallet", value: "DIGITAL_WALLET" },
];

const PAYMENT_STATUS_OPTIONS = [
  { label: "Pending", value: "PENDING" },
  { label: "Completed", value: "COMPLETED" },
  { label: "Failed", value: "FAILED" },
  { label: "Cancelled", value: "CANCELLED" },
];

const PAYMENT_TYPE_OPTIONS = [
  { label: "Subscription", value: "SUBSCRIPTION" },
  { label: "One-time", value: "ONE_TIME" },
  { label: "Refund", value: "REFUND" },
];

type Props = {
  mode: ModalMode;
  Data?: PaymentModel | null;
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

  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [selectedBusiness, setSelectedBusiness] =
    useState<BusinessModel | null>(null);
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
    resolver: zodResolver(schema),
    defaultValues: isCreate
      ? {
          businessId: "",
          amount: 0,
          paymentMethod: "",
          status: "PENDING",
          referenceNumber: "",
          notes: "",
          imageUrl: "",
          paymentType: "SUBSCRIPTION",
        }
      : {
          amount: 0,
          paymentMethod: "",
          status: "PENDING",
          referenceNumber: "",
          notes: "",
          imageUrl: "",
        },
    mode: "onChange",
  });

  const imageUrl = watch("imageUrl");

  // Reset form when modal opens or data changes
  useEffect(() => {
    if (isOpen) {
      if (isCreate) {
        const formData: CreatePaymentFormData = {
          businessId: "",
          amount: 0,
          paymentMethod: "",
          status: "PENDING",
          referenceNumber: "",
          notes: "",
          imageUrl: "",
          paymentType: "SUBSCRIPTION",
        };
        reset(formData);
        setLogoPreview(null);
        setSelectedBusiness(null);
      } else {
        const formData: UpdatePaymentFormData = {
          amount: Data?.amount || 0,
          paymentMethod: Data?.paymentMethod || "",
          status: Data?.status || "PENDING",
          referenceNumber: Data?.referenceNumber || "",
          notes: Data?.notes || "",
          imageUrl: Data?.imageUrl || "",
        };
        reset(formData);
        setLogoPreview(
          Data?.imageUrl
            ? `${process.env.NEXT_PUBLIC_API_BASE_URL}${Data.imageUrl}`
            : null
        );
      }
    }
  }, [isOpen, Data, reset, isCreate]);

  // Update logo preview when imageUrl changes
  useEffect(() => {
    if (imageUrl && imageUrl !== logoPreview) {
      setLogoPreview(imageUrl);
    }
  }, [imageUrl]);

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
          const fullImageUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}${response.imageUrl}`;
          setValue("imageUrl", fullImageUrl, { shouldValidate: true });
          setLogoPreview(fullImageUrl);
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

  const handleBusinessChange = useCallback(
    (business: BusinessModel | null) => {
      setSelectedBusiness(business);
      setValue("businessId", business?.id || "", {
        shouldValidate: true,
        shouldDirty: true,
      });
      trigger("businessId");
    },
    [setValue, trigger]
  );

  const onSubmit = (
    formData: CreatePaymentFormData | UpdatePaymentFormData
  ) => {
    onSave(formData);
  };

  const handleClose = () => {
    reset();
    setLogoPreview(null);
    setSelectedBusiness(null);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="w-full max-w-lg md:max-w-xl lg:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isCreate ? "Create Payment" : "Edit Payment"}
          </DialogTitle>
          <DialogDescription>
            {isCreate
              ? "Fill out the form to create a new payment record."
              : "Update payment information below."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-4">
          {/* Business Selection - Create only */}
          {isCreate && (
            <div className="space-y-2">
              <Label htmlFor="businessId">
                Business <span className="text-red-500">*</span>
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
              {isCreate && "businessId" in errors && errors.businessId && (
                <p className="text-sm text-red-500 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  {errors.businessId.message}
                </p>
              )}
            </div>
          )}

          {/* Amount */}
          <div className="space-y-2">
            <Label htmlFor="amount">
              Amount (USD) <span className="text-red-500">*</span>
            </Label>
            <Controller
              control={control}
              name="amount"
              render={({ field }) => (
                <Input
                  {...field}
                  id="amount"
                  type="number"
                  step="0.01"
                  min="0"
                  onChange={(e) => field.onChange(Number(e.target.value))}
                  placeholder="0.00"
                  disabled={isSubmitting}
                  className={errors.amount ? "border-red-500" : ""}
                />
              )}
            />
            {errors.amount && (
              <p className="text-sm text-red-500 flex items-center gap-1">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                {errors.amount.message}
              </p>
            )}
          </div>

          {/* Payment Method */}
          <div className="space-y-2">
            <Label htmlFor="paymentMethod">
              Payment Method <span className="text-red-500">*</span>
            </Label>
            <Controller
              name="paymentMethod"
              control={control}
              render={({ field }) => (
                <Select
                  value={field.value}
                  onValueChange={field.onChange}
                  disabled={isSubmitting}
                >
                  <SelectTrigger
                    className={errors.paymentMethod ? "border-red-500" : ""}
                  >
                    <SelectValue placeholder="Choose payment method" />
                  </SelectTrigger>
                  <SelectContent>
                    {PAYMENT_METHOD_OPTIONS.map((method) => (
                      <SelectItem key={method.value} value={method.value}>
                        {method.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.paymentMethod && (
              <p className="text-sm text-red-500 flex items-center gap-1">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                {errors.paymentMethod.message}
              </p>
            )}
          </div>

          {/* Payment Type - Create only */}
          {isCreate && (
            <div className="space-y-2">
              <Label htmlFor="paymentType">
                Payment Type <span className="text-red-500">*</span>
              </Label>
              <Controller
                name="paymentType"
                control={control}
                render={({ field }) => (
                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
                    disabled={isSubmitting}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select payment type" />
                    </SelectTrigger>
                    <SelectContent>
                      {PAYMENT_TYPE_OPTIONS.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
          )}

          {/* Status - Update only */}
          {!isCreate && (
            <div className="space-y-2">
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
                      className={errors.status ? "border-red-500" : ""}
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
              {errors.status && (
                <p className="text-sm text-red-500 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  {errors.status.message}
                </p>
              )}
            </div>
          )}

          {/* Reference Number */}
          <div className="space-y-2">
            <Label htmlFor="referenceNumber">
              Reference Number <span className="text-red-500">*</span>
            </Label>
            <Controller
              control={control}
              name="referenceNumber"
              render={({ field }) => (
                <Input
                  {...field}
                  id="referenceNumber"
                  type="text"
                  placeholder="Enter reference number"
                  disabled={isSubmitting}
                  className={errors.referenceNumber ? "border-red-500" : ""}
                />
              )}
            />
            {errors.referenceNumber && (
              <p className="text-sm text-red-500 flex items-center gap-1">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                {errors.referenceNumber.message}
              </p>
            )}
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Controller
              control={control}
              name="notes"
              render={({ field }) => (
                <Textarea
                  {...field}
                  id="notes"
                  placeholder="Additional notes about the payment..."
                  rows={3}
                  disabled={isSubmitting}
                />
              )}
            />
          </div>

          {/* Payment Receipt Upload */}
          <div className="space-y-2">
            <Label>Payment Receipt</Label>
            <Card>
              <CardContent className="p-4">
                <div className="flex flex-col items-center gap-4">
                  {logoPreview ? (
                    <div className="relative">
                      <img
                        src={logoPreview}
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
                        {logoPreview ? "Change Receipt" : "Upload Receipt"}
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
              </CardContent>
            </Card>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-6">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isSubmitting || isUploading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting || isUploading}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : isCreate ? (
                "Create Payment"
              ) : (
                "Save Changes"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
