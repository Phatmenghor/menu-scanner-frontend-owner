import React, { useEffect, useRef, useState } from "react";
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
import { Eye, EyeOff } from "lucide-react";
import {
  BUSINESS_USER_ROLE_OPTIONS,
  BUSINESS_USER_TYPE_OPTIONS,
  ModalMode,
  Status,
  STATUS_USER_OPTIONS,
} from "@/constants/AppResource/status/status";
import { UploadImageRequest } from "@/models/dashboard/image/image.request.model";
import { uploadImageService } from "@/services/dashboard/image/image.service";
import { Card, CardContent } from "@/components/ui/card";
import {
  CreateUsers,
  createUserSchema,
  UpdateUsers,
  updateUserSchema,
  UserFormData,
} from "@/models/dashboard/user/plateform-user/user.schema";

export type UserModalData = Partial<CreateUsers> &
  Partial<UpdateUsers> & {
    userRole?: string;
    userStatus?: string;
  };

type Props = {
  mode: ModalMode;
  Data?: UserFormData | null;
  onClose: () => void;
  isOpen: boolean;
  isSubmitting?: boolean;
  onSave: (data: UserFormData) => void;
};

const getDefaultBusinessRoleValue = () => {
  return [BUSINESS_USER_ROLE_OPTIONS[0]?.value];
};

const getDefaultBusinessUserTypeValue = () => {
  return BUSINESS_USER_TYPE_OPTIONS[0]?.value;
};

export default function ModalBusinessUser({
  isOpen,
  onClose,
  Data,
  mode,
  onSave,
  isSubmitting = false,
}: Props) {
  const isCreate = mode === ModalMode.CREATE_MODE;
  const schema = isCreate ? createUserSchema : updateUserSchema;
  const [showPassword, setShowPassword] = useState(false);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<UserFormData>({
    resolver: zodResolver(schema), // Use dynamic schema instead of hardcoded UserFormSchema
    defaultValues: {
      id: Data?.id ?? "",
      email: "",
      username: "",
      firstName: "",
      lastName: "",
      phoneNumber: "",
      profileImageUrl: "",
      userType: getDefaultBusinessUserTypeValue(),
      businessId: "",
      roles: getDefaultBusinessRoleValue(),
      accountStatus: Status.ACTIVE,
      position: "",
      address: "",
      notes: "",
      password: "",
    },
    mode: "onChange",
  });

  const profileUrl = watch("profileImageUrl");

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
        username: Data?.username || "",
        firstName: Data?.firstName || "",
        lastName: Data?.lastName || "",
        phoneNumber: Data?.phoneNumber || "",
        profileImageUrl: Data?.profileImageUrl || "",
        userType: Data?.userType || getDefaultBusinessUserTypeValue(),
        businessId: Data?.businessId || "",
        roles: Data?.roles || getDefaultBusinessRoleValue(),
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
          console.log(
            "Image Preview URL:",
            process.env.NEXT_PUBLIC_API_BASE_URL + response.imageUrl
          );

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
    console.log("Form submitted with mode:", mode, "Data:", data); // Debug log

    if (isCreate) {
      const payload: CreateUsers = {
        email: data?.email?.trim()!,
        username: data?.username?.trim()!,
        firstName: data.firstName.trim(),
        lastName: data.lastName.trim(),
        phoneNumber: data?.phoneNumber?.trim(),
        userType: data?.userType!,
        businessId: data.businessId,
        roles: data.roles,
        accountStatus: Status.ACTIVE,
        profileImageUrl: data.profileImageUrl,
        position: data.position,
        address: data.address,
        notes: data.notes,
        password: data?.password?.trim()!,
      };
      console.log("Create Payload:", payload); // Debug log
      onSave(payload);
    } else {
      const payload: UpdateUsers = {
        id: data.id ?? "",
        firstName: data.firstName.trim(),
        lastName: data.lastName.trim(),
        phoneNumber: data.phoneNumber?.trim(),
        profileImageUrl: data.profileImageUrl,
        businessId: data.businessId,
        roles: data.roles,
        accountStatus: data.accountStatus, // Use form data instead of hardcoded Status.ACTIVE
        position: data.position,
        address: data.address,
        notes: data.notes,
      };
      console.log("Update Payload:", payload);
      onSave(payload);
    }
    onClose();
  };

  const handleClose = () => {
    reset(); // Reset form when closing
    setLogoPreview(null);
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
          {/* Username Field */}
          {isCreate && (
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
          )}

          {/* First Name Field */}
          <div className="space-y-1">
            <Label htmlFor="first_name">
              First Name <span className="text-red-500">*</span>
            </Label>
            <Controller
              control={control}
              name="firstName"
              render={({ field }) => (
                <Input
                  {...field}
                  id="first_name"
                  type="text"
                  placeholder="John"
                  disabled={isSubmitting}
                  autoComplete="given-name"
                  className={errors.firstName ? "border-red-500" : ""}
                />
              )}
            />
            {errors.firstName && (
              <p className="text-sm text-destructive">
                {errors.firstName.message}
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
              name="lastName"
              render={({ field }) => (
                <Input
                  {...field}
                  id="last_name"
                  type="text"
                  placeholder="Doe"
                  disabled={isSubmitting}
                  autoComplete="family-name"
                  className={errors.lastName ? "border-red-500" : ""}
                />
              )}
            />
            {errors.lastName && (
              <p className="text-sm text-destructive">
                {errors.lastName.message}
              </p>
            )}
          </div>

          {/* Email Field */}
          {isCreate && (
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
                <p className="text-sm text-destructive">
                  {errors.email.message}
                </p>
              )}
            </div>
          )}

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
          {isCreate && (
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
                      {BUSINESS_USER_TYPE_OPTIONS.map((role) => (
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
          )}

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
          {isCreate && (
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
                    {BUSINESS_USER_ROLE_OPTIONS.map((role) => (
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
              name="accountStatus"
              render={({ field }) => (
                <Select
                  value={field.value}
                  onValueChange={field.onChange}
                  disabled={isSubmitting}
                >
                  <SelectTrigger
                    id="status-select"
                    className={`bg-white dark:bg-inherit ${
                      errors.accountStatus ? "border-red-500" : ""
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
            {errors.accountStatus && (
              <p className="text-sm text-destructive">
                {errors.accountStatus.message}
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

          <Card className="mt-6 ">
            <CardContent className="p-4">
              {/* Profile URL Field */}
              <div className="flex flex-col items-center gap-2">
                {/* Profile Image Preview or Placeholder */}
                {logoPreview ? (
                  <div className="relative w-24 h-24">
                    <img
                      src={getImageSource()}
                      alt="Profile Preview"
                      className="w-full h-full rounded-full object-cover border border-gray-300"
                    />
                    {/* Remove Button (X) */}
                    <button
                      type="button"
                      onClick={handleRemoveLogo}
                      className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center hover:bg-red-600"
                      title="Remove profile image"
                    >
                      ×
                    </button>
                  </div>
                ) : (
                  <div
                    className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center border border-dashed border-gray-400 hover:border-blue-500 cursor-pointer"
                    onClick={() => fileInputRef.current?.click()}
                    title="Upload profile image"
                  >
                    <span className="text-gray-500 text-2xl">+</span>
                  </div>
                )}

                {/* Hidden File Input */}
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileChange}
                  title="Upload profile image"
                  placeholder="Choose profile image"
                />
              </div>
            </CardContent>
          </Card>

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
