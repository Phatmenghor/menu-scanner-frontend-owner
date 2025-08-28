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
import { ScrollArea } from "@/components/ui/scroll-area";
import { AlertCircle, Upload, X, Loader2, CreditCard } from "lucide-react";
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
import Loading from "@/components/shared/common/loading";
import { getPaymentByIdService } from "@/services/dashboard/payment/payment/payment.service";

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

// Updated request interface to match ModalSubscription pattern
export interface UpdatePaymentRequest {
  amount: number;
  paymentMethod: string;
  status: string;
  referenceNumber: string;
  notes: string;
  imageUrl: string;
}

export interface CreatePaymentRequest {
  businessId: string;
  amount: number;
  paymentMethod: string;
  status: string;
  referenceNumber: string;
  notes: string;
  imageUrl: string;
  paymentType: string;
}

type Props = {
  mode: ModalMode;
  paymentId?: string;
  onClose: () => void;
  isOpen: boolean;
  isSubmitting?: boolean;
  onSave: (data: CreatePaymentRequest | UpdatePaymentRequest) => void;
  error?: string | null;
};

export default function ModalPayment({
  isOpen,
  onClose,
  paymentId,
  mode,
  onSave,
  isSubmitting = false,
  error = null,
}: Props) {
  const isCreate = mode === ModalMode.CREATE_MODE;
  const schema = isCreate ? CreatePaymentSchema : UpdatePaymentSchema;

  const [paymentData, setPaymentData] = useState<PaymentModel | null>(null);
  const [isLoadingData, setIsLoadingData] = useState(false);
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
    formState: { errors, isDirty },
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

  // Fetch payment data for edit mode
  useEffect(() => {
    const fetchPaymentData = async () => {
      if (!paymentId || !isOpen || isCreate) return;

      setIsLoadingData(true);
      try {
        const data = await getPaymentByIdService(paymentId);
        setPaymentData(data);

        // Populate form with fetched data
        const formData = {
          amount: data?.amount || 0,
          paymentMethod: data?.paymentMethod || "",
          status: data?.status || "PENDING",
          referenceNumber: data?.referenceNumber || "",
          notes: data?.notes || "",
          imageUrl: data?.imageUrl || "",
        };
        reset(formData);

        // Set image preview
        setLogoPreview(
          data?.imageUrl
            ? `${process.env.NEXT_PUBLIC_API_BASE_URL}${data.imageUrl}`
            : null
        );
      } catch (error: any) {
        console.error("Error fetching payment data:", error);
      } finally {
        setIsLoadingData(false);
      }
    };

    fetchPaymentData();
  }, [paymentId, isOpen, reset, isCreate]);

  // Reset form for create mode
  useEffect(() => {
    if (isOpen && isCreate) {
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
    }
  }, [isOpen, isCreate, reset]);

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
          setValue("imageUrl", fullImageUrl, {
            shouldValidate: true,
            shouldDirty: true,
          });
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
    if (isCreate) {
      const payload: CreatePaymentRequest = {
        businessId:
          (formData as CreatePaymentFormData).businessId?.trim() || "",
        amount: formData.amount ?? 0,
        paymentMethod: (formData.paymentMethod || "").trim(),
        status: (formData.status || "PENDING").trim(),
        referenceNumber: (formData.referenceNumber || "").trim(),
        notes: (formData.notes || "").trim(),
        imageUrl: (formData.imageUrl || "").trim(),
        paymentType: (
          (formData as CreatePaymentFormData).paymentType || "SUBSCRIPTION"
        ).trim(),
      };
      onSave(payload);
    } else {
      const payload: UpdatePaymentRequest = {
        amount: formData.amount ?? 0,
        paymentMethod: (formData.paymentMethod || "").trim(),
        status: (formData.status || "PENDING").trim(),
        referenceNumber: (formData.referenceNumber || "").trim(),
        notes: (formData.notes || "").trim(),
        imageUrl: (formData.imageUrl || "").trim(),
      };
      onSave(payload);
    }
  };

  const handleClose = () => {
    reset();
    setLogoPreview(null);
    setSelectedBusiness(null);
    setPaymentData(null);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl h-[90vh] p-0 gap-0 flex flex-col">
        {/* Header */}
        <DialogHeader className="px-6 py-4 border-b bg-muted/30 flex-shrink-0">
          <div className="flex items-center gap-4 pr-8">
            <div className="p-2 bg-blue-100 rounded-full">
              <CreditCard className="h-5 w-5 text-blue-600" />
            </div>
            <div className="flex-1">
              <DialogTitle className="text-xl font-semibold">
                {isCreate ? "Create Payment" : "Edit Payment"}
              </DialogTitle>
              <DialogDescription className="text-base text-muted-foreground">
                {isCreate
                  ? "Fill out the form to create a new payment record."
                  : paymentData
                  ? `Update payment for "${
                      paymentData.businessName || "Business"
                    }"`
                  : "Loading payment information..."}
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
            ) : !isCreate && !paymentData ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">
                  No payment data available
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                {/* Error Display */}
                {error && (
                  <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-md">
                    <p className="text-sm text-destructive font-medium">
                      {error}
                    </p>
                  </div>
                )}

                {/* Business Selection - Create only */}
                {isCreate && (
                  <div className="space-y-2">
                    <Label htmlFor="businessId" className="text-sm font-medium">
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
                    {isCreate &&
                      "businessId" in errors &&
                      errors.businessId && (
                        <p className="text-sm text-red-600 flex items-center gap-1">
                          <AlertCircle className="w-4 h-4 flex-shrink-0" />
                          {errors.businessId.message}
                        </p>
                      )}
                  </div>
                )}

                {/* Amount */}
                <div className="space-y-2">
                  <Label htmlFor="amount" className="text-sm font-medium">
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
                        className={`transition-colors focus:border-green-500 ${
                          errors.amount ? "border-red-500" : ""
                        }`}
                      />
                    )}
                  />
                  {errors.amount && (
                    <p className="text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4 flex-shrink-0" />
                      {errors.amount.message}
                    </p>
                  )}
                </div>

                {/* Payment Method */}
                <div className="space-y-2">
                  <Label
                    htmlFor="paymentMethod"
                    className="text-sm font-medium"
                  >
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
                          className={`transition-colors focus:border-green-500 ${
                            errors.paymentMethod ? "border-red-500" : ""
                          }`}
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
                    <p className="text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4 flex-shrink-0" />
                      {errors.paymentMethod.message}
                    </p>
                  )}
                </div>

                {/* Payment Type - Create only */}
                {isCreate && (
                  <div className="space-y-2">
                    <Label
                      htmlFor="paymentType"
                      className="text-sm font-medium"
                    >
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
                          <SelectTrigger className="transition-colors focus:border-green-500">
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
                    <Label htmlFor="status" className="text-sm font-medium">
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
                            className={`transition-colors focus:border-green-500 ${
                              errors.status ? "border-red-500" : ""
                            }`}
                          >
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                          <SelectContent>
                            {PAYMENT_STATUS_OPTIONS.map((status) => (
                              <SelectItem
                                key={status.value}
                                value={status.value}
                              >
                                <div className="flex items-center gap-2">
                                  <div
                                    className={`w-2 h-2 rounded-full ${
                                      status.value === "COMPLETED"
                                        ? "bg-green-500"
                                        : status.value === "PENDING"
                                        ? "bg-yellow-500"
                                        : status.value === "FAILED"
                                        ? "bg-red-500"
                                        : "bg-gray-400"
                                    }`}
                                  ></div>
                                  {status.label}
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    />
                    {errors.status && (
                      <p className="text-sm text-red-600 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4 flex-shrink-0" />
                        {errors.status.message}
                      </p>
                    )}
                  </div>
                )}

                {/* Reference Number */}
                <div className="space-y-2">
                  <Label
                    htmlFor="referenceNumber"
                    className="text-sm font-medium"
                  >
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
                        className={`transition-colors focus:border-green-500 ${
                          errors.referenceNumber ? "border-red-500" : ""
                        }`}
                      />
                    )}
                  />
                  {errors.referenceNumber && (
                    <p className="text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4 flex-shrink-0" />
                      {errors.referenceNumber.message}
                    </p>
                  )}
                </div>

                {/* Notes */}
                <div className="space-y-2">
                  <Label htmlFor="notes" className="text-sm font-medium">
                    Notes
                  </Label>
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
                        className="transition-colors focus:border-green-500"
                      />
                    )}
                  />
                </div>

                {/* Payment Receipt Upload */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Payment Receipt</Label>
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
                    </CardContent>
                  </Card>
                </div>

                {/* Current Payment Info Card - Edit Mode */}
                {!isCreate && paymentData && (
                  <div className="mt-6 p-4 bg-muted/30 rounded-lg border border-border">
                    <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                      Current Payment Details
                    </h4>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Business:</span>
                        <p className="font-medium">
                          {paymentData.businessName || "N/A"}
                        </p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Amount:</span>
                        <p className="font-medium">${paymentData.amount}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Method:</span>
                        <p className="font-medium">
                          {paymentData.paymentMethod}
                        </p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Status:</span>
                        <p className="font-medium flex items-center gap-2">
                          <div
                            className={`w-2 h-2 rounded-full ${
                              paymentData.status === "COMPLETED"
                                ? "bg-green-500"
                                : paymentData.status === "PENDING"
                                ? "bg-yellow-500"
                                : paymentData.status === "FAILED"
                                ? "bg-red-500"
                                : "bg-gray-400"
                            }`}
                          ></div>
                          {paymentData.status}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </form>
            )}
          </div>
        </ScrollArea>

        {/* Footer */}
        <div className="flex justify-between items-center p-6 border-t bg-muted/30 flex-shrink-0">
          <div className="text-sm text-muted-foreground flex items-center gap-2">
            {isSubmitting ? (
              <>
                <Loader2 className="h-3 w-3 animate-spin" />
                {isCreate ? "Creating payment..." : "Updating payment..."}
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
                  {isCreate ? "Creating..." : "Updating..."}
                </>
              ) : isCreate ? (
                "Create Payment"
              ) : (
                "Update Payment"
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
