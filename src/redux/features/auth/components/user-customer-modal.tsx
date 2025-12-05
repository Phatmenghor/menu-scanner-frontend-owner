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
} from "@/constants/AppResource/status/status";
import {
  ACCOUNT_STATUS_CREATE_UPDATE,
  USER_BUSINESS_ROLE_CREATE_UPDATE,
} from "@/constants/AppResource/status/create-update-status";
import {
  createUserSchema,
  updateUserSchema,
  UserFormData,
} from "@/models/dashboard/user/plateform-user/user.schema";
import { getUserByIdService } from "@/services/dashboard/user/plateform-user/plateform-user.service";
import Loading from "@/components/shared/common/loading";
import { TextField } from "@/components/shared/form-field/text-field";
import { TextareaField } from "@/components/shared/form-field/text-area-field";
import { SelectField } from "@/components/shared/form-field/select-field";
import { FormFooter } from "@/components/shared/form-field/form-footer";
import { CancelButton } from "@/components/shared/form-field/cancel-button";
import { SubmitButton } from "@/components/shared/form-field/submid-button";
import { PasswordField } from "@/components/shared/form-field/password-field";
import {
  CreateUserRequest,
  UpdateUserRequest,
} from "../models/request/users-request";

type Props = {
  mode: ModalMode;
  userId?: string;
  onClose: () => void;
  isOpen: boolean;
  isSubmitting?: boolean;
  onSave: (data: CreateUserRequest | UpdateUserRequest) => void;
  error?: string | null;
};

export default function UserCustomerModal({
  isOpen,
  onClose,
  userId,
  mode,
  onSave,
  isSubmitting = false,
  error = null,
}: Props) {
  const isCreate = mode === ModalMode.CREATE_MODE;
  const [showPassword, setShowPassword] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(false);

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
      accountStatus: Status.ACTIVE,
      position: "",
      address: "",
      notes: "",
    },
    mode: "onChange",
  });

  useEffect(() => {
    const fetchUserData = async () => {
      if (!userId || !isOpen || isCreate) return;

      setIsLoadingData(true);
      try {
        const data = await getUserByIdService(userId);

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
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setIsLoadingData(false);
      }
    };

    fetchUserData();
  }, [userId, isOpen, isCreate, reset]);

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
        accountStatus: Status.ACTIVE,
        position: "",
        address: "",
        notes: "",
      });
    }
  }, [isOpen, isCreate, reset]);

  const onSubmit = (data: UserFormData) => {
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
        position: data.position,
        address: data.address,
        notes: data.notes,
      };
      onSave(payload);
    } else {
      // Update mode: Only editable fields
      const payload: UpdateUserRequest = {
        id: data.id!,
        firstName: data.firstName!,
        lastName: data.lastName!,
        phoneNumber: data.phoneNumber!,
        accountStatus: data.accountStatus!,
        roles: data.roles!,
        position: data.position,
        address: data.address,
        notes: data.notes,
      };
      onSave(payload);
    }
  };

  /* ==========================================
     MODAL CLOSE HANDLER
     - Resets form state
     - Calls parent onClose
  ========================================== */
  const handleClose = () => {
    reset();
    onClose();
  };

  /* ==========================================
     RENDER: MODAL STRUCTURE
  ========================================== */
  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl h-[90vh] p-0 gap-0 flex flex-col">
        <DialogHeader className="px-6 py-4 border-b bg-muted/30 flex-shrink-0">
          <div className="flex items-center gap-4 pr-8">
            {/* Icon */}
            <div className="p-2 bg-primary/10 rounded-full">
              <UserPlus className="h-5 w-5 text-primary" />
            </div>

            {/* Title & Description */}
            <div className="flex-1">
              <DialogTitle className="text-xl font-semibold">
                {isCreate ? "Create New User" : "Edit User"}
              </DialogTitle>
              <DialogDescription className="text-sm text-muted-foreground">
                {isCreate
                  ? "Fill out the form to create a new user account"
                  : "Update user information below"}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <ScrollArea className="flex-1 min-h-0">
          <div className="p-6">
            {/* Loading State - Edit Mode Only */}
            {!isCreate && isLoadingData ? (
              <Loading />
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {error && (
                  <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-md">
                    <p className="text-sm text-destructive font-medium">
                      {error}
                    </p>
                  </div>
                )}

                <div className="space-y-4">
                  {/* Section Header */}
                  <div className="flex items-center gap-2">
                    <div className="w-1 h-6 bg-primary rounded-full"></div>
                    <h3 className="text-base font-semibold">
                      Basic Information
                    </h3>
                  </div>

                  {/* Form Fields Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* User Identifier - Create Only, Non-editable */}
                    <TextField
                      name="userIdentifier"
                      label="User Identifier"
                      control={control}
                      error={errors.userIdentifier}
                      placeholder="johndoe"
                      required={isCreate}
                      disabled={isSubmitting || !isCreate}
                    />

                    {/* Email - Create Only, Non-editable */}
                    <TextField
                      name="email"
                      label="Email Address"
                      type="email"
                      control={control}
                      error={errors.email}
                      placeholder="email@example.com"
                      required={isCreate}
                      disabled={isSubmitting || !isCreate}
                    />

                    {/* First Name - Always Editable */}
                    <TextField
                      name="firstName"
                      label="First Name"
                      control={control}
                      error={errors.firstName}
                      placeholder="John"
                      required
                      disabled={isSubmitting}
                    />

                    {/* Last Name - Always Editable */}
                    <TextField
                      name="lastName"
                      label="Last Name"
                      control={control}
                      error={errors.lastName}
                      placeholder="Doe"
                      required
                      disabled={isSubmitting}
                    />

                    {/* Phone Number - Always Editable */}
                    <TextField
                      name="phoneNumber"
                      label="Phone Number"
                      type="tel"
                      control={control}
                      error={errors.phoneNumber}
                      placeholder="+1234567890"
                      required
                      disabled={isSubmitting}
                    />

                    {/* Position - Optional */}
                    <TextField
                      name="position"
                      label="Position"
                      control={control}
                      error={errors.position}
                      placeholder="Job title"
                      disabled={isSubmitting}
                    />

                    {/* Address - Optional, Full Width */}
                    <TextField
                      name="address"
                      label="Address"
                      control={control}
                      error={errors.address}
                      placeholder="Street address"
                      disabled={isSubmitting}
                      className="md:col-span-2"
                    />

                    {/* Notes - Optional, Full Width */}
                    <TextareaField
                      name="notes"
                      label="Notes"
                      control={control}
                      error={errors.notes}
                      placeholder="Additional notes"
                      disabled={isSubmitting}
                      className="md:col-span-2"
                    />

                    {/* Password - Create Only, Full Width */}
                    {isCreate && (
                      <PasswordField
                        name="password"
                        label="Password"
                        control={control}
                        error={errors.password}
                        required
                        disabled={isSubmitting}
                        showPassword={showPassword}
                        onTogglePassword={() => setShowPassword(!showPassword)}
                        className="md:col-span-2"
                      />
                    )}
                  </div>
                </div>

                <div className="space-y-4">
                  {/* Section Header */}
                  <div className="flex items-center gap-2">
                    <div className="w-1 h-6 bg-primary rounded-full"></div>
                    <h3 className="text-base font-semibold">
                      Account Settings
                    </h3>
                  </div>

                  {/* Form Fields Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* User Role - Always Editable */}
                    <SelectField
                      name="roles"
                      label="User Role"
                      control={control}
                      error={errors.roles as any}
                      options={USER_BUSINESS_ROLE_CREATE_UPDATE}
                      placeholder="Select role"
                      required
                      disabled={isSubmitting}
                      onValueChange={(value: any) => {
                        // Convert single value to array for roles field
                        setValue("roles", [value], {
                          shouldDirty: true,
                          shouldValidate: true,
                        });
                      }}
                    />

                    {/* Account Status - Always Editable */}
                    <SelectField
                      name="accountStatus"
                      label="Account Status"
                      control={control}
                      error={errors.accountStatus}
                      options={ACCOUNT_STATUS_CREATE_UPDATE}
                      placeholder="Select status"
                      required
                      disabled={isSubmitting}
                    />
                  </div>
                </div>
              </form>
            )}
          </div>
        </ScrollArea>

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
      </DialogContent>
    </Dialog>
  );
}
