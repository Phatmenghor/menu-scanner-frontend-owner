"use client";

import React, { useEffect } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ModalMode } from "@/constants/app-resource/status/status";
import Loading from "@/components/shared/common/loading";
import { TextField } from "@/components/shared/form-field/text-field";
import { CancelButton } from "@/components/shared/form-field/cancel-button";
import { SubmitButton } from "@/components/shared/form-field/submid-button";
import { FormHeader } from "@/components/shared/form-field/form-header";
import { FormBody } from "@/components/shared/form-field/form-body";
import { FormFooter } from "@/components/shared/form-field/form-footer";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import { showToast } from "@/components/shared/common/show-toast";
import { getFieldError } from "@/utils/common/get-field-error";
import {
  selectError,
  selectIsFetchingDetail,
  selectOperations,
} from "../store/selectors/district-selector";
import {
  createDistrictService,
  fetchDistrictByIdService,
  updateDistrictService,
} from "../store/thunks/district-thunks";
import {
  createDistrictSchema,
  DistrictFormData,
  updateDistrictSchema,
} from "../store/models/schema/district-schema";
import {
  CreateDistrictRequest,
  UpdateDistrictRequest,
} from "../store/models/request/district-request";
import {
  clearError,
  clearSelectedDistrict,
} from "../store/slice/district-slice";

type Props = {
  mode: ModalMode;
  districtId?: string;
  onClose: () => void;
  isOpen: boolean;
};

export default function DistrictModal({
  isOpen,
  onClose,
  districtId,
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
  } = useForm<DistrictFormData>({
    resolver: zodResolver(
      isCreate ? createDistrictSchema : updateDistrictSchema
    ) as any,
    defaultValues: {
      districtCode: "",
      districtEn: "",
      districtKh: "",
      provinceCode: "",
    },
    mode: "onChange",
  });

  // Fetch business data for edit mode
  useEffect(() => {
    const fetchUserData = async () => {
      if (!districtId || !isOpen || isCreate) return;

      try {
        const resultAction = await dispatch(
          fetchDistrictByIdService(districtId)
        );

        if (fetchDistrictByIdService.fulfilled.match(resultAction)) {
          const resposne = resultAction.payload;

          reset({
            id: resposne.id,
            districtCode: resposne.districtCode,
            districtEn: resposne.districtEn,
            districtKh: resposne.districtKh,
            provinceCode: resposne.provinceCode,
          });
        }
      } catch (error) {
        console.error("Error fetching district data:", error);
      }
    };

    fetchUserData();
  }, [districtId, isOpen, isCreate, reset, dispatch]);

  // Reset form for create mode
  useEffect(() => {
    if (isOpen && isCreate) {
      reset({
        districtCode: "",
        districtEn: "",
        districtKh: "",
        provinceCode: "",
      });
    }
  }, [isOpen, isCreate, reset]);

  // Clear errors when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      dispatch(clearError());
    }
  }, [isOpen, dispatch]);

  const onSubmit = async (data: DistrictFormData) => {
    try {
      if (isCreate) {
        const payload: CreateDistrictRequest = {
          districtCode: data.districtCode,
          districtEn: data.districtEn,
          districtKh: data.districtKh,
          provinceCode: data.provinceCode,
        };

        const result = await dispatch(createDistrictService(payload)).unwrap();

        showToast.success(
          `District "${result.provinceEn}" created successfully`
        );

        handleClose();
      } else {
        const payload: UpdateDistrictRequest = {
          districtCode: data.districtCode,
          districtEn: data.districtEn,
          districtKh: data.districtKh,
          provinceCode: data.provinceCode,
        };

        const result = await dispatch(
          updateDistrictService({ districtId: data.id!, districtData: payload })
        ).unwrap();

        showToast.success(
          `District "${result.provinceEn}" updated successfully`
        );

        handleClose();
      }
    } catch (error: any) {
      console.error("Error saving district:", error);
      showToast.error(error || "Failed to save district");
    }
  };

  const handleClose = () => {
    reset();
    dispatch(clearError());
    dispatch(clearSelectedDistrict());
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
              ? "Create New District"
              : "Update District information below"
          }
          description={
            isCreate
              ? "Fill out the form to create a new District"
              : "Update District information below"
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
                  name="districtCode"
                  label="District Code"
                  placeholder="Enter District Code"
                  disabled={isSubmitting}
                  required
                  error={getFieldError(errors.districtCode)}
                />

                <TextField
                  control={control}
                  name="districtEn"
                  label="District EN"
                  placeholder="Enter District EN"
                  disabled={isSubmitting}
                  required
                  error={getFieldError(errors.districtEn)}
                />

                <TextField
                  control={control}
                  name="districtKh"
                  label="District KH"
                  placeholder="Enter District KH"
                  disabled={isSubmitting}
                  required
                  error={getFieldError(errors.districtKh)}
                />

                <TextField
                  control={control}
                  name="provinceCode"
                  label="Province Code"
                  placeholder="Enter Province Code"
                  disabled={isSubmitting}
                  required
                  error={getFieldError(errors.provinceCode)}
                />
              </div>
            </FormBody>

            {/* Footer */}
            <FormFooter
              isSubmitting={isSubmitting}
              isDirty={isDirty}
              isCreate={isCreate}
              createMessage="Creating district..."
              updateMessage="Updating district..."
            >
              <CancelButton onClick={handleClose} disabled={isSubmitting} />

              <SubmitButton
                isSubmitting={isSubmitting}
                isDirty={isDirty}
                isCreate={isCreate}
                createText="Create district"
                updateText="Update district"
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
