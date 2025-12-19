// src/components/features/subscription/modals/change-plan-modal.tsx
"use client";

import React, { useEffect } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { TextField } from "@/components/shared/form-field/text-field";
import { TextareaField } from "@/components/shared/form-field/text-area-field";
import { NumberField } from "@/components/shared/form-field/number-field";
import { CheckboxField } from "@/components/shared/form-field/checkbox-field";
import { CancelButton } from "@/components/shared/form-field/cancel-button";
import { SubmitButton } from "@/components/shared/form-field/submid-button";
import { FormHeader } from "@/components/shared/form-field/form-header";
import { FormBody } from "@/components/shared/form-field/form-body";
import { FormFooter } from "@/components/shared/form-field/form-footer";
import { getFieldError } from "@/utils/common/get-field-error";
import { ComboboxSelectSubscriptionPlan } from "@/components/shared/combo-box/combobox-plan";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import {
  selectError,
  selectOperations,
} from "../store/selectors/business-owner-selectors";
import {
  ChangePlanData,
  changePlanSchema,
} from "../store/models/schema/business-owner.schema";
import { clearError } from "../store/slice/business-owner-slice";
import { showToast } from "@/components/shared/common/show-toast";
import { updateBusinessOwnerChangePlanService } from "../store/thunks/business-owner-thunks";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  ownerId: string;
  ownerName?: string;
};

export default function ChangePlanModal({
  isOpen,
  onClose,
  ownerId,
  ownerName,
}: Props) {
  const dispatch = useAppDispatch();

  const operations = useAppSelector(selectOperations);
  const reduxError = useAppSelector(selectError);
  const { isUpdating } = operations;

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isDirty },
  } = useForm<ChangePlanData>({
    resolver: zodResolver(changePlanSchema),
    defaultValues: {
      newPlanId: "",
      keepCurrentEndDate: true,
      paymentAmount: 0,
      paymentMethod: "",
      paymentReference: "",
      paymentNotes: "",
      paymentInfoComplete: false,
    },
    mode: "onChange",
  });

  useEffect(() => {
    if (isOpen) {
      dispatch(clearError());
      reset();
    }
  }, [isOpen, dispatch, reset]);

  const onSubmit = async (data: ChangePlanData) => {
    try {
      const payload: ChangePlanData = {
        newPlanId: data.newPlanId,
        keepCurrentEndDate: data.keepCurrentEndDate,
        paymentAmount: data.paymentAmount,
        paymentMethod: data.paymentMethod,
        paymentReference: data.paymentReference || undefined,
        paymentNotes: data.paymentNotes || undefined,
        paymentInfoComplete: data.paymentInfoComplete,
      };

      await dispatch(
        updateBusinessOwnerChangePlanService({
          ownerId,
          businessOwnerData: payload,
        })
      ).unwrap();

      showToast.success("Plan changed successfully");
      handleClose();
    } catch (error: any) {
      showToast.error(error || "Failed to change plan");
    }
  };

  const handleClose = () => {
    reset();
    dispatch(clearError());
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] p-0 flex flex-col">
        <FormHeader
          title="Change Subscription Plan"
          description={`Change plan for ${ownerName || "business"}`}
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ComboboxSelectSubscriptionPlan
                dataSelect={null}
                onChangeSelected={(plan) => {
                  setValue("newPlanId", plan?.id || "", {
                    shouldDirty: true,
                    shouldValidate: true,
                  });
                }}
                label="New Plan"
                placeholder="Select new plan"
                required
                disabled={isUpdating}
                error={getFieldError(errors.newPlanId)?.message}
              />

              <CheckboxField
                control={control}
                name="keepCurrentEndDate"
                label="Keep Current End Date"
                disabled={isUpdating}
              />

              <NumberField
                control={control}
                name="paymentAmount"
                label="Payment Amount"
                placeholder="Enter amount"
                required
                disabled={isUpdating}
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
                disabled={isUpdating}
                error={getFieldError(errors.paymentMethod)}
              />

              <TextField
                control={control}
                name="paymentReference"
                label="Payment Reference"
                placeholder="Enter payment reference (optional)"
                disabled={isUpdating}
                error={getFieldError(errors.paymentReference)}
              />

              <CheckboxField
                control={control}
                name="paymentInfoComplete"
                label="Payment Information Complete"
                disabled={isUpdating}
              />

              <TextareaField
                control={control}
                name="paymentNotes"
                label="Payment Notes"
                placeholder="Enter payment notes (optional)"
                rows={3}
                className="md:col-span-2"
                disabled={isUpdating}
                error={getFieldError(errors.paymentNotes)}
              />
            </div>
          </FormBody>

          <FormFooter
            isSubmitting={isUpdating}
            isDirty={isDirty}
            isCreate={false}
            createMessage="Changing plan..."
          >
            <CancelButton onClick={handleClose} disabled={isUpdating} />
            <SubmitButton
              isSubmitting={isUpdating}
              isDirty={isDirty}
              isCreate={false}
              updateText="Change Plan"
              submittingUpdateText="Changing..."
            />
          </FormFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
