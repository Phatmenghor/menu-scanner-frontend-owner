"use client";

import React, { useEffect, useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ModalMode } from "@/constants/AppResource/status/status";
import Loading from "@/components/shared/common/loading";
import { TextField } from "@/components/shared/form-field/text-field";
import { SelectField } from "@/components/shared/form-field/select-field";
import { CancelButton } from "@/components/shared/form-field/cancel-button";
import { SubmitButton } from "@/components/shared/form-field/submid-button";
import { FormHeader } from "@/components/shared/form-field/form-header";
import { FormBody } from "@/components/shared/form-field/form-body";
import { FormFooter } from "@/components/shared/form-field/form-footer";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import {
  selectError,
  selectIsFetchingDetail,
  selectOperations,
} from "../store/selectors/business-selector";
import {
  clearError,
  clearSelectedBusiness,
} from "../store/slice/business-slice";
import { showToast } from "@/components/shared/common/show-toast";
import { getFieldError } from "@/utils/common/get-field-error";
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
import { BusinessResponseModel } from "@/redux/features/master-data/store/models/response/business-response";

// Auto-renew status options
const AUTO_RENEW_OPTIONS = [
  { label: "Active", value: "true" },
  { label: "Inactive", value: "false" },
];

// Plan response model type (adjust according to your actual model)
interface PlanResponseModel {
  id: string;
  name: string;
  description?: string;
  price?: number;
  duration?: string;
}

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
  const [selectedPlan, setSelectedPlan] = useState<PlanResponseModel | null>(
    null
  );

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
      autoRenew: true,
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
            autoRenew: response.autoRenew,
            startDate: response.startDate,
            endDate: response.endDate,
          });

          if (response.business) {
            setSelectedBusiness(response.business);
          }
          if (response.plan) {
            setSelectedPlan(response.plan);
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
        autoRenew: true,
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
          autoRenew: data.autoRenew,
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
          autoRenew: data.autoRenew,
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
                      error={getFieldError(errors.businessId)}
                    />
                  )}
                />

                {/* Plan Selection - Combobox */}
                <Controller
                  control={control}
                  name="planId"
                  render={({ field }) => (
                    <ComboboxSelectPlan
                      dataSelect={selectedPlan}
                      onChangeSelected={(plan) => {
                        setSelectedPlan(plan);
                        field.onChange(plan?.id || "");
                      }}
                      label="Plan"
                      placeholder="Select a plan..."
                      required
                      disabled={isSubmitting}
                      error={getFieldError(errors.planId)}
                    />
                  )}
                />

                {/* Start Date */}
                <Controller
                  control={control}
                  name="startDate"
                  render={({ field }) => (
                    <div className="space-y-2">
                      <label className="text-[12px] font-normal text-gray-300">
                        Start Date
                        <span className="text-red-500 ml-1">*</span>
                      </label>
                      <CustomDatePicker
                        value={field.value}
                        onChange={field.onChange}
                        disabled={isSubmitting}
                        placeholder="Select start date"
                        error={!!errors.startDate}
                      />
                      {errors.startDate && (
                        <p className="text-xs text-red-500">
                          {getFieldError(errors.startDate)}
                        </p>
                      )}
                    </div>
                  )}
                />

                {/* End Date */}
                <Controller
                  control={control}
                  name="endDate"
                  render={({ field }) => (
                    <div className="space-y-2">
                      <label className="text-[12px] font-normal text-gray-300">
                        End Date
                      </label>
                      <CustomDatePicker
                        value={field.value}
                        onChange={field.onChange}
                        disabled={isSubmitting}
                        placeholder="Select end date"
                        error={!!errors.endDate}
                      />
                      {errors.endDate && (
                        <p className="text-xs text-red-500">
                          {getFieldError(errors.endDate)}
                        </p>
                      )}
                    </div>
                  )}
                />

                {/* Auto Renew Status - Select Field */}
                <Controller
                  control={control}
                  name="autoRenew"
                  render={({ field }) => (
                    <SelectField
                      control={control}
                      name="autoRenew"
                      label="Auto Renew"
                      placeholder="Select auto renew status"
                      options={AUTO_RENEW_OPTIONS}
                      required
                      disabled={isSubmitting}
                      error={getFieldError(errors.autoRenew)}
                      onChange={(value) => {
                        // Convert string "true"/"false" to boolean
                        field.onChange(value === "true");
                      }}
                      value={field.value?.toString() || "true"}
                    />
                  )}
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
