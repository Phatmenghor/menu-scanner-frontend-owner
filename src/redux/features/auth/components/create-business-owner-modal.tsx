// src/components/features/subscription/modals/create-subscription-modal.tsx
"use client";

import React, { useEffect, useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Loading from "@/components/shared/common/loading";
import { TextField } from "@/components/shared/form-field/text-field";
import { TextareaField } from "@/components/shared/form-field/text-area-field";
import { NumberField } from "@/components/shared/form-field/number-field";
import { CheckboxField } from "@/components/shared/form-field/checkbox-field";
import { CancelButton } from "@/components/shared/form-field/cancel-button";
import { SubmitButton } from "@/components/shared/form-field/submid-button";
import { PasswordField } from "@/components/shared/form-field/password-field";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import { showToast } from "@/components/shared/common/show-toast";
import { FormHeader } from "@/components/shared/form-field/form-header";
import { FormBody } from "@/components/shared/form-field/form-body";
import { FormFooter } from "@/components/shared/form-field/form-footer";
import { getFieldError } from "@/utils/common/get-field-error";
import { ComboboxSelectSubscriptionPlan } from "@/components/shared/combo-box/combobox-plan";
import {
  selectError,
  selectOperations,
} from "../store/selectors/business-owner-selectors";
import { clearError } from "../store/slice/business-owner-slice";
import {
  CreateBusinessOwnerData,
  createBusinessOwnerSchema,
} from "../store/models/schema/business-owner.schema";
import { createBusinessOwnerService } from "../store/thunks/business-owner-thunks";

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

export default function CreateSubscriptionModal({ isOpen, onClose }: Props) {
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useAppDispatch();

  const operations = useAppSelector(selectOperations);
  const reduxError = useAppSelector(selectError);
  const { isCreating } = operations;

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isDirty },
  } = useForm<CreateBusinessOwnerData>({
    resolver: zodResolver(createBusinessOwnerSchema),
    defaultValues: {
      ownerUserIdentifier: "",
      ownerEmail: "",
      ownerPassword: "",
      ownerFullName: "",
      ownerPhone: "",
      businessName: "",
      businessEmail: "",
      businessPhone: "",
      businessAddress: "",
      planId: "",
      customDurationDays: 0,
      paymentAmount: 0,
      paymentMethod: "",
      paymentReference: "",
      paymentNotes: "",
      paymentInfoComplete: false,
    },
    mode: "onChange",
  });

  const businessName = watch("businessName");

  useEffect(() => {
    if (isOpen) {
      dispatch(clearError());
      reset();
    }
  }, [isOpen, dispatch, reset]);

  const onSubmit = async (data: CreateBusinessOwnerData) => {
    try {
      const payload: CreateBusinessOwnerData = {
        ownerUserIdentifier: data.ownerUserIdentifier,
        ownerEmail: data.ownerEmail,
        ownerPassword: data.ownerPassword,
        ownerFullName: data.ownerFullName,
        ownerPhone: data.ownerPhone,
        businessName: data.businessName,
        businessEmail: data.businessEmail,
        businessPhone: data.businessPhone,
        businessAddress: data.businessAddress,
        planId: data.planId,
        customDurationDays: data.customDurationDays,
        paymentAmount: data.paymentAmount,
        paymentMethod: data.paymentMethod,
        paymentReference: data?.paymentReference || undefined,
        paymentNotes: data?.paymentNotes || undefined,
        paymentInfoComplete: data.paymentInfoComplete,
      };

      const result = await dispatch(
        createBusinessOwnerService(payload)
      ).unwrap();
      showToast.success(
        `User Business Subscription for "${result.businessName}" created successfully`
      );
      handleClose();
    } catch (error: any) {
      showToast.error(error || "Failed to create User Business subscription");
    }
  };

  const handleClose = () => {
    reset();
    dispatch(clearError());
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] p-0 flex flex-col">
        <FormHeader
          title="Create New Subscription"
          description="Fill out the form to create a new subscription"
          avatarName={businessName}
          showAvatar={false}
        />

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col flex-1 overflow-hidden"
        >
          <FormBody>
            {reduxError && (
              <div className="p-4 bg-destructive/10 border border-destructive rounded-lg">
                <p className="text-sm text-destructive font-medium">
                  {reduxError}
                </p>
              </div>
            )}

            <div className="space-y-6">
              {/* Owner Information */}
              <div>
                <h3 className="text-lg font-semibold mb-4">
                  Owner Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <TextField
                    control={control}
                    name="ownerUserIdentifier"
                    label="Owner User Identifier"
                    placeholder="Enter owner identifier"
                    required
                    disabled={isCreating}
                    error={getFieldError(errors.ownerUserIdentifier)}
                  />

                  <TextField
                    control={control}
                    name="ownerEmail"
                    label="Owner Email"
                    type="email"
                    placeholder="Enter owner email"
                    required
                    disabled={isCreating}
                    error={getFieldError(errors.ownerEmail)}
                  />

                  <TextField
                    control={control}
                    name="ownerFullName"
                    label="Owner Full Name"
                    placeholder="Enter owner full name"
                    required
                    disabled={isCreating}
                    error={getFieldError(errors.ownerFullName)}
                  />

                  <TextField
                    control={control}
                    name="ownerPhone"
                    label="Owner Phone"
                    placeholder="Enter owner phone"
                    required
                    disabled={isCreating}
                    error={getFieldError(errors.ownerPhone)}
                  />

                  <PasswordField
                    control={control}
                    name="ownerPassword"
                    label="Owner Password"
                    placeholder="Enter password"
                    required
                    showPassword={showPassword}
                    onTogglePassword={() => setShowPassword(!showPassword)}
                    className="md:col-span-2"
                    disabled={isCreating}
                    error={getFieldError(errors.ownerPassword)}
                  />
                </div>
              </div>

              {/* Business Information */}
              <div>
                <h3 className="text-lg font-semibold mb-4">
                  Business Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <TextField
                    control={control}
                    name="businessName"
                    label="Business Name"
                    placeholder="Enter business name"
                    required
                    disabled={isCreating}
                    error={getFieldError(errors.businessName)}
                  />

                  <TextField
                    control={control}
                    name="businessEmail"
                    label="Business Email"
                    type="email"
                    placeholder="Enter business email"
                    required
                    disabled={isCreating}
                    error={getFieldError(errors.businessEmail)}
                  />

                  <TextField
                    control={control}
                    name="businessPhone"
                    label="Business Phone"
                    placeholder="Enter business phone"
                    required
                    disabled={isCreating}
                    error={getFieldError(errors.businessPhone)}
                  />

                  <TextField
                    control={control}
                    name="businessAddress"
                    label="Business Address"
                    placeholder="Enter business address"
                    required
                    className="md:col-span-2"
                    disabled={isCreating}
                    error={getFieldError(errors.businessAddress)}
                  />
                </div>
              </div>

              {/* Subscription Details */}
              <div>
                <h3 className="text-lg font-semibold mb-4">
                  Subscription Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <ComboboxSelectSubscriptionPlan
                    dataSelect={null}
                    onChangeSelected={(plan) => {
                      setValue("planId", plan?.id || "", {
                        shouldDirty: true,
                        shouldValidate: true,
                      });
                    }}
                    label="Subscription Plan"
                    placeholder="Select plan"
                    required
                    disabled={isCreating}
                    error={getFieldError(errors.planId)?.message}
                  />

                  <NumberField
                    control={control}
                    name="customDurationDays"
                    label="Custom Duration (Days)"
                    placeholder="Enter duration"
                    required
                    disabled={isCreating}
                    min={0}
                    error={getFieldError(errors.customDurationDays)}
                  />

                  <NumberField
                    control={control}
                    name="paymentAmount"
                    label="Payment Amount"
                    placeholder="Enter amount"
                    required
                    disabled={isCreating}
                    min={0}
                    step={0.01}
                    error={getFieldError(errors.paymentAmount)}
                  />

                  <TextField
                    control={control}
                    name="paymentMethod"
                    label="Payment Method"
                    placeholder="Enter payment method"
                    required
                    disabled={isCreating}
                    error={getFieldError(errors.paymentMethod)}
                  />

                  <TextField
                    control={control}
                    name="paymentReference"
                    label="Payment Reference"
                    placeholder="Enter payment reference (optional)"
                    disabled={isCreating}
                    error={getFieldError(errors.paymentReference)}
                  />

                  <CheckboxField
                    control={control}
                    name="paymentInfoComplete"
                    label="Payment Information Complete"
                    disabled={isCreating}
                  />

                  <TextareaField
                    control={control}
                    name="paymentNotes"
                    label="Payment Notes"
                    placeholder="Enter payment notes (optional)"
                    rows={3}
                    className="md:col-span-2"
                    disabled={isCreating}
                    error={getFieldError(errors.paymentNotes)}
                  />
                </div>
              </div>
            </div>
          </FormBody>

          <FormFooter
            isSubmitting={isCreating}
            isDirty={isDirty}
            isCreate={true}
            createMessage="Creating subscription..."
          >
            <CancelButton onClick={handleClose} disabled={isCreating} />
            <SubmitButton
              isSubmitting={isCreating}
              isDirty={isDirty}
              isCreate={true}
              createText="Create Subscription"
              submittingCreateText="Creating..."
            />
          </FormFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
