"use client";

import React, { useEffect, useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ModalMode } from "@/constants/app-resource/status/status";
import { SUBSCRIPTION_CREATE_UPDATE } from "@/constants/app-resource/status/create-update-status";
import Loading from "@/components/shared/common/loading";
import { SelectField } from "@/components/shared/form-field/select-field";
import { DatePickerField } from "@/components/shared/form-field/date-picker-field";
import { CancelButton } from "@/components/shared/form-field/cancel-button";
import { SubmitButton } from "@/components/shared/form-field/submid-button";
import { FormHeader } from "@/components/shared/form-field/form-header";
import { FormBody } from "@/components/shared/form-field/form-body";
import { FormFooter } from "@/components/shared/form-field/form-footer";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import {
  clearError,
  clearSelectedBusiness,
} from "../store/slice/business-slice";
import { showToast } from "@/components/shared/common/show-toast";
import {
  createSubscriptionSchema,
  SubscriptionFormData,
  updateSubscriptionSchema,
} from "../store/models/schema/subscription-schema";
import {
  createSubscriptionService,
  fetchSubscriptionByIdService,
  updateSubscriptionService,
} from "../store/thunks/subscription-thunks";
import {
  CreateSubscriptionRequest,
  UpdateSubscriptionRequest,
} from "../store/models/request/subscription-request";
import { SubscriptionPlanResponseModel } from "@/redux/features/master-data/store/models/response/subscription-plan-response";
import { ComboboxSelectBusiness } from "@/components/shared/combo-box/combobox-business";
import { ComboboxSelectSubscriptionPlan } from "@/components/shared/combo-box/combobox-plan";
import {
  selectError,
  selectIsFetchingDetail,
  selectOperations,
} from "../store/selectors/subscription-selector";
import { BusinessResponseModel } from "../store/models/response/business-response";

type Props = {
  mode: ModalMode;
  subscriptionId?: string;
  onClose: () => void;
  isOpen: boolean;
};

export default function SubscriptionModal({
  isOpen,
  onClose,
  subscriptionId,
  mode,
}: Props) {
  const isCreate = mode === ModalMode.CREATE_MODE;

  const dispatch = useAppDispatch();

  // Get operations state from Redux
  const operations = useAppSelector(selectOperations);
  const isFetchingDetail = useAppSelector(selectIsFetchingDetail);
  const reduxError = useAppSelector(selectError);
  const { isCreating, isUpdating } = operations;

  // Local state for selected items
  const [selectedBusiness, setSelectedBusiness] =
    useState<BusinessResponseModel | null>(null);
  const [selectedPlan, setSelectedPlan] =
    useState<SubscriptionPlanResponseModel | null>(null);

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isDirty },
  } = useForm<SubscriptionFormData>({
    resolver: zodResolver(
      isCreate ? createSubscriptionSchema : updateSubscriptionSchema
    ) as any,
    defaultValues: {
      businessId: "",
      planId: "",
      startDate: "",
      endDate: "",
      autoRenew: "true",
    },
    mode: "onChange",
  });

  // Fetch Subscription data for edit mode
  useEffect(() => {
    const fetchSubscriptionData = async () => {
      if (!subscriptionId || !isOpen || isCreate) return;

      try {
        const resultAction = await dispatch(
          fetchSubscriptionByIdService(subscriptionId)
        );

        if (fetchSubscriptionByIdService.fulfilled.match(resultAction)) {
          const response = resultAction.payload;

          reset({
            id: response.id,
            businessId: response.businessId,
            planId: response.planId,
            autoRenew: response.autoRenew.toString(),
            startDate: response.startDate,
            endDate: response.endDate,
          });

          if (response.businessId && response.businessName) {
            setSelectedBusiness({
              id: response.businessId,
              name: response?.businessName || "",
            } as BusinessResponseModel);
          }

          if (response.planId) {
            setSelectedPlan({
              id: response.planId,
              name: response?.planName || "",
            } as SubscriptionPlanResponseModel);
          }
        }
      } catch (error) {
        console.error("Error fetching subscription data:", error);
      }
    };

    fetchSubscriptionData();
  }, [subscriptionId, isOpen, isCreate, reset, dispatch]);

  // Reset form for create mode
  useEffect(() => {
    if (isOpen && isCreate) {
      reset({
        businessId: "",
        planId: "",
        startDate: "",
        endDate: "",
        autoRenew: "true",
      });
      setSelectedBusiness(null);
      setSelectedPlan(null);
    }
  }, [isOpen, isCreate, reset]);

  // Clear errors when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      dispatch(clearError());
    }
  }, [isOpen, dispatch]);

  const onSubmit = async (data: SubscriptionFormData) => {
    try {
      if (isCreate) {
        const payload: CreateSubscriptionRequest = {
          businessId: data.businessId,
          planId: data.planId,
          autoRenew: data.autoRenew === "true",
          startDate: data.startDate,
        };

        const result = await dispatch(
          createSubscriptionService(payload)
        ).unwrap();

        showToast.success(
          `Subscription "${
            result.businessName || result.planName
          }" created successfully`
        );

        handleClose();
      } else {
        const payload: UpdateSubscriptionRequest = {
          planId: data.planId,
          autoRenew: data.autoRenew === "true",
          startDate: data.startDate,
          endDate: data.endDate,
        };

        const result = await dispatch(
          updateSubscriptionService({
            subscriptionId: data.id!,
            subscriptionsData: payload,
          })
        ).unwrap();

        showToast.success(
          `Subscription "${
            result.businessName || result.planName
          }" updated successfully`
        );

        handleClose();
      }
    } catch (error: any) {
      console.error("Error saving subscription:", error);
      showToast.error(error || "Failed to save subscription");
    }
  };

  const handleClose = () => {
    reset();
    setSelectedBusiness(null);
    setSelectedPlan(null);
    dispatch(clearError());
    dispatch(clearSelectedBusiness());
    onClose();
  };

  const isSubmitting = isCreate ? isCreating : isUpdating;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] p-0 flex flex-col">
        {/* Header */}
        <FormHeader
          title={
            isCreate
              ? "Create New Subscription"
              : "Update Subscription Information"
          }
          description={
            isCreate
              ? "Fill out the form to create a new subscription"
              : "Update subscription information below"
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
                {/* Business Selection - Combobox */}
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
                      required
                      disabled={isSubmitting || !isCreate}
                      showAllOption={false}
                      error={errors.businessId?.message}
                    />
                  )}
                />

                {/* Plan Selection - Combobox */}
                <Controller
                  control={control}
                  name="planId"
                  render={({ field }) => (
                    <ComboboxSelectSubscriptionPlan
                      dataSelect={selectedPlan}
                      onChangeSelected={(plan) => {
                        setSelectedPlan(plan);
                        field.onChange(plan?.id || "");
                      }}
                      label="Subscription Plan"
                      placeholder="Select a plan..."
                      required
                      disabled={isSubmitting}
                      showAllOption={false}
                      error={errors.planId?.message}
                    />
                  )}
                />

                {/* Start Date - DatePickerField */}
                <DatePickerField
                  control={control}
                  name="startDate"
                  label="Start Date"
                  placeholder="Select start date"
                  required
                  disabled={isSubmitting}
                  error={errors.startDate}
                />

                {/* End Date - DatePickerField */}
                {!isCreate && (
                  <DatePickerField
                    control={control}
                    name="endDate"
                    label="End Date"
                    placeholder="Select end date"
                    disabled={isSubmitting}
                    error={errors.endDate}
                  />
                )}

                {/* Auto Renew Status - SelectField */}
                <SelectField
                  control={control}
                  name="autoRenew"
                  label="Auto Renew"
                  placeholder="Select auto renew status"
                  options={SUBSCRIPTION_CREATE_UPDATE}
                  required
                  disabled={isSubmitting}
                  error={errors.autoRenew}
                />
              </div>
            </FormBody>

            {/* Footer */}
            <FormFooter
              isSubmitting={isSubmitting}
              isDirty={isDirty}
              isCreate={isCreate}
              createMessage="Creating subscription..."
              updateMessage="Updating subscription..."
            >
              <CancelButton onClick={handleClose} disabled={isSubmitting} />

              <SubmitButton
                isSubmitting={isSubmitting}
                isDirty={isDirty}
                isCreate={isCreate}
                createText="Create Subscription"
                updateText="Update Subscription"
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
