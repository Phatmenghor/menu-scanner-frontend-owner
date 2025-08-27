"use client";

import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Eye, EyeOff, UserPlus, Loader2 } from "lucide-react";
import {
  ModalMode,
  Status,
  USER_ROLE_OPTIONS,
  USER_TYPE_OPTIONS,
  STATUS_USER_OPTIONS,
  UserGropeType,
} from "@/constants/AppResource/status/status";
import {
  CreateUsers,
  createUserSchema,
  UpdateUsers,
  updateUserSchema,
  UserFormData,
} from "@/models/dashboard/user/plateform-user/user.schema";
import { UserModel } from "@/models/dashboard/user/plateform-user/user.response";
import { getUserByIdService } from "@/services/dashboard/user/plateform-user/plateform-user.service";
import Loading from "@/components/shared/common/loading";
import { USER_PLATFORM_ROLE_CREATE_UPDATE } from "@/constants/AppResource/status/create-update-status";

type Props = {
  mode: ModalMode;
  userId?: string; // For edit mode
  onClose: () => void;
  isOpen: boolean;
  isSubmitting?: boolean;
  onSave: (data: CreateUsers | UpdateUsers) => void;
  error?: string | null;
};

function UserPlatformModal({
  isOpen,
  onClose,
  userId,
  mode,
  onSave,
  isSubmitting = false,
  error = null,
}: Props) {
  const isCreate = mode === ModalMode.CREATE_MODE;
  const schema = isCreate ? createUserSchema : updateUserSchema;

  const [showPassword, setShowPassword] = useState(false);
  const [userData, setUserData] = useState<UserModel | null>(null);
  const [isLoadingData, setIsLoadingData] = useState(false);

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isDirty },
  } = useForm<UserFormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      id: "",
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

  // Fetch user data for edit mode
  useEffect(() => {
    const fetchUserData = async () => {
      if (!userId || !isOpen || isCreate) return;

      setIsLoadingData(true);
      try {
        const data = await getUserByIdService(userId);
        setUserData(data);

        // Populate form with fetched data
        const formData = {
          id: data?.id || "",
          userIdentifier: data?.userIdentifier || "",
          email: data?.email || "",
          firstName: data?.firstName || "",
          lastName: data?.lastName || "",
          phoneNumber: data?.phoneNumber || "",
          password: "",
          userType: data?.userType || "",
          roles: data?.roles,
          accountStatus: data?.accountStatus || Status.ACTIVE,
          position: data?.position || "",
          address: data?.address || "",
          notes: data?.notes || "",
        };
        reset(formData);
      } catch (error: any) {
        console.error("Error fetching user data:", error);
      } finally {
        setIsLoadingData(false);
      }
    };

    fetchUserData();
  }, [userId, isOpen, isCreate, reset]);

  // Reset form for create mode
  useEffect(() => {
    if (isOpen && isCreate) {
      const formData = {
        id: "",
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
      };
      reset(formData);
    }
  }, [isOpen, isCreate, reset]);

  const onSubmit = (data: UserFormData) => {
    if (isCreate) {
      const payload: CreateUsers = {
        userIdentifier: data?.userIdentifier?.trim() || "",
        email: data?.email?.trim() || "",
        password: data?.password?.trim() || "",
        userType: data?.userType || "",
        roles: data.roles,
        accountStatus: Status.ACTIVE,
        firstName: data?.firstName?.trim(),
        lastName: data?.lastName?.trim(),
        phoneNumber: data?.phoneNumber?.trim(),
        position: data?.position,
        address: data?.address,
        notes: data?.notes,
      };
      onSave(payload);
    } else {
      const payload: UpdateUsers = {
        id: data.id ?? "",
        firstName: data?.firstName?.trim(),
        lastName: data?.lastName?.trim(),
        phoneNumber: data?.phoneNumber?.trim(),
        roles: data.roles,
        accountStatus: data.accountStatus,
        position: data?.position,
        address: data?.address,
        notes: data?.notes,
      };
      onSave(payload);
    }
  };

  const handleClose = () => {
    reset();
    setUserData(null);
    onClose();
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl h-[90vh] p-0 gap-0 flex flex-col">
        {/* Header */}
        <DialogHeader className="px-6 py-4 border-b bg-muted/30 flex-shrink-0">
          <div className="flex items-center gap-4 pr-8">
            <div className="p-2 bg-blue-100 rounded-full">
              <UserPlus className="h-5 w-5 text-blue-600" />
            </div>
            <div className="flex-1">
              <DialogTitle className="text-xl font-semibold">
                {isCreate ? "Create New User" : "Edit User"}
              </DialogTitle>
              <DialogDescription className="text-base text-muted-foreground">
                {isCreate
                  ? "Fill out the form to create a new user account."
                  : userData?.fullName
                  ? `Update "${userData.fullName}" information below.`
                  : "Loading user information..."}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {/* Content */}
        <ScrollArea className="flex-1 min-h-0">
          <div className="p-6">
            {/* Loading State for Edit Mode */}
            {!isCreate && isLoadingData ? (
              <Loading />
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Error Display */}
                {error && (
                  <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-md">
                    <p className="text-sm text-destructive font-medium">
                      {error}
                    </p>
                  </div>
                )}

                {/* Basic Information Section */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <div className="w-1 h-6 bg-blue-600 rounded-full"></div>
                    <h3 className="text-lg font-semibold text-foreground">
                      Basic Information
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* User Identifier */}
                    <div className="space-y-2">
                      <Label
                        htmlFor="userIdentifier"
                        className="text-sm font-medium"
                      >
                        User Identifier{" "}
                        {isCreate && <span className="text-red-500">*</span>}
                      </Label>
                      <Controller
                        control={control}
                        name="userIdentifier"
                        render={({ field }) => (
                          <Input
                            {...field}
                            id="userIdentifier"
                            type="text"
                            placeholder="johndoe"
                            disabled={isSubmitting || !isCreate}
                            className={`transition-colors ${
                              !isCreate ? "bg-muted/50" : ""
                            } ${
                              errors.userIdentifier
                                ? "border-red-500 focus:border-red-500"
                                : "focus:border-blue-500"
                            }`}
                          />
                        )}
                      />
                      {errors.userIdentifier && (
                        <p className="text-sm text-red-600">
                          {errors.userIdentifier.message}
                        </p>
                      )}
                    </div>

                    {/* Email */}
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-sm font-medium">
                        Email Address{" "}
                        {isCreate && <span className="text-red-500">*</span>}
                      </Label>
                      <Controller
                        control={control}
                        name="email"
                        render={({ field }) => (
                          <Input
                            {...field}
                            id="email"
                            type="email"
                            placeholder="email@example.com"
                            disabled={isSubmitting || !isCreate}
                            className={`transition-colors ${
                              !isCreate ? "bg-muted/50" : ""
                            } ${
                              errors.email
                                ? "border-red-500 focus:border-red-500"
                                : "focus:border-blue-500"
                            }`}
                          />
                        )}
                      />
                      {errors.email && (
                        <p className="text-sm text-red-600">
                          {errors.email.message}
                        </p>
                      )}
                    </div>

                    {/* First Name */}
                    <div className="space-y-2">
                      <Label
                        htmlFor="firstName"
                        className="text-sm font-medium"
                      >
                        First Name{" "}
                        {isCreate && <span className="text-red-500">*</span>}
                      </Label>
                      <Controller
                        control={control}
                        name="firstName"
                        render={({ field }) => (
                          <Input
                            {...field}
                            id="firstName"
                            type="text"
                            placeholder="John"
                            disabled={isSubmitting}
                            className={`transition-colors ${
                              errors.firstName
                                ? "border-red-500 focus:border-red-500"
                                : "focus:border-blue-500"
                            }`}
                          />
                        )}
                      />
                      {errors.firstName && (
                        <p className="text-sm text-red-600">
                          {errors.firstName.message}
                        </p>
                      )}
                    </div>

                    {/* Last Name */}
                    <div className="space-y-2">
                      <Label htmlFor="lastName" className="text-sm font-medium">
                        Last Name{" "}
                        {isCreate && <span className="text-red-500">*</span>}
                      </Label>
                      <Controller
                        control={control}
                        name="lastName"
                        render={({ field }) => (
                          <Input
                            {...field}
                            id="lastName"
                            type="text"
                            placeholder="Doe"
                            disabled={isSubmitting}
                            className={`transition-colors ${
                              errors.lastName
                                ? "border-red-500 focus:border-red-500"
                                : "focus:border-blue-500"
                            }`}
                          />
                        )}
                      />
                      {errors.lastName && (
                        <p className="text-sm text-red-600">
                          {errors.lastName.message}
                        </p>
                      )}
                    </div>

                    {/* Phone Number */}
                    <div className="space-y-2">
                      <Label
                        htmlFor="phoneNumber"
                        className="text-sm font-medium"
                      >
                        Phone Number{" "}
                        {isCreate && <span className="text-red-500">*</span>}
                      </Label>
                      <Controller
                        control={control}
                        name="phoneNumber"
                        render={({ field }) => (
                          <Input
                            {...field}
                            id="phoneNumber"
                            type="tel"
                            placeholder="+1234567890"
                            disabled={isSubmitting}
                            className={`transition-colors ${
                              errors.phoneNumber
                                ? "border-red-500 focus:border-red-500"
                                : "focus:border-blue-500"
                            }`}
                          />
                        )}
                      />
                      {errors.phoneNumber && (
                        <p className="text-sm text-red-600">
                          {errors.phoneNumber.message}
                        </p>
                      )}
                    </div>

                    {/* Position */}
                    <div className="space-y-2">
                      <Label htmlFor="position" className="text-sm font-medium">
                        Position
                      </Label>
                      <Controller
                        control={control}
                        name="position"
                        render={({ field }) => (
                          <Input
                            {...field}
                            id="position"
                            type="text"
                            placeholder="Job title or position"
                            disabled={isSubmitting}
                            className={`transition-colors ${
                              errors.position
                                ? "border-red-500 focus:border-red-500"
                                : "focus:border-blue-500"
                            }`}
                          />
                        )}
                      />
                      {errors.position && (
                        <p className="text-sm text-red-600">
                          {errors.position.message}
                        </p>
                      )}
                    </div>

                    {/* Address */}
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="address" className="text-sm font-medium">
                        Address
                      </Label>
                      <Controller
                        control={control}
                        name="address"
                        render={({ field }) => (
                          <Input
                            {...field}
                            id="address"
                            type="text"
                            placeholder="Street address"
                            disabled={isSubmitting}
                            className={`transition-colors ${
                              errors.address
                                ? "border-red-500 focus:border-red-500"
                                : "focus:border-blue-500"
                            }`}
                          />
                        )}
                      />
                      {errors.address && (
                        <p className="text-sm text-red-600">
                          {errors.address.message}
                        </p>
                      )}
                    </div>

                    {/* Notes */}
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="notes" className="text-sm font-medium">
                        Notes
                      </Label>
                      <Controller
                        control={control}
                        name="notes"
                        render={({ field }) => (
                          <Input
                            {...field}
                            id="notes"
                            type="text"
                            placeholder="Additional notes"
                            disabled={isSubmitting}
                            className={`transition-colors ${
                              errors.notes
                                ? "border-red-500 focus:border-red-500"
                                : "focus:border-blue-500"
                            }`}
                          />
                        )}
                      />
                      {errors.notes && (
                        <p className="text-sm text-red-600">
                          {errors.notes.message}
                        </p>
                      )}
                    </div>

                    {/* Password - Create Only */}
                    {isCreate && (
                      <div className="space-y-2 md:col-span-2">
                        <Label
                          htmlFor="password"
                          className="text-sm font-medium"
                        >
                          Password <span className="text-red-500">*</span>
                        </Label>
                        <div className="relative">
                          <Controller
                            control={control}
                            name="password"
                            render={({ field }) => (
                              <Input
                                {...field}
                                id="password"
                                type={showPassword ? "text" : "password"}
                                placeholder="••••••••"
                                disabled={isSubmitting}
                                className={`pr-12 transition-colors ${
                                  errors.password
                                    ? "border-red-500 focus:border-red-500"
                                    : "focus:border-blue-500"
                                }`}
                              />
                            )}
                          />
                          <button
                            type="button"
                            onClick={togglePasswordVisibility}
                            className="absolute inset-y-0 right-0 flex items-center pr-3"
                            tabIndex={-1}
                          >
                            {showPassword ? (
                              <EyeOff className="h-4 w-4 text-gray-500" />
                            ) : (
                              <Eye className="h-4 w-4 text-gray-500" />
                            )}
                          </button>
                        </div>
                        {errors.password && (
                          <p className="text-sm text-red-600">
                            {errors.password.message}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Account Settings Section */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <div className="w-1 h-6 bg-green-600 rounded-full"></div>
                    <h3 className="text-lg font-semibold text-foreground">
                      Account Settings
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* User Role */}
                    <div className="space-y-2">
                      <Label htmlFor="roles" className="text-sm font-medium">
                        User Role <span className="text-red-500">*</span>
                      </Label>
                      <Controller
                        control={control}
                        name="roles"
                        render={({ field }) => (
                          <Select
                            value={field.value?.[0] || ""}
                            onValueChange={(value) => {
                              setValue("roles", [value], {
                                shouldDirty: true,
                                shouldTouch: true,
                                shouldValidate: true,
                              });
                            }}
                            disabled={isSubmitting}
                          >
                            <SelectTrigger
                              className={`transition-colors ${
                                errors.roles
                                  ? "border-red-500 focus:border-red-500"
                                  : "focus:border-green-500"
                              }`}
                            >
                              <SelectValue placeholder="Select role" />
                            </SelectTrigger>
                            <SelectContent>
                              {USER_PLATFORM_ROLE_CREATE_UPDATE.map((role) => (
                                <SelectItem key={role.value} value={role.value}>
                                  {role.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        )}
                      />
                      {errors.roles && (
                        <p className="text-sm text-red-600">
                          {errors.roles.message}
                        </p>
                      )}
                    </div>

                    {/* Account Status - Edit Only */}

                    <div className="space-y-2">
                      <Label
                        htmlFor="accountStatus"
                        className="text-sm font-medium"
                      >
                        Account Status <span className="text-red-500">*</span>
                      </Label>
                      <Controller
                        control={control}
                        name="accountStatus"
                        render={({ field }) => (
                          <Select
                            value={field.value}
                            onValueChange={(value) => {
                              setValue("accountStatus", value, {
                                shouldDirty: true,
                                shouldTouch: true,
                                shouldValidate: true,
                              });
                            }}
                            disabled={isSubmitting}
                          >
                            <SelectTrigger
                              className={`transition-colors ${
                                errors.accountStatus
                                  ? "border-red-500 focus:border-red-500"
                                  : "focus:border-green-500"
                              }`}
                            >
                              <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                            <SelectContent>
                              {STATUS_USER_OPTIONS.map((status) => (
                                <SelectItem
                                  key={status.value}
                                  value={status.value}
                                >
                                  {status.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        )}
                      />
                      {errors.accountStatus && (
                        <p className="text-sm text-red-600">
                          {errors.accountStatus.message}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </form>
            )}
          </div>
        </ScrollArea>

        {/* Footer */}
        <div className="flex justify-between items-center p-6 border-t bg-muted/30 flex-shrink-0">
          <div className="text-sm text-muted-foreground">
            {isSubmitting
              ? isCreate
                ? "Creating user..."
                : "Updating user..."
              : isDirty
              ? "You have unsaved changes"
              : "No changes made"}
          </div>
          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit(onSubmit)}
              disabled={isSubmitting || (!isDirty && !isCreate)}
              className="min-w-[120px]"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {isCreate ? "Creating..." : "Updating..."}
                </>
              ) : isCreate ? (
                "Create User"
              ) : (
                "Update User"
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default UserPlatformModal;
