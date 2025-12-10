"use client";

import React, { useEffect } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ModalMode,
  BusinessStatus,
} from "@/constants/AppResource/status/status";
import { BUSINESS_STATUS_CREATE_UPDATE } from "@/constants/AppResource/status/create-update-status";
import Loading from "@/components/shared/common/loading";
import { TextField } from "@/components/shared/form-field/text-field";
import { TextareaField } from "@/components/shared/form-field/text-area-field";
import { SelectField } from "@/components/shared/form-field/select-field";
import { CancelButton } from "@/components/shared/form-field/cancel-button";
import { SubmitButton } from "@/components/shared/form-field/submid-button";
import { FormHeader } from "@/components/shared/form-field/form-header";
import { FormBody } from "@/components/shared/form-field/form-body";
import { FormFooter } from "@/components/shared/form-field/form-footer";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import { showToast } from "@/components/shared/common/app-toast";
import {
  createPaymentService,
  fetchPaymentByIdService,
  updatePaymentService,
} from "../store/thunks/payment-thunks";
import {
  selectError,
  selectIsFetchingDetail,
  selectOperations,
} from "../store/selectors/payment-selector";
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
import { da } from "date-fns/locale";

type Props = {
  mode: ModalMode;
  businessId?: string;
  onClose: () => void;
  isOpen: boolean;
};

export default function PaymentModal({
  isOpen,
  onClose,
  businessId,
  mode,
}: Props) {
  const isCreate = mode === ModalMode.CREATE_MODE;

  const dispatch = useAppDispatch();

  // Get operations state from Redux
  const operations = useAppSelector(selectOperations);
  const isFetchingDetail = useAppSelector(selectIsFetchingDetail);
  const reduxError = useAppSelector(selectError);
  const { isCreating, isUpdating } = operations;

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
      status: "",
      referenceNumber: "",
      notes: "",
    },
    mode: "onChange",
  });

  // Fetch business data for edit mode
  useEffect(() => {
    const fetchUserData = async () => {
      if (!businessId || !isOpen || isCreate) return;

      try {
        const resultAction = await dispatch(
          fetchPaymentByIdService(businessId)
        );

        if (fetchPaymentByIdService.fulfilled.match(resultAction)) {
          const resposne = resultAction.payload;

          reset({
            id: resposne.id,
          });
        }
      } catch (error) {
        console.error("Error fetching payment data:", error);
      }
    };

    fetchUserData();
  }, [businessId, isOpen, isCreate, reset, dispatch]);

  // Reset form for create mode
  useEffect(() => {
    if (isOpen && isCreate) {
      reset({
        imageUrl: "",
        subscriptionId: "",
        businessId: "",
        amount: 0,
        paymentType: "",
        status: "",
        referenceNumber: "",
        notes: "",
      });
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
      if (isCreate) {
        const payload: CreatePaymentRequest = {
          imageUrl: data.imageUrl,
          subscriptionId: data.subscriptionId,
          businessId: data.businessId,
          amount: data.amount!,
          paymentMethod: data.paymentType!,
          paymentType: data.paymentType!,
          status: data.status!,
          referenceNumber: data.referenceNumber,
          notes: data.notes,
        };

        const result = await dispatch(createPaymentService(payload)).unwrap();

        showToast.success(
          `Payment "${result.name || result.email}" created successfully`
        );

        handleClose();
      } else {
        const payload: UpdatePaymentRequest = {
          imageUrl: data.imageUrl,
          subscriptionId: data.subscriptionId,
          businessId: data.businessId,
          amount: data.amount!,
          status: data.status!,
          paymentMethod: data.paymentType!,
          paymentType: data.paymentType!,
          referenceNumber: data.referenceNumber,
          notes: data.notes,
        };

        const result = await dispatch(
          updatePaymentService({ paymentId: data.id!, paymentData: payload })
        ).unwrap();

        showToast.success(
          `Payment "${result.fullName || result.email}" updated successfully`
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
          title={
            isCreate ? "Create New payment" : "Update payment information below"
          }
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
                <TextField
                  control={control}
                  name="name"
                  label="Name"
                  placeholder="Enter name"
                  disabled={!isSubmitting}
                  required={isCreate}
                />

                <TextField
                  control={control}
                  name="email"
                  label="Email"
                  type="email"
                  placeholder="Enter email address"
                  disabled={isSubmitting}
                />

                <TextField
                  control={control}
                  name="phone"
                  label="Phnoe Number"
                  placeholder="Enter phone number"
                  disabled={isSubmitting}
                />

                <TextField
                  control={control}
                  name="address"
                  label="Address"
                  placeholder="Enter address"
                  disabled={isSubmitting}
                />

                <SelectField
                  control={control}
                  name="status"
                  label="Business Status"
                  placeholder="Select business status"
                  options={BUSINESS_STATUS_CREATE_UPDATE}
                  required
                  disabled={isSubmitting}
                />
              </div>

              {/* Notes - Separate Row */}
              <TextareaField
                control={control}
                name="description"
                label="Notes"
                placeholder="Enter any additional notes (optional)"
                rows={5}
                disabled={isSubmitting}
              />
            </FormBody>

            {/* Footer */}
            <FormFooter
              isSubmitting={isSubmitting}
              isDirty={isDirty}
              isCreate={isCreate}
              createMessage="Creating business..."
              updateMessage="Updating business..."
            >
              <CancelButton onClick={handleClose} disabled={isSubmitting} />

              <SubmitButton
                isSubmitting={isSubmitting}
                isDirty={isDirty}
                isCreate={isCreate}
                createText="Create Business"
                updateText="Update Business"
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
