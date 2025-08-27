"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
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
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Eye, EyeOff, UserPlus, Loader2, Upload, X } from "lucide-react";
import {
  ModalMode,
  Status,
  STATUS_USER_OPTIONS,
  USER_ROLE_OPTIONS,
  USER_TYPE_OPTIONS,
} from "@/constants/AppResource/status/status";
import { UploadImageRequest } from "@/models/dashboard/image/image.request.model";
import { uploadImageService } from "@/services/dashboard/image/image.service";
import {
  CreateUsers,
  createUserSchema,
  UpdateUsers,
  updateUserSchema,
  UserFormData,
} from "@/models/dashboard/user/plateform-user/user.schema";
import { ComboboxSelectBusiness } from "../combo-box/combobox-business";
import { BusinessModel } from "@/models/dashboard/master-data/business/business-response-model";

// Status options for form
const getDefaultRoleValue = () => {
  return [USER_ROLE_OPTIONS[0]?.value];
};

const getDefaultUserTypeValue = () => {
  return USER_TYPE_OPTIONS[0]?.value;
};

type Props = {
  mode: ModalMode;
  Data?: UserFormData | null;
  onClose: () => void;
  isOpen: boolean;
  isSubmitting?: boolean;
  onSave: (data: CreateUsers | UpdateUsers) => void;
  error?: string | null;
};

function ModalUser({
  isOpen,
  onClose,
  Data,
  mode,
  onSave,
  isSubmitting = false,
  error = null,
}: Props) {
  const isCreate = mode === ModalMode.CREATE_MODE;
  const schema = isCreate ? createUserSchema : updateUserSchema;

  const [showPassword, setShowPassword] = useState(false);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [selectedBusiness, setSelectedBusiness] =
    useState<BusinessModel | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    trigger,
    watch,
    formState: { errors, isDirty },
  } = useForm<UserFormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      id: Data?.id ?? "",
      email: "",
      userIdentifier: "",
      firstName: "",
      lastName: "",
      phoneNumber: "",
      profileImageUrl: "",
      userType: getDefaultUserTypeValue(),
      businessId: "",
      roles: getDefaultRoleValue(),
      accountStatus: Status.ACTIVE,
      position: "",
      address: "",
      notes: "",
      password: "",
    },
    mode: "onChange",
  });

  const profileUrl = watch("profileImageUrl");
  const businessId = watch("businessId");

  useEffect(() => {
    if (profileUrl) {
      setLogoPreview(profileUrl);
    }
  }, [profileUrl]);

  // Reset form when modal opens or data changes
  useEffect(() => {
    if (isOpen) {
      const formData = {
        id: Data?.id || "",
        email: Data?.email || "",
        userIdentifier: Data?.userIdentifier || "",
        firstName: Data?.firstName || "",
        lastName: Data?.lastName || "",
        phoneNumber: Data?.phoneNumber || "",
        profileImageUrl: Data?.profileImageUrl || "",
        userType: Data?.userType || getDefaultUserTypeValue(),
        businessId: Data?.businessId || "",
        roles: Data?.roles || getDefaultRoleValue(),
        accountStatus: Data?.accountStatus || Status.ACTIVE,
        position: Data?.position || "",
        address: Data?.address || "",
        notes: Data?.notes || "",
        password: "", // Always empty for security
      };

      reset(formData);
      setLogoPreview(Data?.profileImageUrl || null);
    }
  }, [isOpen, Data, reset]);

  // Clean up blob URLs
  useEffect(() => {
    return () => {
      if (logoPreview?.startsWith("blob:")) {
        URL.revokeObjectURL(logoPreview);
      }
    };
  }, [logoPreview]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64String = reader.result as string;
        const base64Data = base64String.split(",")[1];

        const payload: UploadImageRequest = {
          base64: base64Data,
          type: file.type,
        };

        const response = await uploadImageService(payload);
        if (response?.imageUrl) {
          setValue("profileImageUrl", response?.imageUrl, {
            shouldValidate: true,
          });
          setLogoPreview(response?.imageUrl);
        }
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error("Failed to upload image", error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveLogo = () => {
    setLogoPreview(null);
    setValue("profileImageUrl", "", { shouldDirty: true });
  };

  const getImageSource = () => {
    return logoPreview?.startsWith("http")
      ? logoPreview
      : (process.env.NEXT_PUBLIC_API_BASE_URL ?? "") + logoPreview;
  };

  const onSubmit = (data: UserFormData) => {
    if (isCreate) {
      const payload: CreateUsers = {
        email: data?.email?.trim() || "",
        userIdentifier: data?.userIdentifier?.trim() || "",
        firstName: data?.firstName?.trim(),
        lastName: data?.lastName?.trim(),
        phoneNumber: data?.phoneNumber?.trim(),
        userType: data?.userType || "",
        businessId: data?.businessId,
        roles: data.roles,
        accountStatus: Status.ACTIVE,
        profileImageUrl: data.profileImageUrl,
        position: data.position,
        address: data.address,
        notes: data.notes,
        password: data?.password?.trim() || "",
      };
      onSave(payload);
    } else {
      const payload: UpdateUsers = {
        id: data.id ?? "",
        firstName: data?.firstName?.trim(),
        lastName: data?.lastName?.trim(),
        phoneNumber: data.phoneNumber?.trim(),
        profileImageUrl: data.profileImageUrl,
        businessId: data?.businessId,
        roles: data.roles,
        accountStatus: data.accountStatus,
        position: data.position,
        address: data.address,
        notes: data.notes,
      };
      onSave(payload);
    }
  };

  const handleClose = () => {
    reset();
    setLogoPreview(null);
    setSelectedBusiness(null);
    onClose();
  };

  const handleBusinessChange = useCallback(
    (business: BusinessModel | null) => {
      setSelectedBusiness(business);
      setValue("businessId", business?.id, {
        shouldValidate: true,
        shouldDirty: true,
      });
      trigger("businessId");
    },
    [setValue, trigger]
  );

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
                  : `Update "${Data?.firstName || "user"}" information below.`}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {/* Content */}
        <ScrollArea className="flex-1 min-h-0">
          <div className="p-6">
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
                  {/* User Identifier - Create Only */}
                  {isCreate && (
                    <div className="space-y-2">
                      <Label
                        htmlFor="userIdentifier"
                        className="text-sm font-medium"
                      >
                        User Identifier <span className="text-red-500">*</span>
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
                            disabled={isSubmitting}
                            className={`transition-colors ${
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
                  )}

                  {/* Email - Create Only */}
                  {isCreate && (
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-sm font-medium">
                        Email Address <span className="text-red-500">*</span>
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
                            className={`transition-colors ${
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
                  )}

                  {/* First Name */}
                  <div className="space-y-2">
                    <Label htmlFor="firstName" className="text-sm font-medium">
                      First Name <span className="text-red-500">*</span>
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
                      Last Name <span className="text-red-500">*</span>
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
                  {/* User Type - Create Only */}
                  {isCreate && (
                    <div className="space-y-2">
                      <Label htmlFor="userType" className="text-sm font-medium">
                        User Type <span className="text-red-500">*</span>
                      </Label>
                      <Controller
                        control={control}
                        name="userType"
                        render={({ field }) => (
                          <Select
                            value={field.value}
                            onValueChange={(value) => field.onChange(value)}
                            disabled={isSubmitting}
                          >
                            <SelectTrigger
                              className={`transition-colors ${
                                errors.userType
                                  ? "border-red-500 focus:border-red-500"
                                  : "focus:border-green-500"
                              }`}
                            >
                              <SelectValue placeholder="Select user type" />
                            </SelectTrigger>
                            <SelectContent>
                              {USER_TYPE_OPTIONS.map((type) => (
                                <SelectItem key={type.value} value={type.value}>
                                  {type.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        )}
                      />
                      {errors.userType && (
                        <p className="text-sm text-red-600">
                          {errors.userType.message}
                        </p>
                      )}
                    </div>
                  )}

                  {/* Roles */}
                  <div className="space-y-2">
                    <Label htmlFor="roles" className="text-sm font-medium">
                      Role <span className="text-red-500">*</span>
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
                            className={`transition-colors ${
                              errors.roles
                                ? "border-red-500 focus:border-red-500"
                                : "focus:border-green-500"
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
                      <p className="text-sm text-red-600">
                        {errors.roles.message}
                      </p>
                    )}
                  </div>

                  {/* Status - Update Only */}
                  {!isCreate && (
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
                            onValueChange={field.onChange}
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
                  )}

                  {/* Business Selection */}
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="businessId" className="text-sm font-medium">
                      Business <span className="text-red-500">*</span>
                    </Label>
                    <Controller
                      control={control}
                      name="businessId"
                      render={({ field }) => (
                        <ComboboxSelectBusiness
                          dataSelect={selectedBusiness}
                          onChangeSelected={handleBusinessChange}
                          disabled={isSubmitting}
                        />
                      )}
                    />
                    {errors.businessId && (
                      <p className="text-sm text-red-600">
                        {errors.businessId.message}
                      </p>
                    )}
                  </div>

                  {/* Password - Create Only */}
                  {isCreate && (
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="password" className="text-sm font-medium">
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
                                  : "focus:border-green-500"
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

              {/* Profile Picture Section */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <div className="w-1 h-6 bg-purple-600 rounded-full"></div>
                  <h3 className="text-lg font-semibold text-foreground">
                    Profile Picture
                  </h3>
                </div>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex flex-col items-center gap-4">
                      {/* Profile Image Preview */}
                      {logoPreview ? (
                        <div className="relative w-24 h-24">
                          <img
                            src={getImageSource()}
                            alt="Profile Preview"
                            className="w-full h-full rounded-full object-cover border border-gray-300"
                          />
                          <button
                            type="button"
                            onClick={handleRemoveLogo}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 text-xs flex items-center justify-center hover:bg-red-600 transition-colors"
                            title="Remove profile image"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ) : (
                        <div
                          className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center border-2 border-dashed border-gray-300 hover:border-purple-400 cursor-pointer transition-colors"
                          onClick={() => fileInputRef.current?.click()}
                        >
                          <Upload className="w-6 h-6 text-gray-400" />
                        </div>
                      )}

                      {/* Upload Button */}
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={isUploading || isSubmitting}
                        className="min-w-[120px]"
                      >
                        {isUploading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Uploading...
                          </>
                        ) : (
                          <>
                            <Upload className="mr-2 h-4 w-4" />
                            {logoPreview ? "Change Image" : "Upload Image"}
                          </>
                        )}
                      </Button>

                      {/* Hidden File Input */}
                      <input
                        type="file"
                        ref={fileInputRef}
                        accept="image/*"
                        className="hidden"
                        onChange={handleFileChange}
                      />

                      <p className="text-xs text-muted-foreground text-center">
                        Recommended: Square image, at least 200x200px
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </form>
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
              disabled={isSubmitting || !isDirty}
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

export default ModalUser;
