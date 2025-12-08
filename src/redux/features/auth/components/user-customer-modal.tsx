"use client";

import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ScrollArea } from "@/components/ui/scroll-area";
import { UserPlus } from "lucide-react";
import {
  ModalMode,
  UserGropeType,
  Status,
  AccountStatus,
} from "@/constants/AppResource/status/status";
import {
  ACCOUNT_STATUS_CREATE_UPDATE,
  USER_CUSTOMER_ROLE_CREATE_UPDATE,
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
import { clearError } from "../store/slice/users-slice";
import {
  selectError,
  selectIsLoading,
  selectOperations,
} from "../store/selectors/users-selectors";
import { FormFooter } from "@/components/shared/form-field/form-footer";

type Props = {
  mode: ModalMode;
  userId?: string;
  onClose: () => void;
  isOpen: boolean;
};

export default function UserCustomerformModal({
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
  const isLoadingData = useAppSelector(selectIsLoading);
  const reduxError = useAppSelector(selectError);
  const { isCreating, isUpdating } = operations;

  const {
    control,
    handleSubmit,
    reset,
    setValue,
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

  // Fetch user data for edit mode
  useEffect(() => {
    const fetchUserData = async () => {
      if (!userId || !isOpen || isCreate) return;

      try {
        // Dispatch fetchUserByIdService through Redux
        const resultAction = await dispatch(fetchUserByIdService(userId));

        // Check if the fetch was successful
        if (fetchUserByIdService.fulfilled.match(resultAction)) {
          const data = resultAction.payload;

          // Populate form with fetched data
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
        console.error("Error fetching user customer data:", error);
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
        // Create mode: Include all required fields
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

        // Dispatch create action
        const result = await dispatch(createUserService(payload)).unwrap();

        showToast.success(
          `User customer "${
            result.fullName || result.email
          }" created successfully`
        );

        // Close modal on success
        handleClose();
      } else {
        // Update mode: Only editable fields
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

        // Dispatch update action
        const result = await dispatch(
          updateUserService({ userId: data.id!, userData: payload })
        ).unwrap();

        showToast.success(
          `User customer "${
            result.fullName || result.email
          }" updated successfully`
        );

        // Close modal on success
        handleClose();
      }
    } catch (error: any) {
      // Error is handled by Redux state and displayed in the form
      console.error("Error saving user customer:", error);
      showToast.error(error || "Failed to save user customer");
    }
  };

  const handleClose = () => {
    reset();
    dispatch(clearError());
    onClose();
  };

  // Determine if form is submitting
  const isSubmitting = isCreate ? isCreating : isUpdating;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] p-0">
        <DialogHeader className="px-6 pt-6 pb-4 border-b">
          <div className="flex items-center gap-3">
            {/* Icon */}
            <div className="p-2 bg-primary/10 rounded-lg">
              <UserPlus className="h-5 w-5 text-primary" />
            </div>

            {/* Title & Description */}
            <div className="flex flex-col gap-1">
              <DialogTitle className="text-xl font-semibold">
                {isCreate ? "Create New User" : "Edit User"}
              </DialogTitle>
              <DialogDescription>
                {isCreate
                  ? "Fill out the form to create a new user customer account"
                  : "Update user customer information below"}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {/* Loading State - Edit Mode Only */}
        {!isCreate && isLoadingData ? (
          <div className="p-6 flex items-center justify-center min-h-[400px]">
            <Loading />
          </div>
        ) : (
          <ScrollArea className="max-h-[calc(90vh-180px)]">
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="px-6 py-4 space-y-6"
            >
              {/* Error Display */}
              {reduxError && (
                <div className="p-4 bg-destructive/10 border border-destructive rounded-lg">
                  <p className="text-sm text-destructive font-medium">
                    {reduxError}
                  </p>
                </div>
              )}

              {/* Section: Basic Information */}
              <div>
                <h3 className="text-lg font-semibold mb-4 text-foreground">
                  Basic Information
                </h3>

                {/* Form Fields Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* User Identifier - Create Only */}
                  <TextField
                    control={control}
                    name="userIdentifier"
                    label="User Identifier"
                    placeholder="Enter user identifier"
                    disabled={!isCreate}
                    required={isCreate}
                  />

                  {/* Email - Create Only */}
                  <TextField
                    control={control}
                    name="email"
                    label="Email"
                    type="email"
                    placeholder="Enter email address"
                    disabled={!isCreate}
                    required={isCreate}
                  />

                  {/* First Name */}
                  <TextField
                    control={control}
                    name="firstName"
                    label="First Name"
                    placeholder="Enter first name"
                    required
                    disabled={isSubmitting}
                  />

                  {/* Last Name */}
                  <TextField
                    control={control}
                    name="lastName"
                    label="Last Name"
                    placeholder="Enter last name"
                    required
                    disabled={isSubmitting}
                  />

                  {/* Phone Number */}
                  <TextField
                    control={control}
                    name="phoneNumber"
                    label="Phone Number"
                    placeholder="Enter phone number"
                    required
                    disabled={isSubmitting}
                  />

                  {/* Position */}
                  <TextField
                    control={control}
                    name="position"
                    label="Position"
                    placeholder="Enter position (optional)"
                    disabled={isSubmitting}
                  />

                  {/* Address - Full Width */}
                  <TextField
                    control={control}
                    name="address"
                    label="Address"
                    placeholder="Enter address (optional)"
                    className="md:col-span-2"
                    disabled={isSubmitting}
                  />

                  {/* Notes - Full Width */}
                  <TextareaField
                    control={control}
                    name="notes"
                    label="Notes"
                    placeholder="Enter any additional notes (optional)"
                    className="md:col-span-2"
                    rows={3}
                    disabled={isSubmitting}
                  />

                  {/* Password - Create Only, Full Width */}
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
                </div>
              </div>

              {/* Section: Account Settings */}
              <div>
                <h3 className="text-lg font-semibold mb-4 text-foreground">
                  Account Settings
                </h3>

                {/* Form Fields Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* User Role */}
                  <SelectField
                    control={control}
                    name="roles"
                    label="User Role"
                    placeholder="Select user role"
                    options={USER_CUSTOMER_ROLE_CREATE_UPDATE}
                    required
                    disabled={isSubmitting}
                    onValueChange={(value) => {
                      // Convert single value to array for roles field
                      setValue("roles", [value], {
                        shouldDirty: true,
                        shouldValidate: true,
                      });
                    }}
                  />

                  {/* Account Status */}
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
              </div>

              <FormFooter
                isSubmitting={isSubmitting}
                isDirty={isDirty}
                isCreate={isCreate}
                createMessage="Creating user..."
                updateMessage="Updating user..."
              >
                {/* Cancel Button */}
                <CancelButton onClick={handleClose} disabled={isSubmitting} />

                {/* Submit Button */}
                <SubmitButton
                  isSubmitting={isSubmitting}
                  isDirty={isDirty}
                  isCreate={isCreate}
                  createText="Create User"
                  updateText="Update User"
                  submittingCreateText="Creating..."
                  submittingUpdateText="Updating..."
                  onClick={handleSubmit(onSubmit)}
                />
              </FormFooter>
            </form>
          </ScrollArea>
        )}
      </DialogContent>
    </Dialog>
  );
}
