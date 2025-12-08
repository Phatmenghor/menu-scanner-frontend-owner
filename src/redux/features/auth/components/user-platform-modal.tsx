"use client";

import React, { useEffect, useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { UserPlus } from "lucide-react";
import {
  ModalMode,
  UserGropeType,
  AccountStatus,
} from "@/constants/AppResource/status/status";
import {
  ACCOUNT_STATUS_CREATE_UPDATE,
  USER_PLATFORM_ROLE_CREATE_UPDATE,
} from "@/constants/AppResource/status/create-update-status";
import Loading from "@/components/shared/common/loading";
import { TextField } from "@/components/shared/form-field/text-field";
import { TextareaField } from "@/components/shared/form-field/text-area-field";
import { SelectField } from "@/components/shared/form-field/select-field";
import { CancelButton } from "@/components/shared/form-field/cancel-button";
import { SubmitButton } from "@/components/shared/form-field/submid-button";
import { PasswordField } from "@/components/shared/form-field/password-field";
import {
  CreateUserRequest,
  UpdateUserRequest,
} from "../store/models/request/users-request";
import {
  createUserSchema,
  updateUserSchema,
  UserFormData,
} from "../store/models/schema/user.schema";
import {
  fetchUserByIdService,
  createUserService,
  updateUserService,
} from "../store/thunks/users-thunks";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import { showToast } from "@/components/shared/common/app-toast";
import { clearError, clearSelectedUser } from "../store/slice/users-slice";
import {
  selectError,
  selectOperations,
  selectSelectedUser,
  selectIsFetchingDetail,
} from "../store/selectors/users-selectors";
import { FormHeader } from "@/components/shared/form-field/form-header";
import { FormBody } from "@/components/shared/form-field/form-body";
import { FormFooter } from "@/components/shared/form-field/form-footer";

type Props = {
  mode: ModalMode;
  userId?: string;
  onClose: () => void;
  isOpen: boolean;
};

export default function UserPlatformModal({
  isOpen,
  onClose,
  userId,
  mode,
}: Props) {
  const isCreate = mode === ModalMode.CREATE_MODE;
  const [showPassword, setShowPassword] = useState(false);

  const dispatch = useAppDispatch();

  // Get operations state from Redux
  const operations = useAppSelector(selectOperations);
  const isFetchingDetail = useAppSelector(selectIsFetchingDetail);
  const reduxError = useAppSelector(selectError);
  const userData = useAppSelector(selectSelectedUser);
  const { isCreating, isUpdating } = operations;

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isDirty },
  } = useForm<UserFormData>({
    resolver: zodResolver(
      isCreate ? createUserSchema : updateUserSchema
    ) as any,
    defaultValues: {
      userIdentifier: "",
      email: "",
      firstName: "",
      lastName: "",
      phoneNumber: "",
      password: "",
      userType: UserGropeType.PLATFORM_USER,
      roles: [],
      accountStatus: AccountStatus.ACTIVE,
      position: "",
      address: "",
      notes: "",
    },
    mode: "onChange",
  });

  // Watch form values for avatar display
  const firstName = watch("firstName");
  const email = watch("email");

  // Fetch user data for edit mode
  useEffect(() => {
    const fetchUserData = async () => {
      if (!userId || !isOpen || isCreate) return;

      try {
        const resultAction = await dispatch(fetchUserByIdService(userId));

        if (fetchUserByIdService.fulfilled.match(resultAction)) {
          const data = resultAction.payload;

          reset({
            id: data.id,
            userIdentifier: data.userIdentifier,
            email: data.email,
            firstName: data.firstName,
            lastName: data.lastName,
            phoneNumber: data.phoneNumber,
            userType: data.userType,
            roles: data.roles,
            accountStatus: data.accountStatus,
            position: data.position || "",
            address: data.address || "",
            notes: data.notes || "",
          });
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, [userId, isOpen, isCreate, reset, dispatch]);

  // Reset form for create mode
  useEffect(() => {
    if (isOpen && isCreate) {
      reset({
        userIdentifier: "",
        email: "",
        firstName: "",
        lastName: "",
        phoneNumber: "",
        password: "",
        userType: UserGropeType.PLATFORM_USER,
        roles: [],
        accountStatus: AccountStatus.ACTIVE,
        position: "",
        address: "",
        notes: "",
      });
    }
  }, [isOpen, isCreate, reset]);

  // Clear errors when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      dispatch(clearError());
    }
  }, [isOpen, dispatch]);

  const onSubmit = async (data: UserFormData) => {
    try {
      if (isCreate) {
        const payload: CreateUserRequest = {
          userIdentifier: data.userIdentifier!,
          email: data.email!,
          password: data.password!,
          firstName: data.firstName!,
          lastName: data.lastName!,
          phoneNumber: data.phoneNumber!,
          userType: data.userType!,
          accountStatus: data.accountStatus!,
          roles: data.roles!,
          position: data.position || undefined,
          address: data.address || undefined,
          notes: data.notes || undefined,
        };

        const result = await dispatch(createUserService(payload)).unwrap();

        showToast.success(
          `User "${result.fullName || result.email}" created successfully`
        );

        handleClose();
      } else {
        const payload: UpdateUserRequest = {
          firstName: data.firstName!,
          lastName: data.lastName!,
          phoneNumber: data.phoneNumber!,
          accountStatus: data.accountStatus!,
          roles: data.roles!,
          position: data.position || undefined,
          address: data.address || undefined,
          notes: data.notes || undefined,
        };

        const result = await dispatch(
          updateUserService({ userId: data.id!, userData: payload })
        ).unwrap();

        showToast.success(
          `User "${result.fullName || result.email}" updated successfully`
        );

        handleClose();
      }
    } catch (error: any) {
      console.error("Error saving user:", error);
      showToast.error(error || "Failed to save user");
    }
  };

  const handleClose = () => {
    reset();
    dispatch(clearError());
    dispatch(clearSelectedUser());
    onClose();
  };

  const isSubmitting = isCreate ? isCreating : isUpdating;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] p-0 flex flex-col">
        {/* Header */}
        <FormHeader
          title={isCreate ? "Create New User" : firstName || "Edit User"}
          description={
            isCreate
              ? "Fill out the form to create a new user account"
              : email || "Update user information below"
          }
          avatarName={firstName || email}
          avatarImageUrl={userData?.profileImageUrl}
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
                  name="userIdentifier"
                  label="User Identifier"
                  placeholder="Enter user identifier"
                  disabled={!isCreate}
                  required={isCreate}
                />

                <TextField
                  control={control}
                  name="email"
                  label="Email"
                  type="email"
                  placeholder="Enter email address"
                  disabled={!isCreate}
                  required={isCreate}
                />

                <TextField
                  control={control}
                  name="firstName"
                  label="First Name"
                  placeholder="Enter first name"
                  required
                  disabled={isSubmitting}
                />

                <TextField
                  control={control}
                  name="lastName"
                  label="Last Name"
                  placeholder="Enter last name"
                  required
                  disabled={isSubmitting}
                />

                <TextField
                  control={control}
                  name="phoneNumber"
                  label="Phone Number"
                  placeholder="Enter phone number"
                  required
                  disabled={isSubmitting}
                />

                <TextField
                  control={control}
                  name="position"
                  label="Position"
                  placeholder="Enter position (optional)"
                  disabled={isSubmitting}
                />

                <TextField
                  control={control}
                  name="address"
                  label="Address"
                  placeholder="Enter address (optional)"
                  className="md:col-span-2"
                  disabled={isSubmitting}
                />

                {isCreate && (
                  <PasswordField
                    control={control}
                    name="password"
                    label="Password"
                    placeholder="Enter password"
                    required
                    showPassword={showPassword}
                    onTogglePassword={() => setShowPassword(!showPassword)}
                    className="md:col-span-2"
                    disabled={isSubmitting}
                  />
                )}

                <SelectField
                  control={control}
                  name="roles"
                  label="User Role"
                  placeholder="Select user role"
                  options={USER_PLATFORM_ROLE_CREATE_UPDATE}
                  required
                  disabled={isSubmitting}
                  onValueChange={(value) => {
                    setValue("roles", [value], {
                      shouldDirty: true,
                      shouldValidate: true,
                    });
                  }}
                />

                <SelectField
                  control={control}
                  name="accountStatus"
                  label="Account Status"
                  placeholder="Select account status"
                  options={ACCOUNT_STATUS_CREATE_UPDATE}
                  required
                  disabled={isSubmitting}
                />
              </div>

              {/* Notes - Separate Row */}
              <TextareaField
                control={control}
                name="notes"
                label="Notes"
                placeholder="Enter any additional notes (optional)"
                rows={3}
                disabled={isSubmitting}
              />
            </FormBody>

            {/* Footer */}
            <FormFooter
              isSubmitting={isSubmitting}
              isDirty={isDirty}
              isCreate={isCreate}
              createMessage="Creating user..."
              updateMessage="Updating user..."
            >
              <CancelButton onClick={handleClose} disabled={isSubmitting} />

              <SubmitButton
                isSubmitting={isSubmitting}
                isDirty={isDirty}
                isCreate={isCreate}
                createText="Create User"
                updateText="Update User"
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
