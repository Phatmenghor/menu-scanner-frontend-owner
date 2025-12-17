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
} from "../store/selectors/commune-selector";
import {
  createCommuneService,
  fetchCommuneByIdService,
  updateCommuneService,
} from "../store/thunks/commune-thunks";
import {
  CommuneFormData,
  createCommuneSchema,
  updateCommuneSchema,
} from "../store/models/schema/commune-schema";
import {
  CreateCommuneRequest,
  UpdateCommuneRequest,
} from "../store/models/request/commune-request";
import { clearError, clearSelectedCommune } from "../store/slice/commune-slice";

type Props = {
  mode: ModalMode;
  communeId?: string;
  onClose: () => void;
  isOpen: boolean;
};

export default function CommuneModal({
  isOpen,
  onClose,
  communeId,
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
  } = useForm<CommuneFormData>({
    resolver: zodResolver(
      isCreate ? createCommuneSchema : updateCommuneSchema
    ) as any,
    defaultValues: {
      communeCode: "",
      communeEn: "",
      communeKh: "",
      districtCode: "",
    },
    mode: "onChange",
  });

  // Fetch business data for edit mode
  useEffect(() => {
    const fetchUserData = async () => {
      if (!communeId || !isOpen || isCreate) return;

      try {
        const resultAction = await dispatch(fetchCommuneByIdService(communeId));

        if (fetchCommuneByIdService.fulfilled.match(resultAction)) {
          const resposne = resultAction.payload;

          reset({
            id: resposne.id,
            communeCode: resposne.communeCode,
            communeEn: resposne.communeEn,
            communeKh: resposne.communeKh,
            districtCode: resposne.districtCode,
          });
        }
      } catch (error) {
        console.error("Error fetching commune data:", error);
      }
    };

    fetchUserData();
  }, [communeId, isOpen, isCreate, reset, dispatch]);

  // Reset form for create mode
  useEffect(() => {
    if (isOpen && isCreate) {
      reset({
        communeCode: "",
        communeEn: "",
        communeKh: "",
        districtCode: "",
      });
    }
  }, [isOpen, isCreate, reset]);

  // Clear errors when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      dispatch(clearError());
    }
  }, [isOpen, dispatch]);

  const onSubmit = async (data: CommuneFormData) => {
    try {
      if (isCreate) {
        const payload: CreateCommuneRequest = {
          communeCode: data.communeCode,
          communeEn: data.communeEn,
          communeKh: data.communeKh,
          districtCode: data.districtCode,
        };

        const result = await dispatch(createCommuneService(payload)).unwrap();

        showToast.success(
          `Commune "${result.provinceEn}" created successfully`
        );

        handleClose();
      } else {
        const payload: UpdateCommuneRequest = {
          communeCode: data.communeCode,
          communeEn: data.communeEn,
          communeKh: data.communeKh,
          districtCode: data.districtCode,
        };

        const result = await dispatch(
          updateCommuneService({ communeId: data.id!, communeData: payload })
        ).unwrap();

        showToast.success(
          `Commune "${result.provinceEn}" updated successfully`
        );

        handleClose();
      }
    } catch (error: any) {
      console.error("Error saving commune:", error);
      showToast.error(error || "Failed to save commune");
    }
  };

  const handleClose = () => {
    reset();
    dispatch(clearError());
    dispatch(clearSelectedCommune());
    onClose();
  };

  const isSubmitting = isCreate ? isCreating : isUpdating;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] p-0 flex flex-col">
        {/* Header */}
        <FormHeader
          title={
            isCreate ? "Create New Commune" : "Update Commune information below"
          }
          description={
            isCreate
              ? "Fill out the form to create a new Commune"
              : "Update Commune information below"
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
                  name="communeCode"
                  label="Commune Code"
                  placeholder="Enter Commune Code"
                  disabled={isSubmitting}
                  required
                  error={getFieldError(errors.communeCode)}
                />

                <TextField
                  control={control}
                  name="communeEn"
                  label="Commune EN"
                  placeholder="Enter Commune EN"
                  disabled={isSubmitting}
                  required
                  error={getFieldError(errors.communeEn)}
                />

                <TextField
                  control={control}
                  name="communeKh"
                  label="Commune KH"
                  placeholder="Enter Commune KH"
                  disabled={isSubmitting}
                  required
                  error={getFieldError(errors.communeKh)}
                />

                <TextField
                  control={control}
                  name="districtCode"
                  label="District Code"
                  placeholder="Enter District Code"
                  disabled={isSubmitting}
                  required
                  error={getFieldError(errors.districtCode)}
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
