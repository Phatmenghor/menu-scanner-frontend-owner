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
  createVillageService,
  fetchVillageByIdService,
  updateVillageService,
} from "../store/thunks/village-thunks";
import {
  createVillageSchema,
  updateVillageSchema,
  VillageFormData,
} from "../store/models/schema/village-schema";
import {
  CreateVillageRequest,
  UpdateVillageRequest,
} from "../store/models/request/village-request";
import { clearError, clearSelectedVillage } from "../store/slice/village-slice";
import {
  selectError,
  selectIsFetchingDetail,
  selectOperations,
} from "../store/selectors/vaillage-selector";

type Props = {
  mode: ModalMode;
  villageId?: string;
  onClose: () => void;
  isOpen: boolean;
};

export default function VillageModal({
  isOpen,
  onClose,
  villageId,
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
  } = useForm<VillageFormData>({
    resolver: zodResolver(
      isCreate ? createVillageSchema : updateVillageSchema
    ) as any,
    defaultValues: {
      villageCode: "",
      villageEn: "",
      villageKh: "",
      communeCode: "",
    },
    mode: "onChange",
  });

  // Fetch business data for edit mode
  useEffect(() => {
    const fetchVillageData = async () => {
      if (!villageId || !isOpen || isCreate) return;

      try {
        const resultAction = await dispatch(fetchVillageByIdService(villageId));

        if (fetchVillageByIdService.fulfilled.match(resultAction)) {
          const resposne = resultAction.payload;

          reset({
            id: resposne.id,
            communeCode: resposne.communeCode,
            villageCode: resposne.villageCode,
            villageEn: resposne.villageEn,
            villageKh: resposne.villageKh,
          });
        }
      } catch (error) {
        console.error("Error fetching village data:", error);
      }
    };

    fetchVillageData();
  }, [villageId, isOpen, isCreate, reset, dispatch]);

  // Reset form for create mode
  useEffect(() => {
    if (isOpen && isCreate) {
      reset({
        villageCode: "",
        villageEn: "",
        villageKh: "",
        communeCode: "",
      });
    }
  }, [isOpen, isCreate, reset]);

  // Clear errors when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      dispatch(clearError());
    }
  }, [isOpen, dispatch]);

  const onSubmit = async (data: VillageFormData) => {
    try {
      if (isCreate) {
        const payload: CreateVillageRequest = {
          communeCode: data.communeCode,
          villageCode: data.villageCode,
          villageEn: data.villageEn,
          villageKh: data.villageKh,
        };

        const result = await dispatch(createVillageService(payload)).unwrap();

        showToast.success(
          `Village "${result.provinceEn}" created successfully`
        );

        handleClose();
      } else {
        const payload: UpdateVillageRequest = {
          communeCode: data.communeCode,
          villageCode: data.villageCode,
          villageEn: data.villageEn,
          villageKh: data.villageKh,
        };

        const result = await dispatch(
          updateVillageService({ villageId: data.id!, villageData: payload })
        ).unwrap();

        showToast.success(
          `Village "${result.provinceEn}" updated successfully`
        );

        handleClose();
      }
    } catch (error: any) {
      console.error("Error saving village:", error);
      showToast.error(error || "Failed to save village");
    }
  };

  const handleClose = () => {
    reset();
    dispatch(clearError());
    dispatch(clearSelectedVillage());
    onClose();
  };

  const isSubmitting = isCreate ? isCreating : isUpdating;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] p-0 flex flex-col">
        {/* Header */}
        <FormHeader
          title={
            isCreate ? "Create New village" : "Update village information below"
          }
          description={
            isCreate
              ? "Fill out the form to create a new village"
              : "Update village information below"
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
                  name="villageCode"
                  label="Village Code"
                  placeholder="Enter Village Code"
                  disabled={isSubmitting}
                  required
                  error={getFieldError(errors.villageCode)}
                />

                <TextField
                  control={control}
                  name="villageEn"
                  label="Village EN"
                  placeholder="Enter Village EN"
                  disabled={isSubmitting}
                  required
                  error={getFieldError(errors.villageEn)}
                />

                <TextField
                  control={control}
                  name="villageKh"
                  label="Village KH"
                  placeholder="Enter Village KH"
                  disabled={isSubmitting}
                  required
                  error={getFieldError(errors.villageKh)}
                />

                <TextField
                  control={control}
                  name="communeCode"
                  label="Commune KH"
                  placeholder="Enter Commune KH"
                  disabled={isSubmitting}
                  required
                  error={getFieldError(errors.communeCode)}
                />
              </div>
            </FormBody>

            {/* Footer */}
            <FormFooter
              isSubmitting={isSubmitting}
              isDirty={isDirty}
              isCreate={isCreate}
              createMessage="Creating village..."
              updateMessage="Updating village..."
            >
              <CancelButton onClick={handleClose} disabled={isSubmitting} />

              <SubmitButton
                isSubmitting={isSubmitting}
                isDirty={isDirty}
                isCreate={isCreate}
                createText="Create village"
                updateText="Update village"
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
