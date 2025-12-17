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
  createProvinceSchema,
  ProvinceFormData,
  updateProvinceSchema,
} from "../store/models/schema/province-schema";
import {
  createProvinceService,
  fetchProvinceByIdService,
  updateProvinceService,
} from "../store/thunks/province-thunks";
import {
  clearError,
  clearSelectedProvince,
} from "../store/slice/province-slice";
import {
  CreateProvinceRequest,
  UpdateProvinceRequest,
} from "../store/models/request/province-request";
import {
  selectError,
  selectIsFetchingDetail,
  selectOperations,
} from "../store/selectors/province-selector";

type Props = {
  mode: ModalMode;
  provinceId?: string;
  onClose: () => void;
  isOpen: boolean;
};

export default function ProvinceModal({
  isOpen,
  onClose,
  provinceId,
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
  } = useForm<ProvinceFormData>({
    resolver: zodResolver(
      isCreate ? createProvinceSchema : updateProvinceSchema
    ) as any,
    defaultValues: {
      provinceCode: "",
      provinceEn: "",
      provinceKh: "",
    },
    mode: "onChange",
  });

  // Fetch province data for edit mode
  useEffect(() => {
    const fetctProvinceData = async () => {
      if (!provinceId || !isOpen || isCreate) return;

      try {
        const resultAction = await dispatch(
          fetchProvinceByIdService(provinceId)
        );

        if (fetchProvinceByIdService.fulfilled.match(resultAction)) {
          const resposne = resultAction.payload;

          reset({
            id: resposne.id,
            provinceCode: resposne.provinceCode,
            provinceEn: resposne.provinceEn,
            provinceKh: resposne.provinceKh,
          });
        }
      } catch (error) {
        console.error("Error fetching privince data:", error);
      }
    };

    fetctProvinceData();
  }, [provinceId, isOpen, isCreate, reset, dispatch]);

  // Reset form for create mode
  useEffect(() => {
    if (isOpen && isCreate) {
      reset({
        provinceCode: "",
        provinceEn: "",
        provinceKh: "",
      });
    }
  }, [isOpen, isCreate, reset]);

  // Clear errors when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      dispatch(clearError());
    }
  }, [isOpen, dispatch]);

  const onSubmit = async (data: ProvinceFormData) => {
    try {
      if (isCreate) {
        const payload: CreateProvinceRequest = {
          provinceCode: data.provinceCode,
          provinceEn: data.provinceEn,
          provinceKh: data.provinceKh,
        };

        const result = await dispatch(createProvinceService(payload)).unwrap();

        showToast.success(
          `Province "${result.provinceEn}" created successfully`
        );

        handleClose();
      } else {
        const payload: UpdateProvinceRequest = {
          provinceCode: data.provinceCode,
          provinceEn: data.provinceEn,
          provinceKh: data.provinceKh,
        };

        const result = await dispatch(
          updateProvinceService({ provinceId: data.id!, provinceData: payload })
        ).unwrap();

        showToast.success(
          `Province "${result.provinceEn}" updated successfully`
        );

        handleClose();
      }
    } catch (error: any) {
      console.error("Error saving province:", error);
      showToast.error(error || "Failed to save province");
    }
  };

  const handleClose = () => {
    reset();
    dispatch(clearError());
    dispatch(clearSelectedProvince());
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
              ? "Create New province"
              : "Update province information below"
          }
          description={
            isCreate
              ? "Fill out the form to create a new province"
              : "Update province information below"
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
                  name="provinceCode"
                  label="Province Code"
                  placeholder="Enter Province Code"
                  disabled={isSubmitting}
                  required
                  error={getFieldError(errors.provinceCode)}
                />

                <TextField
                  control={control}
                  name="provinceEn"
                  label="Province EN"
                  placeholder="Enter Province EN"
                  disabled={isSubmitting}
                  required
                  error={getFieldError(errors.provinceEn)}
                />

                <TextField
                  control={control}
                  name="provinceKh"
                  label="Province KH"
                  placeholder="Enter Province KH"
                  disabled={isSubmitting}
                  required
                  error={getFieldError(errors.provinceKh)}
                />
              </div>
            </FormBody>

            {/* Footer */}
            <FormFooter
              isSubmitting={isSubmitting}
              isDirty={isDirty}
              isCreate={isCreate}
              createMessage="Creating province..."
              updateMessage="Updating province..."
            >
              <CancelButton onClick={handleClose} disabled={isSubmitting} />

              <SubmitButton
                isSubmitting={isSubmitting}
                isDirty={isDirty}
                isCreate={isCreate}
                createText="Create province"
                updateText="Update province"
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
