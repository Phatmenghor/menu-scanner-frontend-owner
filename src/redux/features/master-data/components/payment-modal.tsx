"use client";

import React, { useEffect, useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ModalMode } from "@/constants/app-resource/status/status";
import Loading from "@/components/shared/common/loading";
import { TextField } from "@/components/shared/form-field/text-field";
import { TextareaField } from "@/components/shared/form-field/text-area-field";
import { SelectField } from "@/components/shared/form-field/select-field";
import { CancelButton } from "@/components/shared/form-field/cancel-button";
import { SubmitButton } from "@/components/shared/form-field/submid-button";
import { FormHeader } from "@/components/shared/form-field/form-header";
import { FormBody } from "@/components/shared/form-field/form-body";
import { FormFooter } from "@/components/shared/form-field/form-footer";
import { ImageUploadField } from "@/components/shared/form-field/image-upload-field";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import { showToast } from "@/components/shared/common/show-toast";
import {
  createPaymentSchema,
  PaymentFormData,
  updatePaymentSchema,
} from "../store/models/schema/payment-schema";
import { clearError, clearSelectedPayment } from "../store/slice/payment-slice";
import {
  CreatePaymentRequest,
  UpdatePaymentRequest,
} from "../store/models/request/payment-request";
import { BusinessResponseModel } from "@/redux/features/master-data/store/models/response/business-response";
import {
  selectError,
  selectIsFetchingDetail,
  selectOperations,
} from "../store/selectors/payment-selector";
import { SubscriptionResponseModel } from "../store/models/response/subscription-response";
import {
  createPaymentService,
  fetchPaymentByIdService,
  updatePaymentService,
} from "../store/thunks/payment-thunks";
import { ComboboxSelectBusiness } from "@/components/shared/combo-box/combobox-business";
import { ComboboxSelectSubscription } from "@/components/shared/combo-box/combobox-subscription";
import {
  PAYMENT_METHOD_CREATE_UPDATE,
  PAYMENT_STATUS_CREATE_UPDATE,
  PAYMENT_TYPE_CREATE_UPDATE,
} from "@/constants/app-resource/status/create-update-status";
import { uploadImageService } from "@/services/image-service";

type Props = {
  mode: ModalMode;
  paymentId?: string;
  onClose: () => void;
  isOpen: boolean;
};

export default function PaymentModal({
  isOpen,
  onClose,
  paymentId,
  mode,
}: Props) {
  const isCreate = mode === ModalMode.CREATE_MODE;

  const dispatch = useAppDispatch();

  // Get operations state from Redux
  const operations = useAppSelector(selectOperations);
  const isFetchingDetail = useAppSelector(selectIsFetchingDetail);
  const reduxError = useAppSelector(selectError);
  const { isCreating, isUpdating } = operations;

  const [selectedBusiness, setSelectedBusiness] =
    useState<BusinessResponseModel | null>(null);
  const [selectedSubscription, setSelectedSubscription] =
    useState<SubscriptionResponseModel | null>(null);

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isDirty },
  } = useForm<PaymentFormData>({
    resolver: zodResolver(
      isCreate ? createPaymentSchema : updatePaymentSchema
    ) as any,
    defaultValues: {
      imageUrl: "",
      subscriptionId: "",
      businessId: "",
      amount: 0,
      paymentType: "",
      paymentMethod: "",
      status: "",
      referenceNumber: "",
      notes: "",
    },
    mode: "onChange",
  });

  // Fetch Payment data for edit mode
  useEffect(() => {
    const fetchPaymentData = async () => {
      if (!paymentId || !isOpen || isCreate) return;

      try {
        const resultAction = await dispatch(fetchPaymentByIdService(paymentId));

        if (fetchPaymentByIdService.fulfilled.match(resultAction)) {
          const response = resultAction.payload;

          reset({
            id: response.id,
            imageUrl: response.imageUrl,
            subscriptionId: response.subscriptionId,
            businessId: response.businessId,
            amount: response.amount,
            paymentType: response.paymentType,
            paymentMethod: response.paymentMethod,
            status: response.status,
            referenceNumber: response.referenceNumber,
            notes: response.notes,
          });

          if (response.businessId && response.businessName) {
            setSelectedBusiness({
              id: response.businessId,
              name: response?.businessName || "",
            } as BusinessResponseModel);
          }

          if (response.subscriptionId) {
            setSelectedSubscription({
              id: response.subscriptionId,
              businessName: response.businessName || "",
              planName: response.planName || "",
            } as SubscriptionResponseModel);
          }
        }
      } catch (error) {
        console.error("Error fetching payment data:", error);
      }
    };

    fetchPaymentData();
  }, [paymentId, isOpen, isCreate, reset, dispatch]);

  // Reset form for create mode
  useEffect(() => {
    if (isOpen && isCreate) {
      reset({
        imageUrl: "",
        subscriptionId: "",
        businessId: "",
        amount: 0,
        paymentType: "",
        paymentMethod: "",
        status: "",
        referenceNumber: "",
        notes: "",
      });
      setSelectedBusiness(null);
      setSelectedSubscription(null);
    }
  }, [isOpen, isCreate, reset]);

  // Clear errors when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      dispatch(clearError());
    }
  }, [isOpen, dispatch]);

  const onSubmit = async (data: PaymentFormData) => {
    try {
      let imageUrl = data.imageUrl;

      if (imageUrl && imageUrl.startsWith("data:image")) {
        try {
          const imageType = imageUrl.split(";")[0].split("/")[1];

          const uploadResult = await uploadImageService({
            base64: imageUrl,
            type: imageType,
          });

          if (uploadResult && uploadResult.imageUrl) {
            imageUrl = uploadResult.imageUrl;
          } else {
            throw new Error("Failed to upload image");
          }
        } catch (uploadError) {
          console.error("Error uploading image:", uploadError);
          showToast.error("Failed to upload image. Please try again.");
          return; // Stop submission if image upload fails
        }
      }

      if (isCreate) {
        const payload: CreatePaymentRequest = {
          imageUrl: imageUrl,
          subscriptionId: data.subscriptionId,
          businessId: data.businessId,
          amount: data.amount,
          paymentMethod: data.paymentMethod,
          paymentType: data.paymentType,
          status: data.status,
          referenceNumber: data.referenceNumber,
          notes: data.notes,
        };

        const result = await dispatch(createPaymentService(payload)).unwrap();

        showToast.success(
          `Payment "${result.referenceNumber || "record"}" created successfully`
        );

        handleClose();
      } else {
        const payload: UpdatePaymentRequest = {
          imageUrl: imageUrl,
          subscriptionId: data.subscriptionId,
          businessId: data.businessId,
          amount: data.amount,
          paymentMethod: data.paymentMethod,
          paymentType: data.paymentType,
          status: data.status,
          referenceNumber: data.referenceNumber,
          notes: data.notes,
        };

        const result = await dispatch(
          updatePaymentService({ paymentId: data.id!, paymentData: payload })
        ).unwrap();

        showToast.success(
          `Payment "${result.referenceNumber || "record"}" updated successfully`
        );

        handleClose();
      }
    } catch (error: any) {
      console.error("Error saving payment:", error);
      showToast.error(error || "Failed to save payment");
    }
  };

  const handleClose = () => {
    reset();
    setSelectedBusiness(null);
    setSelectedSubscription(null);
    dispatch(clearError());
    dispatch(clearSelectedPayment());
    onClose();
  };

  const isSubmitting = isCreate ? isCreating : isUpdating;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] p-0 flex flex-col">
        {/* Header */}
        <FormHeader
          title={isCreate ? "Create New Payment" : "Update Payment Information"}
          description={
            isCreate
              ? "Fill out the form to create a new payment"
              : "Update payment information below"
          }
          showAvatar={false}
          isCreate={isCreate}
        />

        {/* Loading State - Edit Mode Only */}
        {!isCreate && isFetchingDetail ? (
          <div className="p-6 flex items-center justify-center min-h-[400px] flex-1">
            <Loading />
          </div>
        ) : (
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col flex-1 overflow-hidden"
          >
            {/* Body */}
            <FormBody>
              {/* Error Display */}
              {reduxError && (
                <div className="p-4 bg-destructive/10 border border-destructive rounded-lg">
                  <p className="text-sm text-destructive font-medium">
                    {reduxError}
                  </p>
                </div>
              )}

              {/* Form Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Business Selection - Combobox (needs Controller) */}
                <Controller
                  control={control}
                  name="businessId"
                  render={({ field }) => (
                    <ComboboxSelectBusiness
                      dataSelect={selectedBusiness}
                      onChangeSelected={(business) => {
                        setSelectedBusiness(business);
                        field.onChange(business?.id || "");
                      }}
                      label="Business"
                      placeholder="Select a business..."
                      disabled={isSubmitting}
                      showAllOption={false}
                      error={errors.businessId?.message}
                    />
                  )}
                />

                {/* Subscription Selection - Combobox (needs Controller) */}
                <Controller
                  control={control}
                  name="subscriptionId"
                  render={({ field }) => (
                    <ComboboxSelectSubscription
                      dataSelect={selectedSubscription}
                      onChangeSelected={(subscription) => {
                        setSelectedSubscription(subscription);
                        field.onChange(subscription?.id || "");
                      }}
                      label="Subscription"
                      placeholder="Select a subscription..."
                      disabled={isSubmitting}
                      showAllOption={false}
                      error={errors.subscriptionId?.message}
                    />
                  )}
                />

                {/* Amount */}
                <TextField
                  control={control}
                  name="amount"
                  label="Amount"
                  type="number"
                  placeholder="Enter amount"
                  required
                  disabled={isSubmitting}
                  error={errors.amount}
                />

                {/* Payment Type */}
                <SelectField
                  control={control}
                  name="paymentType"
                  label="Payment Type"
                  placeholder="Select payment type"
                  options={PAYMENT_TYPE_CREATE_UPDATE}
                  required
                  disabled={isSubmitting}
                  error={errors.paymentType}
                />

                {/* Payment Method */}
                <SelectField
                  control={control}
                  name="paymentMethod"
                  label="Payment Method"
                  placeholder="Select payment method"
                  options={PAYMENT_METHOD_CREATE_UPDATE}
                  required
                  disabled={isSubmitting}
                  error={errors.paymentMethod}
                />

                {/* Status */}
                <SelectField
                  control={control}
                  name="status"
                  label="Payment Status"
                  placeholder="Select payment status"
                  options={PAYMENT_STATUS_CREATE_UPDATE}
                  required
                  disabled={isSubmitting}
                  error={errors.status}
                />

                {/* Reference Number */}
                <TextField
                  control={control}
                  name="referenceNumber"
                  label="Reference Number"
                  placeholder="Enter reference number"
                  disabled={isSubmitting}
                  error={errors.referenceNumber}
                />
              </div>

              {/* Image Upload - Full Width */}
              <Controller
                control={control}
                name="imageUrl"
                render={({ field }) => (
                  <ImageUploadField
                    label="Payment Receipt/Proof"
                    value={field.value}
                    onChange={field.onChange}
                    disabled={isSubmitting}
                    error={errors.imageUrl?.message}
                    accept="image/*"
                    maxSize={5}
                  />
                )}
              />

              {/* Notes - Full Width */}
              <TextareaField
                control={control}
                name="notes"
                label="Notes"
                placeholder="Enter any additional notes (optional)"
                rows={5}
                disabled={isSubmitting}
                error={errors.notes}
              />
            </FormBody>

            {/* Footer */}
            <FormFooter
              isSubmitting={isSubmitting}
              isDirty={isDirty}
              isCreate={isCreate}
              createMessage="Creating payment..."
              updateMessage="Updating payment..."
            >
              <CancelButton onClick={handleClose} disabled={isSubmitting} />

              <SubmitButton
                isSubmitting={isSubmitting}
                isDirty={isDirty}
                isCreate={isCreate}
                createText="Create Payment"
                updateText="Update Payment"
                submittingCreateText="Creating..."
                submittingUpdateText="Updating..."
              />
            </FormFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
