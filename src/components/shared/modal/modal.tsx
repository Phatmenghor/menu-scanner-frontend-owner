import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { z } from "zod";
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
import { Eye, EyeOff } from "lucide-react";
import {
  DATA_ROLE_OPTIONS,
  ModalMode,
  STATUS_USER_OPTIONS,
  USER_ROLE_OPTIONS,
  USER_TYPE_OPTIONS,
  UserType,
} from "@/constants/AppResource/status/status";
import {
  createUserSchema,
  updateUserSchema,
  UserFormSchema,
  UserFormData,
  CreateUsers,
  UpdateUsers,
} from "@/models/user/user.schema";

export type UserModalData = Partial<CreateUsers> &
  Partial<UpdateUsers> & {
    userRole?: string;
    userStatus?: string;
  };

type Props = {
  mode: ModalMode;
  Data?: UserModalData | null;
  onClose: () => void;
  isOpen: boolean;
  isSubmitting?: boolean;
  onSave: (data: UserFormData) => void;
};

// Utility functions
const getActiveStatusValue = () => {
  const activeStatus = STATUS_USER_OPTIONS.find(
    (status) =>
      status.label.toLowerCase() === "active" ||
      status.value.toLowerCase() === "active"
  );
  return activeStatus?.value || STATUS_USER_OPTIONS[0]?.value || "";
};

const getDefaultRoleValue = () => {
  return [USER_ROLE_OPTIONS[0]?.value]; // Return as array
};

const getDefaultUserTypeValue = () => {
  return USER_TYPE_OPTIONS[0]?.value; // Return as array
};

function ModalUser({
  isOpen,
  onClose,
  Data,
  mode,
  onSave,
  isSubmitting = false,
}: Props) {
  const isCreate = mode === ModalMode.CREATE_MODE;
  const schema = isCreate ? createUserSchema : updateUserSchema;
  const activeStatusValue = getActiveStatusValue();
  const [showPassword, setShowPassword] = useState(false);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UserFormData>({
    resolver: zodResolver(UserFormSchema), // Use unified form schema
    defaultValues: {
      email: "",
      username: "",
      first_name: "",
      last_name: "",
      phoneNumber: "",
      userType: UserType.PLATFORM_USER,
      businessId: "",
      roles: getDefaultRoleValue(),
      status: activeStatusValue,
      position: "",
      address: "",
      notes: "",
      password: "",
      confirmPassword: "",
    },
  });

  // Reset form when modal opens or data changes
  useEffect(() => {
    if (isOpen) {
      reset({
        email: Data?.email ?? "",
        username: Data?.username ?? "",
        first_name: Data?.first_name ?? "",
        last_name: Data?.last_name ?? "",
        phoneNumber: Data?.phoneNumber ?? "",
        userType: Data?.userType ?? UserType.PLATFORM_USER,
        businessId: isCreate ? "" : Data?.businessId ?? "",
        roles: Data?.roles ?? getDefaultRoleValue(),
        status: Data?.status ?? Data?.userStatus ?? activeStatusValue,
        position: Data?.position ?? "",
        address: Data?.address ?? "",
        notes: Data?.notes ?? "",
        password: "",
        confirmPassword: "",
      });
    }
  }, [Data, reset, isCreate, isOpen, activeStatusValue]);

  // Form submission handler
  const onSubmit = (data: UserFormData) => {
    if (isCreate) {
      const payload: CreateUsers = {
        email: data.email.trim(),
        username: data.username.trim(),
        first_name: data.first_name.trim(),
        last_name: data.last_name.trim(),
        phoneNumber: data?.phoneNumber?.trim(),
        userType: data.userType,
        businessId: data.businessId,
        roles: data.roles,
        status: data.status,
        position: data.position,
        address: data.address,
        notes: data.notes,
        password: data?.password?.trim()!,
        confirmPassword: data?.confirmPassword?.trim()!,
      };
      console.log("New user: ", payload);
      onSave(payload);
    } else {
      const payload: UpdateUsers = {
        email: data.email,
        username: data.username,
        first_name: data.first_name,
        last_name: data.last_name,
        phoneNumber: data.phoneNumber,
        userType: data.userType,
        businessId: data.businessId,
        roles: data.roles,
        status: data.status,
        position: data.position,
        address: data.address,
        notes: data.notes,
        password: data.password ? data.password.trim() : undefined,
        confirmPassword: data.confirmPassword
          ? data.confirmPassword.trim()
          : undefined,
      };
      onSave(payload);
    }
    onClose();
  };

  const handleClose = () => {
    onClose();
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="w-full max-w-lg md:max-w-xl lg:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isCreate ? "Create User" : "Edit User"}</DialogTitle>
          <DialogDescription>
            {isCreate
              ? "Fill out the form to create a new user."
              : "Update user information below."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-2 pt-4">
          {/* Email Field */}
          <div className="space-y-1">
            <Label htmlFor="email">
              Email <span className="text-red-500">*</span>
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
                  disabled={isSubmitting}
                  autoComplete="email"
                  className={errors.email ? "border-red-500" : ""}
                />
              )}
            />
            {errors.email && (
              <p className="text-sm text-destructive">{errors.email.message}</p>
            )}
          </div>

          {/* Username Field */}
          <div className="space-y-1">
            <Label htmlFor="username">
              Username <span className="text-red-500">*</span>
            </Label>
            <Controller
              control={control}
              name="username"
              render={({ field }) => (
                <Input
                  {...field}
                  id="username"
                  type="text"
                  placeholder="johndoe"
                  disabled={isSubmitting}
                  autoComplete="username"
                  className={errors.username ? "border-red-500" : ""}
                />
              )}
            />
            {errors.username && (
              <p className="text-sm text-destructive">
                {errors.username.message}
              </p>
            )}
          </div>

          {/* First Name Field */}
          <div className="space-y-1">
            <Label htmlFor="first_name">
              First Name <span className="text-red-500">*</span>
            </Label>
            <Controller
              control={control}
              name="first_name"
              render={({ field }) => (
                <Input
                  {...field}
                  id="first_name"
                  type="text"
                  placeholder="John"
                  disabled={isSubmitting}
                  autoComplete="given-name"
                  className={errors.first_name ? "border-red-500" : ""}
                />
              )}
            />
            {errors.first_name && (
              <p className="text-sm text-destructive">
                {errors.first_name.message}
              </p>
            )}
          </div>

          {/* Last Name Field */}
          <div className="space-y-1">
            <Label htmlFor="last_name">
              Last Name <span className="text-red-500">*</span>
            </Label>
            <Controller
              control={control}
              name="last_name"
              render={({ field }) => (
                <Input
                  {...field}
                  id="last_name"
                  type="text"
                  placeholder="Doe"
                  disabled={isSubmitting}
                  autoComplete="family-name"
                  className={errors.last_name ? "border-red-500" : ""}
                />
              )}
            />
            {errors.last_name && (
              <p className="text-sm text-destructive">
                {errors.last_name.message}
              </p>
            )}
          </div>

          {/* Phone Number Field */}
          <div className="space-y-1">
            <Label htmlFor="phoneNumber">
              Phone Number <span className="text-red-500">*</span>
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
                  autoComplete="tel"
                  className={errors.phoneNumber ? "border-red-500" : ""}
                />
              )}
            />
            {errors.phoneNumber && (
              <p className="text-sm text-destructive">
                {errors.phoneNumber.message}
              </p>
            )}
          </div>

          {/* User Type Field */}
          <div className="space-y-1">
            <Label htmlFor="userType">
              User Type <span className="text-red-500">*</span>
            </Label>
            <Controller
              control={control}
              name="userType"
              render={({ field }) => (
                <Select
                  value={field.value}
                  onValueChange={(value) => field.onChange([value])}
                  disabled={isSubmitting}
                >
                  <SelectTrigger
                    id="user-type-select"
                    className={`bg-white dark:bg-inherit ${
                      errors.userType ? "border-red-500" : ""
                    }`}
                  >
                    <SelectValue placeholder="Select user type" />
                  </SelectTrigger>
                  <SelectContent>
                    {USER_TYPE_OPTIONS.map((role) => (
                      <SelectItem key={role.value} value={role.value}>
                        {role.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.userType && (
              <p className="text-sm text-destructive">
                {errors.userType.message}
              </p>
            )}
          </div>

          {/* Business ID Field - Create Mode Only */}
          {isCreate && (
            <div className="space-y-1">
              <Label htmlFor="businessId">
                Business ID <span className="text-red-500">*</span>
              </Label>
              <Controller
                control={control}
                name="businessId"
                render={({ field }) => (
                  <Input
                    {...field}
                    id="businessId"
                    type="text"
                    placeholder="Business UUID"
                    disabled={isSubmitting}
                    className={errors.businessId ? "border-red-500" : ""}
                  />
                )}
              />
              {errors.businessId && (
                <p className="text-sm text-destructive">
                  {errors.businessId.message}
                </p>
              )}
            </div>
          )}

          {/* Password Field - Create Mode Only or Update Mode with optional password */}
          {(isCreate || !isCreate) && (
            <>
              <div className="space-y-1">
                <Label htmlFor="password">
                  Password {isCreate && <span className="text-red-500">*</span>}
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
                        autoComplete="new-password"
                        className={
                          errors.password ? "border-red-500 pr-10" : "pr-10"
                        }
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
                  <p className="text-sm text-destructive">
                    {errors.password.message}
                  </p>
                )}
              </div>

              {/* Confirm Password Field */}
              <div className="space-y-1">
                <Label htmlFor="confirmPassword">
                  Confirm Password{" "}
                  {isCreate && <span className="text-red-500">*</span>}
                </Label>
                <div className="relative">
                  <Controller
                    control={control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <Input
                        {...field}
                        id="confirmPassword"
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        disabled={isSubmitting}
                        autoComplete="new-password"
                        className={
                          errors.confirmPassword
                            ? "border-red-500 pr-10"
                            : "pr-10"
                        }
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
                {errors.confirmPassword && (
                  <p className="text-sm text-destructive">
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>
            </>
          )}

          {/* Roles Field - Note: This is simplified to single select for UI, but stores as array */}
          <div className="space-y-1">
            <Label htmlFor="roles-select">
              Roles <span className="text-red-500">*</span>
            </Label>
            <Controller
              control={control}
              name="roles"
              render={({ field }) => (
                <Select
                  value={field.value?.[0] || ""}
                  onValueChange={(value) => field.onChange([value])}
                  disabled={isSubmitting}
                >
                  <SelectTrigger
                    id="roles-select"
                    className={`bg-white dark:bg-inherit ${
                      errors.roles ? "border-red-500" : ""
                    }`}
                  >
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    {USER_ROLE_OPTIONS.map((role) => (
                      <SelectItem key={role.value} value={role.value}>
                        {role.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.roles && (
              <p className="text-sm text-destructive">{errors.roles.message}</p>
            )}
          </div>

          {/* Status Field */}
          <div className="space-y-1">
            <Label htmlFor="status-select">
              Status <span className="text-red-500">*</span>
            </Label>
            <Controller
              control={control}
              name="status"
              render={({ field }) => (
                <Select
                  value={field.value}
                  onValueChange={field.onChange}
                  disabled={isSubmitting}
                >
                  <SelectTrigger
                    id="status-select"
                    className={`bg-white dark:bg-inherit ${
                      errors.status ? "border-red-500" : ""
                    }`}
                  >
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    {STATUS_USER_OPTIONS.map((status) => (
                      <SelectItem key={status.value} value={status.value}>
                        {status.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.status && (
              <p className="text-sm text-destructive">
                {errors.status.message}
              </p>
            )}
          </div>

          {/* Position Field - Optional */}
          <div className="space-y-1">
            <Label htmlFor="position">Position</Label>
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
                  className={errors.position ? "border-red-500" : ""}
                />
              )}
            />
            {errors.position && (
              <p className="text-sm text-destructive">
                {errors.position.message}
              </p>
            )}
          </div>

          {/* Address Field - Optional */}
          <div className="space-y-1">
            <Label htmlFor="address">Address</Label>
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
                  autoComplete="street-address"
                  className={errors.address ? "border-red-500" : ""}
                />
              )}
            />
            {errors.address && (
              <p className="text-sm text-destructive">
                {errors.address.message}
              </p>
            )}
          </div>

          {/* Notes Field - Optional */}
          <div className="space-y-1">
            <Label htmlFor="notes">Notes</Label>
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
                  className={errors.notes ? "border-red-500" : ""}
                />
              )}
            />
            {errors.notes && (
              <p className="text-sm text-destructive">{errors.notes.message}</p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Processing..." : isCreate ? "Create" : "Update"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default ModalUser;
