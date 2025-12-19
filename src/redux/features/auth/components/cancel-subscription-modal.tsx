// src/components/features/subscription/modals/cancel-subscription-modal.tsx
"use client";

import React, { useEffect } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { TextField } from "@/components/shared/form-field/text-field";
import { TextareaField } from "@/components/shared/form-field/text-area-field";
import { NumberField } from "@/components/shared/form-field/number-field";
import { CancelButton } from "@/components/shared/form-field/cancel-button";
import { SubmitButton } from "@/components/shared/form-field/submid-button";
import { FormHeader } from "@/components/shared/form-field/form-header";
import { FormBody } from "@/components/shared/form-field/form-body";
import { FormFooter } from "@/components/shared/form-field/form-footer";
import { getFieldError } from "@/utils/common/get-field-error";
import { AlertTriangle } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import {
  selectError,
  selectOperations,
} from "../store/selectors/business-owner-selectors";
import {
  CancelSubscriptionData,
  cancelSubscriptionSchema,
} from "../store/models/schema/business-owner.schema";
import { clearError } from "../store/slice/business-owner-slice";
import { showToast } from "@/components/shared/common/show-toast";
import { updateBusinessOwnerCancelService } from "../store/thunks/business-owner-thunks";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  ownerId: string;
  ownerName?: string;
};

export default function CancelSubscriptionModal({
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
    formState: { errors, isDirty },
  } = useForm<CancelSubscriptionData>({
    resolver: zodResolver(cancelSubscriptionSchema),
    defaultValues: {
      reason: "",
      notes: "",
      refundAmount: 0,
      refundMethod: "",
      refundReference: "",
    },
    mode: "onChange",
  });

  useEffect(() => {
    if (isOpen) {
      dispatch(clearError());
      reset();
    }
  }, [isOpen, dispatch, reset]);

  const onSubmit = async (data: CancelSubscriptionData) => {
    try {
      const payload: CancelSubscriptionData = {
        reason: data.reason,
        notes: data.notes || undefined,
        refundAmount: data.refundAmount,
        refundMethod: data.refundMethod || undefined,
        refundReference: data.refundReference || undefined,
      };

      await dispatch(
        updateBusinessOwnerCancelService({
          ownerId,
          businessOwnerData: payload,
        })
      ).unwrap();

      showToast.success("Subscription canceled successfully");
      handleClose();
    } catch (error: any) {
      showToast.error(error || "Failed to cancel subscription");
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
          title="Cancel Subscription"
          description={`Cancel subscription for ${ownerName || "business"}`}
          showAvatar={false}
        />

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col flex-1 overflow-hidden"
        >
          <FormBody>
            {/* Warning Alert */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-yellow-800">
                  Warning: This action cannot be undone
                </p>
                <p className="text-sm text-yellow-700 mt-1">
                  Canceling this subscription will immediately revoke access for
                  the business.
                </p>
              </div>
            </div>

            {reduxError && (
              <div className="p-4 bg-destructive/10 border border-destructive rounded-lg">
                <p className="text-sm text-destructive font-medium">
                  {reduxError}
                </p>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <TextField
                control={control}
                name="reason"
                label="Cancellation Reason"
                placeholder="Enter reason for cancellation"
                required
                className="md:col-span-2"
                disabled={isUpdating}
                error={getFieldError(errors.reason)}
              />

              <NumberField
                control={control}
                name="refundAmount"
                label="Refund Amount"
                placeholder="Enter refund amount"
                required
                disabled={isUpdating}
                min={0}
                step={0.01}
                error={getFieldError(errors.refundAmount)}
              />

              <TextField
                control={control}
                name="refundMethod"
                label="Refund Method"
                placeholder="Enter refund method (optional)"
                disabled={isUpdating}
                error={getFieldError(errors.refundMethod)}
              />

              <TextField
                control={control}
                name="refundReference"
                label="Refund Reference"
                placeholder="Enter refund reference (optional)"
                disabled={isUpdating}
                error={getFieldError(errors.refundReference)}
              />

              <TextareaField
                control={control}
                name="notes"
                label="Additional Notes"
                placeholder="Enter additional notes (optional)"
                rows={3}
                className="md:col-span-2"
                disabled={isUpdating}
                error={getFieldError(errors.notes)}
              />
            </div>
          </FormBody>

          <FormFooter
            isSubmitting={isUpdating}
            isDirty={isDirty}
            isCreate={false}
            createMessage="Canceling subscription..."
          >
            <CancelButton onClick={handleClose} disabled={isUpdating} />
            <SubmitButton
              isSubmitting={isUpdating}
              isDirty={isDirty}
              isCreate={false}
              updateText="Cancel Subscription"
              submittingUpdateText="Canceling..."
              variant="destructive"
            />
          </FormFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
