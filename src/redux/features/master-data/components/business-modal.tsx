"use client";

import React, { useEffect } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ModalMode,
  BusinessStatus,
} from "@/constants/app-resource/status/status";
import { BUSINESS_STATUS_CREATE_UPDATE } from "@/constants/app-resource/status/create-update-status";
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
import {
  selectError,
  selectIsFetchingDetail,
  selectOperations,
} from "../store/selectors/business-selector";
import {
  BusinessFormData,
  createBusinessSchema,
  updateBusinessSchema,
} from "../store/models/schema/business-schema";
import {
  createBusinessService,
  fetchBusinessByIdService,
  updateBusinessService,
} from "../store/thunks/business-thunks";
import {
  clearError,
  clearSelectedBusiness,
} from "../store/slice/business-slice";
import {
  CreateBusinessRequest,
  UpdateBusinessRequest,
} from "../store/models/request/business-request";
import { showToast } from "@/components/shared/common/show-toast";
import { getFieldError } from "@/utils/common/get-field-error";

type Props = {
  mode: ModalMode;
  businessId?: string;
  onClose: () => void;
  isOpen: boolean;
};

export default function BusinessModal({
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
  } = useForm<BusinessFormData>({
    resolver: zodResolver(
      isCreate ? createBusinessSchema : updateBusinessSchema
    ) as any,
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      status: BusinessStatus.ACTIVE,
      address: "",
      description: "",
    },
    mode: "onChange",
  });

  // Fetch business data for edit mode
  useEffect(() => {
    const fetchUserData = async () => {
      if (!businessId || !isOpen || isCreate) return;

      try {
        const resultAction = await dispatch(
          fetchBusinessByIdService(businessId)
        );

        if (fetchBusinessByIdService.fulfilled.match(resultAction)) {
          const resposne = resultAction.payload;

          reset({
            id: resposne.id,
            name: resposne.name,
            email: resposne.email,
            phone: resposne.phone,
            status: resposne.status,
            address: resposne.address,
            description: resposne.description,
          });
        }
      } catch (error) {
        console.error("Error fetching business data:", error);
      }
    };

    fetchUserData();
  }, [businessId, isOpen, isCreate, reset, dispatch]);

  // Reset form for create mode
  useEffect(() => {
    if (isOpen && isCreate) {
      reset({
        name: "",
        email: "",
        phone: "",
        status: BusinessStatus.ACTIVE,
        address: "",
        description: "",
      });
    }
  }, [isOpen, isCreate, reset]);

  // Clear errors when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      dispatch(clearError());
    }
  }, [isOpen, dispatch]);

  const onSubmit = async (data: BusinessFormData) => {
    try {
      if (isCreate) {
        const payload: CreateBusinessRequest = {
          name: data.name!,
          email: data.email,
          phone: data.phone,
          status: data.status!,
          address: data.address!,
          description: data.description,
        };

        const result = await dispatch(createBusinessService(payload)).unwrap();

        showToast.success(
          `Business "${result.name || result.email}" created successfully`
        );

        handleClose();
      } else {
        const payload: UpdateBusinessRequest = {
          name: data.name!,
          email: data.email,
          phone: data.phone,
          status: data.status!,
          address: data.address!,
          description: data.description,
        };

        const result = await dispatch(
          updateBusinessService({ businessId: data.id!, businessData: payload })
        ).unwrap();

        showToast.success(
          `Business "${result.fullName || result.email}" updated successfully`
        );

        handleClose();
      }
    } catch (error: any) {
      console.error("Error saving business:", error);
      showToast.error(error || "Failed to save business");
    }
  };

  const handleClose = () => {
    reset();
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
              ? "Create New business"
              : "Update business information below"
          }
          description={
            isCreate
              ? "Fill out the form to create a new business"
              : "Update business information below"
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
                  required
                  error={getFieldError(errors.name)}
                />

                <TextField
                  control={control}
                  name="email"
                  label="Email"
                  type="email"
                  placeholder="Enter email address"
                  disabled={isSubmitting}
                  required
                  error={getFieldError(errors.email)}
                />

                <TextField
                  control={control}
                  name="phone"
                  label="Phnoe Number"
                  placeholder="Enter phone number"
                  disabled={isSubmitting}
                  required
                  error={getFieldError(errors.phone)}
                />

                <TextField
                  control={control}
                  name="address"
                  label="Address"
                  placeholder="Enter address"
                  disabled={isSubmitting}
                  error={getFieldError(errors.address)}
                />

                <SelectField
                  control={control}
                  name="status"
                  label="Business Status"
                  placeholder="Select business status"
                  options={BUSINESS_STATUS_CREATE_UPDATE}
                  required
                  disabled={isSubmitting}
                  error={getFieldError(errors.status)}
                />
              </div>

              {/* Notes - Separate Row */}
              <TextareaField
                control={control}
                name="description"
                label="Remark"
                placeholder="Enter any additional remark (optional)"
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
