import React, { useEffect, useRef, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useForm, Controller, Resolver } from "react-hook-form";
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
import {
  BusinessUserFormData,
  CreateBusinessUserFormData,
  getDefaultFormData,
  UpdateBusinessUserFormData,
} from "@/models/dashboard/user/business-user/business-user.schema";
import { CreateBusinessUserRequest } from "@/models/dashboard/user/business-user/business-user.request.model";

type Props = {
  mode: ModalMode;
  Data?: CreateBusinessUserFormData | UpdateBusinessUserFormData;
  onClose: () => void;
  isOpen: boolean;
  isSubmitting?: boolean;
  onSave: (
    data: CreateBusinessUserFormData | UpdateBusinessUserFormData
  ) => void;
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
  } = useForm<BusinessUserFormData>({
    resolver: zodResolver(schema) as Resolver<BusinessUserFormData>,
    defaultValues: {
      accountStatus: Status.ACTIVE,
      address: "",
      businessAddress: "",
      businessDescription: "",
      businessEmail: "",
      businessId: "",
      businessName: "",
      businessPhone: "",
      firstName: "",
      id: "",
      lastName: "",
      notes: "",
      ownerAddress: "",
      ownerEmail: "",
      ownerFirstName: "",
      ownerLastName: "",
      ownerPassword: "",
      ownerPhone: "",
      ownerUserIdentifier: "",
      phoneNumber: "",
      position: "",
      preferredSubdomain: "",
      profileImageUrl: "",
      roles: "",
    },
    mode: "onChange",
  });

  const profileUrl = watch("profileImageUrl");

  useEffect(() => {
    if (profileUrl) {
      setLogoPreview(profileUrl);
    }
  }, [profileUrl]);

  useEffect(() => {
    if (isOpen && Data) {
      const isUpdate = (
        data: CreateBusinessUserFormData | UpdateBusinessUserFormData
      ): data is UpdateBusinessUserFormData => {
        return "id" in data;
      };

      if (isUpdate(Data)) {
        const data = Data as UpdateBusinessUserFormData;
        // It's UpdateBusinessUserFormData
        const formData: UpdateBusinessUserFormData = {
          id: Data.id?.trim() ?? "",
          firstName: Data.firstName?.trim() ?? "",
          lastName: Data.lastName?.trim() ?? "",
          phoneNumber: Data.phoneNumber?.trim() ?? "",
          profileImageUrl: Data.profileImageUrl?.trim() ?? "",
          businessId: Data.businessId?.trim() ?? "",
          roles: Data.roles ?? getDefaultBusinessRoleValue(),
          accountStatus: Data.accountStatus ?? Status.ACTIVE,
          position: Data.position?.trim() ?? "",
          address: Data.address?.trim() ?? "",
          notes: Data.notes?.trim() ?? "",
          password: "", // always blank on edit
        };

        reset(formData);
        setLogoPreview(Data.profileImageUrl?.trim() ?? null);
      } else {
        // It's CreateBusinessUserFormData — use default values
        const formData: UserFormData = {
          id: "",
          email: Data.ownerEmail?.trim() ?? "",
          userIdentifier: Data.ownerUserIdentifier?.trim() ?? "",
          firstName: Data.ownerFirstName?.trim() ?? "",
          lastName: Data.ownerLastName?.trim() ?? "",
          phoneNumber: Data.ownerPhone?.trim() ?? "",
          profileImageUrl: "",
          userType: getDefaultBusinessUserTypeValue(),
          businessId: "",
          roles: getDefaultBusinessRoleValue(),
          accountStatus: Status.ACTIVE,
          position: "",
          address: Data.ownerAddress?.trim() ?? "",
          notes: "",
          password: "", // fill this if needed from Data.ownerPassword
        };

        reset(formData);
        setLogoPreview(null);
      }
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

  const onSubmit = (
    formData: CreateBusinessUserFormData | UpdateBusinessUserFormData
  ) => {
    console.log("Form submitted with mode:", mode, "Data:", formData); // Debug log

    if (isCreate) {
      const data = formData as CreateBusinessUserFormData;
      const payload: CreateBusinessUserRequest = {
        ownerUserIdentifier: data.ownerUserIdentifier!.trim(),
        businessName: data.businessName!.trim(),
        preferredSubdomain: data.preferredSubdomain!.trim(),
        ownerPassword: data.ownerPassword!.trim(),
        ownerFirstName: data.ownerFirstName!.trim(),
        ownerLastName: data.ownerLastName!.trim(),

        // Optional fields with safe trim
        businessEmail: data.businessEmail?.trim(),
        businessPhone: data.businessPhone?.trim(),
        businessAddress: data.businessAddress?.trim(),
        businessDescription: data.businessDescription?.trim(),
        ownerEmail: data.ownerEmail?.trim(),
        ownerPhone: data.ownerPhone?.trim(),
        ownerAddress: data.ownerAddress?.trim(),
      };
      console.log("Create Payload:", payload); // Debug log
      onSave(payload);
    } else {
      const data = formData as UpdateBusinessUserFormData;
      const payload: UpdateBusinessUserFormData = {
        address: data.address,
        id: data.id.trim(),
        accountStatus: data?.accountStatus,
        businessId: data.businessId?.trim(),
        firstName: data?.firstName?.trim(),
        lastName: data.lastName?.trim(),
        notes: data.notes?.trim(),
        phoneNumber: data?.phoneNumber?.trim(),
        position: data?.position?.trim(),
        profileImageUrl: data?.profileImageUrl?.trim(),
        roles: data?.roles,
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

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-2">
          {/* Username Field */}

          {isCreate && (
            <div className="space-y-1">
              <Label htmlFor="businessName">
                Business Name <span className="text-red-500">*</span>
              </Label>
              <Controller
                control={control}
                name="businessName"
                render={({ field }) => (
                  <Input
                    {...field}
                    id="businessName"
                    type="text"
                    placeholder="johndoe"
                    disabled={isSubmitting}
                    autoComplete="businessName"
                    className={errors.root ? "border-red-500" : ""}
                  />
                )}
              />
              {errors.root && (
                <p className="text-sm text-destructive">
                  {errors.root.message}
                </p>
              )}
            </div>
          )}

          {isCreate && (
            <div className="space-y-1">
              <Label htmlFor="ownerUserIdentifier">
                User Identifier <span className="text-red-500">*</span>
              </Label>
              <Controller
                control={control}
                name="ownerUserIdentifier"
                render={({ field }) => (
                  <Input
                    {...field}
                    id="ownerUserIdentifier"
                    type="text"
                    placeholder="johndoe"
                    disabled={isSubmitting}
                    autoComplete="ownerUserIdentifier"
                    className={errors.root ? "border-red-500" : ""}
                  />
                )}
              />
              {errors.root && (
                <p className="text-sm text-destructive">
                  {errors.root.message}
                </p>
              )}
            </div>
          )}

          {/* First Name Field */}
          {!isCreate && (
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
                    className={errors.root ? "border-red-500" : ""}
                  />
                )}
              />
              {errors.root && (
                <p className="text-sm text-destructive">
                  {errors.root.message}
                </p>
              )}
            </div>
          )}

          {/* Last Name Field */}
          {!isCreate && (
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
                    className={errors.root ? "border-red-500" : ""}
                  />
                )}
              />
              {errors.root && (
                <p className="text-sm text-destructive">
                  {errors.root.message}
                </p>
              )}
            </div>
          )}

          {/* Email Field */}
          {isCreate && (
            <div className="space-y-1">
              <Label htmlFor="email">
                Email <span className="text-red-500">*</span>
              </Label>
              <Controller
                control={control}
                name="ownerEmail"
                render={({ field }) => (
                  <Input
                    {...field}
                    id="email"
                    type="email"
                    placeholder="email@example.com"
                    disabled={isSubmitting}
                    autoComplete="email"
                    className={errors.root ? "border-red-500" : ""}
                  />
                )}
              />
              {errors.root && (
                <p className="text-sm text-destructive">
                  {errors.root.message}
                </p>
              )}
            </div>
          )}

          {/* Owner Phone Number Field */}
          <div className="space-y-1">
            <Label htmlFor="ownerPhone">
              Owner Phone <span className="text-red-500">*</span>
            </Label>
            <Controller
              control={control}
              name="ownerPhone"
              render={({ field }) => (
                <Input
                  {...field}
                  id="ownerPhone"
                  type="tel"
                  placeholder="+1234567890"
                  disabled={isSubmitting}
                  autoComplete="ownerPhone"
                  className={errors.root ? "border-red-500" : ""}
                />
              )}
            />
            {errors.root && (
              <p className="text-sm text-destructive">{errors.root.message}</p>
            )}
          </div>

          {/* Business ID Field - Create Mode Only */}
          {!isCreate && (
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
                    className={errors.root ? "border-red-500" : ""}
                  />
                )}
              />
              {errors.root && (
                <p className="text-sm text-destructive">
                  {errors.root.message}
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
                    name="ownerPassword"
                    render={({ field }) => (
                      <Input
                        {...field}
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        disabled={isSubmitting}
                        autoComplete="new-password"
                        className={
                          errors.root ? "border-red-500 pr-10" : "pr-10"
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
                {errors.root && (
                  <p className="text-sm text-destructive">
                    {errors.root.message}
                  </p>
                )}
              </div>
            </>
          )}

          {/* Status Field */}
          {!isCreate && (
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
                        errors.root ? "border-red-500" : ""
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
              {errors.root && (
                <p className="text-sm text-destructive">
                  {errors.root.message}
                </p>
              )}
            </div>
          )}

          {/* Position Field - Optional */}
          {!isCreate && (
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
                    className={errors.root ? "border-red-500" : ""}
                  />
                )}
              />
              {errors.root && (
                <p className="text-sm text-destructive">
                  {errors.root.message}
                </p>
              )}
            </div>
          )}

          {/* Address Field - Optional */}
          {isCreate ? (
            <div className="space-y-1">
              <Label htmlFor="ownerAddress">Owner Address</Label>
              <Controller
                control={control}
                name="ownerAddress"
                render={({ field }) => (
                  <Input
                    {...field}
                    id=""
                    type="text"
                    placeholder="Street address"
                    disabled={isSubmitting}
                    autoComplete="street-address"
                    className={errors.root ? "border-red-500" : ""}
                  />
                )}
              />
              {errors.root && (
                <p className="text-sm text-destructive">
                  {errors.root.message}
                </p>
              )}
            </div>
          ) : (
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
                    className={errors.root ? "border-red-500" : ""}
                  />
                )}
              />
              {errors.root && (
                <p className="text-sm text-destructive">
                  {errors.root.message}
                </p>
              )}
            </div>
          )}

          {/* Notes Field - Optional */}
          {!isCreate && (
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
                    className={errors.root ? "border-red-500" : ""}
                  />
                )}
              />
              {errors.root && (
                <p className="text-sm text-destructive">
                  {errors.root.message}
                </p>
              )}
            </div>
          )}

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
