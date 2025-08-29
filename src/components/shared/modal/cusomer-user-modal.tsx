"use client";

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
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2, User, Upload, X } from "lucide-react";
import {
  Status,
  STATUS_USER_OPTIONS,
} from "@/constants/AppResource/status/status";
import { UploadImageRequest } from "@/models/dashboard/image/image.request.model";
import { uploadImageService } from "@/services/dashboard/image/image.service";
import { getUserByIdService } from "@/services/dashboard/user/plateform-user/plateform-user.service";
import { UserModel } from "@/models/dashboard/user/plateform-user/user.response";
import Loading from "@/components/shared/common/loading";
import { z } from "zod";

// Update request interface - only editable fields
export interface UpdateCustomerUserRequest {
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  profileImageUrl?: string;
  accountStatus: Status;
  notes?: string;
}

// Validation schema for editable fields only
const editUserSchema = z.object({
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  phoneNumber: z.string().optional(),
  profileImageUrl: z.string().optional(),
  accountStatus: z.nativeEnum(Status),
  notes: z.string().optional(),
});

// Infer form data type from schema to ensure consistency
type EditUserFormData = z.infer<typeof editUserSchema>;

type Props = {
  userId?: string;
  onClose: () => void;
  isOpen: boolean;
  isSubmitting?: boolean;
  onSave: (data: UpdateCustomerUserRequest) => void;
  error?: string | null;
};

export default function ModalCustomerUser({
  isOpen,
  onClose,
  userId,
  onSave,
  isSubmitting = false,
  error = null,
}: Props) {
  const [userData, setUserData] = useState<UserModel | null>(null);
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isDirty },
  } = useForm<EditUserFormData>({
    resolver: zodResolver(editUserSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      phoneNumber: "",
      profileImageUrl: "",
      accountStatus: Status.ACTIVE,
      notes: "",
    } as EditUserFormData,
    mode: "onChange",
  });

  const profileUrl = watch("profileImageUrl");

  // Fetch user data for edit mode
  useEffect(() => {
    const fetchUserData = async () => {
      if (!userId || !isOpen) return;

      setIsLoadingData(true);
      try {
        const data = await getUserByIdService(userId);
        setUserData(data);

        // Populate form with fetched data - only editable fields
        const formData: EditUserFormData = {
          firstName: data?.firstName || "",
          lastName: data?.lastName || "",
          phoneNumber: data?.phoneNumber || "",
          profileImageUrl: data?.profileImageUrl || "",
          accountStatus: data?.accountStatus || Status.ACTIVE,
          notes: data?.notes || "",
        };

        reset(formData);
        setLogoPreview(data?.profileImageUrl || null);
      } catch (error: any) {
        console.error("Error fetching user data:", error);
      } finally {
        setIsLoadingData(false);
      }
    };

    fetchUserData();
  }, [userId, isOpen, reset]);

  // Update logo preview when profileUrl changes
  useEffect(() => {
    if (profileUrl) {
      setLogoPreview(profileUrl);
    }
  }, [profileUrl]);

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
            shouldDirty: true,
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

  const onSubmit = (data: EditUserFormData): void => {
    const payload: UpdateCustomerUserRequest = {
      firstName: data.firstName?.trim(),
      lastName: data.lastName?.trim(),
      phoneNumber: data.phoneNumber?.trim(),
      profileImageUrl: data.profileImageUrl || "",
      accountStatus: data.accountStatus,
      notes: data.notes || "",
    };
    onSave(payload);
  };

  const handleClose = () => {
    reset();
    setLogoPreview(null);
    setUserData(null);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl h-[90vh] p-0 gap-0 flex flex-col">
        {/* Header */}
        <DialogHeader className="px-6 py-4 border-b bg-muted/30 flex-shrink-0">
          <div className="flex items-center gap-4 pr-8">
            <div className="p-2 bg-blue-100 rounded-full">
              <User className="h-5 w-5 text-blue-600" />
            </div>
            <div className="flex-1">
              <DialogTitle className="text-xl font-semibold">
                Edit Customer
              </DialogTitle>
              <DialogDescription className="text-base text-muted-foreground">
                {userData
                  ? `Update customer information for "${
                      userData.fullName || userData.email
                    }"`
                  : "Loading customer information..."}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {/* Content */}
        <ScrollArea className="flex-1 min-h-0">
          <div className="p-6">
            {/* Loading State */}
            {isLoadingData ? (
              <Loading />
            ) : !userData ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">
                  No customer data available
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                {/* Error Display */}
                {error && (
                  <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-md">
                    <p className="text-sm text-destructive font-medium">
                      {error}
                    </p>
                  </div>
                )}

                {/* First Name & Last Name */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                          className={`transition-colors focus:border-green-500 ${
                            errors.firstName ? "border-red-500" : ""
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
                          className={`transition-colors focus:border-green-500 ${
                            errors.lastName ? "border-red-500" : ""
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
                </div>

                {/* Phone Number */}
                <div className="space-y-2">
                  <Label htmlFor="phoneNumber" className="text-sm font-medium">
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
                        className={`transition-colors focus:border-green-500 ${
                          errors.phoneNumber ? "border-red-500" : ""
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

                {/* Status */}
                <div className="space-y-2">
                  <Label
                    htmlFor="accountStatus"
                    className="text-sm font-medium"
                  >
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
                        <SelectTrigger className="transition-colors focus:border-green-500">
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          {STATUS_USER_OPTIONS.map((status) => (
                            <SelectItem key={status.value} value={status.value}>
                              <div className="flex items-center gap-2">
                                <div
                                  className={`w-2 h-2 rounded-full ${
                                    status.value === Status.ACTIVE
                                      ? "bg-green-500"
                                      : "bg-gray-400"
                                  }`}
                                ></div>
                                {status.label}
                              </div>
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

                {/* Notes */}
                <div className="space-y-2">
                  <Label htmlFor="notes" className="text-sm font-medium">
                    Notes
                  </Label>
                  <Controller
                    control={control}
                    name="notes"
                    render={({ field }) => (
                      <Textarea
                        {...field}
                        id="notes"
                        placeholder="Additional notes about the customer..."
                        rows={3}
                        disabled={isSubmitting}
                        className="transition-colors focus:border-green-500"
                      />
                    )}
                  />
                </div>

                {/* Profile Image Upload */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Profile Image</Label>
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex flex-col items-center gap-4">
                        {logoPreview ? (
                          <div className="relative">
                            <img
                              src={getImageSource()}
                              alt="Profile Preview"
                              className="w-24 h-24 rounded-full object-cover border border-gray-300"
                            />
                            <button
                              type="button"
                              onClick={handleRemoveLogo}
                              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 text-xs flex items-center justify-center hover:bg-red-600"
                              title="Remove profile image"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        ) : (
                          <div
                            className="w-24 h-24 rounded-full bg-gray-100 flex flex-col items-center justify-center border border-dashed border-gray-400 hover:border-blue-500 cursor-pointer transition-colors"
                            onClick={() => fileInputRef.current?.click()}
                          >
                            <Upload className="h-6 w-6 text-gray-400" />
                            <span className="text-xs text-gray-500 mt-1">
                              {isUploading ? "Uploading..." : "Upload"}
                            </span>
                          </div>
                        )}

                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => fileInputRef.current?.click()}
                          disabled={isUploading || isSubmitting}
                          className="text-xs"
                        >
                          {isUploading ? (
                            <>
                              <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                              Uploading...
                            </>
                          ) : (
                            <>
                              <Upload className="mr-2 h-3 w-3" />
                              {logoPreview ? "Change Image" : "Upload Image"}
                            </>
                          )}
                        </Button>

                        <input
                          type="file"
                          ref={fileInputRef}
                          accept="image/*"
                          className="hidden"
                          onChange={handleFileChange}
                          disabled={isUploading || isSubmitting}
                        />

                        <p className="text-xs text-muted-foreground text-center">
                          Upload a profile picture for the customer
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Current Customer Info Card - Read Only Information */}
                <div className="mt-6 p-4 bg-muted/30 rounded-lg border border-border">
                  <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    Customer Information (Read Only)
                  </h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Email:</span>
                      <p className="font-medium">{userData.email}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Username:</span>
                      <p className="font-medium">
                        {userData.userIdentifier || "N/A"}
                      </p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Business:</span>
                      <p className="font-medium">
                        {userData.businessName || "Not assigned"}
                      </p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Position:</span>
                      <p className="font-medium">
                        {userData.position || "Not provided"}
                      </p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Address:</span>
                      <p className="font-medium">
                        {userData.address || "Not provided"}
                      </p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Roles:</span>
                      <p className="font-medium">
                        {userData.roles?.join(", ") || "Customer"}
                      </p>
                    </div>
                  </div>
                </div>
              </form>
            )}
          </div>
        </ScrollArea>

        {/* Footer */}
        <div className="flex justify-between items-center p-6 border-t bg-muted/30 flex-shrink-0">
          <div className="text-sm text-muted-foreground flex items-center gap-2">
            {isSubmitting ? (
              <>
                <Loader2 className="h-3 w-3 animate-spin" />
                Updating customer...
              </>
            ) : isDirty ? (
              <>
                <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                You have unsaved changes
              </>
            ) : (
              <>
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                No changes made
              </>
            )}
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
                  Updating...
                </>
              ) : (
                "Update Customer"
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
