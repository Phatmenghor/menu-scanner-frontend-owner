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
import { Eye, EyeOff, User, Loader2 } from "lucide-react";
import {
  BUSINESS_USER_ROLE_OPTIONS,
  BusinessUserType,
  ModalMode,
  Status,
  STATUS_USER_OPTIONS,
} from "@/constants/AppResource/status/status";
import { UploadImageRequest } from "@/models/dashboard/image/image.request.model";
import { uploadImageService } from "@/services/dashboard/image/image.service";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  CreateUsers,
  createUserSchema,
  UpdateUsers,
  updateUserSchema,
  UserFormData,
} from "@/models/dashboard/user/plateform-user/user.schema";
import { ComboboxSelectBusiness } from "../combo-box/combobox-business";
import { BusinessModel } from "@/models/dashboard/master-data/business/business-response-model";
import { UserModel } from "@/models/dashboard/user/plateform-user/user.response";
import { getUserByIdService } from "@/services/dashboard/user/plateform-user/plateform-user.service";
import Loading from "@/components/shared/common/loading";

type Props = {
  userId?: string;
  mode: ModalMode;
  onClose: () => void;
  isOpen: boolean;
  isSubmitting?: boolean;
  onSave: (data: UserFormData) => Promise<void>;
  error?: string | null;
};

const getDefaultBusinessRoleValue = () => {
  return [BUSINESS_USER_ROLE_OPTIONS[0]?.value];
};

export default function ModalBusinessUser({
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

  // Local state
  const [showPassword, setShowPassword] = useState(false);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedBusiness, setSelectedBusiness] =
    useState<BusinessModel | null>(null);
  const [userData, setUserData] = useState<UserModel | null>(null);
  const [isLoadingData, setIsLoadingData] = useState(false);
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
      id: "",
      email: "",
      userIdentifier: "",
      firstName: "",
      lastName: "",
      phoneNumber: "",
      profileImageUrl: "",
      userType: BusinessUserType.BUSINESS_USER,
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
          email: data?.email || "",
          userIdentifier: data?.userIdentifier || "",
          firstName: data?.firstName || "",
          lastName: data?.lastName || "",
          phoneNumber: data?.phoneNumber || "",
          profileImageUrl: data?.profileImageUrl || "",
          userType: BusinessUserType.BUSINESS_USER,
          businessId: data?.businessId || "",
          roles: data?.roles || getDefaultBusinessRoleValue(),
          accountStatus: data?.accountStatus || Status.ACTIVE,
          position: data?.position || "",
          address: data?.address || "",
          notes: data?.notes || "",
          password: "", // Always empty for security
        };

        reset(formData);
        setLogoPreview(data?.profileImageUrl || null);

        // Set selected business for combobox
        if (data?.businessId && data?.businessName) {
          setSelectedBusiness({
            id: data.businessId,
            name: data.businessName,
          } as BusinessModel);
        }
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
    if (isCreate && isOpen) {
      reset({
        id: "",
        email: "",
        userIdentifier: "",
        firstName: "",
        lastName: "",
        phoneNumber: "",
        profileImageUrl: "",
        userType: BusinessUserType.BUSINESS_USER,
        businessId: "",
        roles: getDefaultBusinessRoleValue(),
        accountStatus: Status.ACTIVE,
        position: "",
        address: "",
        notes: "",
        password: "",
      });
      setLogoPreview(null);
      setSelectedBusiness(null);
      setUserData(null);
    }
  }, [isCreate, isOpen, reset]);

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

  const onSubmit = async (data: UserFormData) => {
    try {
      if (isCreate) {
        // CREATE USER PAYLOAD
        const payload: CreateUsers = {
          email: data?.email?.trim() || "",
          userIdentifier: data?.userIdentifier?.trim() || "",
          firstName: data?.firstName?.trim() || "",
          lastName: data?.lastName?.trim() || "",
          phoneNumber: data?.phoneNumber?.trim() || "",
          userType: BusinessUserType.BUSINESS_USER,
          businessId: data?.businessId || "",
          roles: data.roles || getDefaultBusinessRoleValue(),
          accountStatus: Status.ACTIVE,
          profileImageUrl: data.profileImageUrl || "",
          position: data.position || "",
          address: data.address || "",
          notes: data.notes || "",
          password: data?.password?.trim() || "",
        };
        await onSave(payload);
      } else {
        // UPDATE USER PAYLOAD
        const payload: UpdateUsers = {
          id: data.id ?? "",
          firstName: data?.firstName?.trim() || "",
          lastName: data?.lastName?.trim() || "",
          phoneNumber: data.phoneNumber?.trim() || "",
          profileImageUrl: data.profileImageUrl || "",
          businessId: data?.businessId || "",
          roles: data.roles || getDefaultBusinessRoleValue(),
          accountStatus: data.accountStatus || Status.ACTIVE,
          position: data.position || "",
          address: data.address || "",
          notes: data.notes || "",
        };
        await onSave(payload);
      }
    } catch (error) {
      console.error("Form submission error:", error);
      // Error handling is done in the parent component
    }
  };

  const handleClose = () => {
    reset();
    setLogoPreview(null);
    setUserData(null);
    setSelectedBusiness(null);
    onClose();
  };

  const handleBusinessChange = useCallback(
    (business: BusinessModel | null) => {
      setSelectedBusiness(business);
      setValue("businessId", business?.id || "", {
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
            <div
              className={`p-2 rounded-full ${
                isCreate ? "bg-green-100" : "bg-blue-100"
              }`}
            >
              <User
                className={`h-5 w-5 ${
                  isCreate ? "text-green-600" : "text-blue-600"
                }`}
              />
            </div>
            <div className="flex-1">
              <DialogTitle className="text-xl font-semibold">
                {isCreate ? "Create New Business User" : "Edit Business User"}
              </DialogTitle>
              <DialogDescription className="text-base text-muted-foreground">
                {isCreate
                  ? "Fill out the form below to create a new business user account."
                  : userData?.email
                  ? `Update user information for "${userData.email}"`
                  : "Loading user information..."}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {/* Content */}
        <ScrollArea className="flex-1 min-h-0">
          <div className="p-6">
            {/* Loading State for Edit Mode */}
            {isLoadingData && !isCreate ? (
              <Loading />
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

                {/* CREATE MODE ONLY FIELDS */}
                {isCreate && (
                  <>
                    {/* User Identifier Field */}
                    <div className="space-y-2">
                      <Label htmlFor="userIdentifier">
                        Username <span className="text-red-500">*</span>
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
                            autoComplete="username"
                            className={
                              errors.userIdentifier ? "border-red-500" : ""
                            }
                          />
                        )}
                      />
                      {errors.userIdentifier && (
                        <p className="text-sm text-destructive">
                          {errors.userIdentifier.message}
                        </p>
                      )}
                    </div>

                    {/* Email Field */}
                    <div className="space-y-2">
                      <Label htmlFor="email">
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
                            placeholder="user@company.com"
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
                  </>
                )}

                {/* Name Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">
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

                  <div className="space-y-2">
                    <Label htmlFor="lastName">
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
                </div>

                {/* Phone Number Field */}
                <div className="space-y-2">
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

                {/* Business Selection */}
                <div className="space-y-2">
                  <Label htmlFor="businessId">
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
                    <p className="text-sm text-destructive">
                      {errors.businessId.message}
                    </p>
                  )}
                </div>

                {/* Password Field - Create Mode Only */}
                {isCreate && (
                  <div className="space-y-2">
                    <Label htmlFor="password">
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
                        disabled={isSubmitting}
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
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Roles Field */}
                  <div className="space-y-2">
                    <Label htmlFor="roles">
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
                            className={errors.roles ? "border-red-500" : ""}
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
                      <p className="text-sm text-destructive">
                        {errors.roles.message}
                      </p>
                    )}
                  </div>

                  {/* Status Field - Update Mode Only */}
                  {!isCreate && (
                    <div className="space-y-2">
                      <Label htmlFor="accountStatus">
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
                              className={
                                errors.accountStatus ? "border-red-500" : ""
                              }
                            >
                              <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                            <SelectContent>
                              {STATUS_USER_OPTIONS.map((status) => (
                                <SelectItem
                                  key={status.value}
                                  value={status.value}
                                >
                                  <div className="flex items-center gap-2">
                                    <div
                                      className={`w-2 h-2 rounded-full ${
                                        status.value === Status.ACTIVE
                                          ? "bg-green-500"
                                          : "bg-gray-400"
                                      }`}
                                    />
                                    {status.label}
                                  </div>
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
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Position Field */}
                  <div className="space-y-2">
                    <Label htmlFor="position">Position</Label>
                    <Controller
                      control={control}
                      name="position"
                      render={({ field }) => (
                        <Input
                          {...field}
                          id="position"
                          type="text"
                          placeholder="Manager, Developer, etc."
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

                  {/* Address Field */}
                  <div className="space-y-2">
                    <Label htmlFor="address">Address</Label>
                    <Controller
                      control={control}
                      name="address"
                      render={({ field }) => (
                        <Input
                          {...field}
                          id="address"
                          type="text"
                          placeholder="123 Main St, City, State"
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
                </div>

                {/* Notes Field */}
                <div className="space-y-2">
                  <Label htmlFor="notes">Notes</Label>
                  <Controller
                    control={control}
                    name="notes"
                    render={({ field }) => (
                      <Input
                        {...field}
                        id="notes"
                        type="text"
                        placeholder="Additional notes or comments..."
                        disabled={isSubmitting}
                        className={errors.notes ? "border-red-500" : ""}
                      />
                    )}
                  />
                  {errors.notes && (
                    <p className="text-sm text-destructive">
                      {errors.notes.message}
                    </p>
                  )}
                </div>

                {/* Profile Image Upload */}
                <Card>
                  <CardContent className="p-4">
                    <div className="flex flex-col items-center gap-4">
                      <Label className="text-sm font-medium">
                        Profile Image
                      </Label>

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
                            disabled={isSubmitting}
                            className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center hover:bg-red-600 disabled:opacity-50"
                            title="Remove profile image"
                          >
                            ×
                          </button>
                        </div>
                      ) : (
                        <div
                          className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center border border-dashed border-gray-400 hover:border-blue-500 cursor-pointer disabled:cursor-not-allowed"
                          onClick={() =>
                            !isSubmitting && fileInputRef.current?.click()
                          }
                          title="Upload profile image"
                        >
                          {isUploading ? (
                            <Loader2 className="h-6 w-6 animate-spin text-gray-500" />
                          ) : (
                            <span className="text-gray-500 text-2xl">+</span>
                          )}
                        </div>
                      )}

                      <input
                        type="file"
                        ref={fileInputRef}
                        accept="image/*"
                        className="hidden"
                        onChange={handleFileChange}
                        disabled={isSubmitting || isUploading}
                      />

                      {isUploading && (
                        <p className="text-sm text-gray-500">
                          Uploading image...
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Current User Info - Update Mode Only */}
                {!isCreate && userData && (
                  <div className="mt-6 p-4 bg-muted/30 rounded-lg border border-border">
                    <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                      Current User Information
                    </h4>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Email:</span>
                        <p className="font-medium truncate">{userData.email}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Username:</span>
                        <p className="font-medium truncate">
                          {userData.userIdentifier}
                        </p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Business:</span>
                        <p className="font-medium truncate">
                          {userData.businessName || "Not assigned"}
                        </p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">
                          Current Role:
                        </span>
                        <p className="font-medium">
                          {userData.roles?.[0]?.replace("_", " ") ||
                            "Not assigned"}
                        </p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Status:</span>
                        <p
                          className={`font-medium capitalize flex items-center gap-1 ${
                            userData.accountStatus === Status.ACTIVE
                              ? "text-green-600"
                              : "text-red-600"
                          }`}
                        >
                          <div
                            className={`w-2 h-2 rounded-full ${
                              userData.accountStatus === Status.ACTIVE
                                ? "bg-green-500"
                                : "bg-red-500"
                            }`}
                          ></div>
                          {userData.accountStatus?.toLowerCase()}
                        </p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Created:</span>
                        <p className="font-medium text-xs">
                          {userData.createdAt
                            ? new Date(userData.createdAt).toLocaleDateString()
                            : "N/A"}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </form>
            )}
          </div>
        </ScrollArea>

        {/* Footer */}
        <div className="flex justify-between items-center p-6 border-t bg-muted/30 flex-shrink-0">
          <div className="text-sm text-muted-foreground flex items-center gap-2">
            {isSubmitting ? (
              <>
                <Loader2 className="w-3 h-3 animate-spin" />
                {isCreate ? "Creating user..." : "Updating user..."}
              </>
            ) : isDirty ? (
              <>
                <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                You have unsaved changes
              </>
            ) : (
              <>
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                {isCreate ? "Ready to create" : "No changes made"}
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
