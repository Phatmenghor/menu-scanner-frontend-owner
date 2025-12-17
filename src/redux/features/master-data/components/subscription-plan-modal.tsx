"use client";

import React, { useEffect } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ModalMode,
  SubscriptionPlanStatus,
} from "@/constants/app-resource/status/status";
import Loading from "@/components/shared/common/loading";
import { TextField } from "@/components/shared/form-field/text-field";
import { TextareaField } from "@/components/shared/form-field/text-area-field";
import { CancelButton } from "@/components/shared/form-field/cancel-button";
import { SubmitButton } from "@/components/shared/form-field/submid-button";
import { FormHeader } from "@/components/shared/form-field/form-header";
import { FormBody } from "@/components/shared/form-field/form-body";
import { FormFooter } from "@/components/shared/form-field/form-footer";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import { showToast } from "@/components/shared/common/show-toast";
import {
  selectError,
  selectIsFetchingDetail,
  selectOperations,
} from "../store/selectors/subscription-plan-selector";
import {
  createSubscriptionPlanSchema,
  SubscriptionPlanFormData,
  updateSubscriptionPlanSchema,
} from "../store/models/schema/subscription-plan-schema";
import {
  createSubscriptionPlanService,
  fetchSubscriptionPlanByIdService,
  updateSubscriptionPlanService,
} from "../store/thunks/subscription-plan-thunks";
import {
  clearError,
  clearSelectedSubscriptionPlan,
} from "../store/slice/subscription-plan-slice";
import {
  CreateSubscriptionPlanRequest,
  UpdateSubscriptionPlanRequest,
} from "../store/models/request/subscription-plan-request";
import { SelectField } from "@/components/shared/form-field/select-field";
import { SUBSCRIPTION_PLAN_CREATE_UPDATE } from "@/constants/app-resource/status/create-update-status";
import { getFieldError } from "@/utils/common/get-field-error";

type Props = {
  mode: ModalMode;
  planId?: string;
  onClose: () => void;
  isOpen: boolean;
};

export default function SubscriptionPlanRateModal({
  isOpen,
  onClose,
  planId,
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
  } = useForm<SubscriptionPlanFormData>({
    resolver: zodResolver(
      isCreate ? createSubscriptionPlanSchema : updateSubscriptionPlanSchema
    ) as any,
    defaultValues: {
      name: "",
      durationDays: 0,
      price: 0,
      description: "",
      status: SubscriptionPlanStatus.PUBLIC,
    },
    mode: "onChange",
  });

  // Fetch exchange-rate data for edit mode
  useEffect(() => {
    const fetctSubscriptionPlanData = async () => {
      if (!planId || !isOpen || isCreate) return;

      try {
        const resultAction = await dispatch(
          fetchSubscriptionPlanByIdService(planId)
        );

        if (fetchSubscriptionPlanByIdService.fulfilled.match(resultAction)) {
          const resposne = resultAction.payload;

          reset({
            id: resposne.id,
            name: resposne.name,
            durationDays: resposne.durationDays,
            price: resposne.price,
            description: resposne.description,
            status: resposne.status,
          });
        }
      } catch (error) {
        console.error("Error fetching ex data:", error);
      }
    };

    fetctSubscriptionPlanData();
  }, [planId, isOpen, isCreate, reset, dispatch]);

  // Reset form for create mode
  useEffect(() => {
    if (isOpen && isCreate) {
      reset({
        name: "",
        durationDays: 0,
        price: 0,
        description: "",
        status: SubscriptionPlanStatus.PUBLIC,
      });
    }
  }, [isOpen, isCreate, reset]);

  // Clear errors when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      dispatch(clearError());
    }
  }, [isOpen, dispatch]);

  const onSubmit = async (data: SubscriptionPlanFormData) => {
    try {
      if (isCreate) {
        const payload: CreateSubscriptionPlanRequest = {
          name: data.name!,
          durationDays: data.durationDays!,
          price: data.price!,
          description: data?.description,
          status: data.status!,
        };

        const result = await dispatch(
          createSubscriptionPlanService(payload)
        ).unwrap();

        showToast.success(
          `Subscription Plan "${
            result.name || result.email
          }" created successfully`
        );

        handleClose();
      } else {
        const payload: UpdateSubscriptionPlanRequest = {
          name: data.name!,
          durationDays: data.durationDays!,
          price: data.price!,
          description: data?.description,
          status: data.status!,
        };

        const result = await dispatch(
          updateSubscriptionPlanService({
            subscriptionPlanId: data.id!,
            subscriptionPlanData: payload,
          })
        ).unwrap();

        showToast.success(
          `Subscription Plan "${
            result.fullName || result.email
          }" updated successfully`
        );

        handleClose();
      }
    } catch (error: any) {
      console.error("Error saving Subscription Plan:", error);
      showToast.error(error || "Failed to save Subscription Plan");
    }
  };

  const handleClose = () => {
    reset();
    dispatch(clearError());
    dispatch(clearSelectedSubscriptionPlan());
    onClose();
  };

  const isSubmitting = isCreate ? isCreating : isUpdating;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] p-0 flex flex-col">
        {/* Header */}
        <FormHeader
          title={
            isCreate ? "Create Subscription Plan" : "Edit Subscription Plan"
          }
          description={
            isCreate
              ? "Add a new Subscription Plan to the system"
              : "Update Subscription Plan  information"
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
                  label="Plan Name"
                  placeholder="Enter Plan Name"
                  disabled={isSubmitting}
                  required
                  error={getFieldError(errors.name)}
                />

                <TextField
                  control={control}
                  name="durationDays"
                  label="Duration Days"
                  placeholder="Enter Duration Days"
                  disabled={isSubmitting}
                  required
                  error={getFieldError(errors.durationDays)}
                />

                <TextField
                  control={control}
                  name="price"
                  label="Price"
                  placeholder="Enter Price"
                  disabled={isSubmitting}
                  required
                  error={getFieldError(errors.price)}
                />

                <SelectField
                  control={control}
                  name="status"
                  label="Subscription Plan Status"
                  placeholder="Select Plan status"
                  options={SUBSCRIPTION_PLAN_CREATE_UPDATE}
                  required
                  disabled={isSubmitting}
                  error={getFieldError(errors.status)}
                />
              </div>

              {/* Description - Separate Row */}
              <TextareaField
                control={control}
                name="description"
                label="Description"
                placeholder="Enter any additional description (optional)"
                rows={5}
                disabled={isSubmitting}
                error={getFieldError(errors.description)}
              />
            </FormBody>

            {/* Footer */}
            <FormFooter
              isSubmitting={isSubmitting}
              isDirty={isDirty}
              isCreate={isCreate}
              createMessage="Creating plan..."
              updateMessage="Updating plan..."
            >
              <CancelButton onClick={handleClose} disabled={isSubmitting} />

              <SubmitButton
                isSubmitting={isSubmitting}
                isDirty={isDirty}
                isCreate={isCreate}
                createText="Create plan"
                updateText="Update plan"
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
