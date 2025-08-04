"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  Building2,
  Edit,
  Save,
  X,
  Phone,
  MapPin,
  DollarSign,
  Percent,
  Shield,
  Calendar,
  ChefHat,
  AlertTriangle,
} from "lucide-react";
import { MyBusinessModel } from "@/models/dashboard/user/business-user/business-user.response.model";
import {
  getMyBusinessService,
  updateMyBusinessService,
} from "@/services/dashboard/user/business-user/business-setting.service";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  MyBusinessFormData,
  updateMyBusinessSchema,
} from "@/models/dashboard/user/business-user/business-user.schema";
import { CardHeaderSection } from "@/components/layout/main/card-header-section";
import { ROUTES } from "@/constants/AppRoutes/routes";
import { AppToast } from "@/components/shared/toast/app-toast";
import { UpdateMyBusinessRequest } from "@/models/dashboard/user/business-user/business-user.request.model";
import { UploadImageRequest } from "@/models/dashboard/image/image.request.model";
import { uploadImageService } from "@/services/dashboard/image/image.service";
import { AppIcons } from "@/constants/AppResource/icons/AppIcon";
import { cleanValue } from "@/lib/utils";

export default function BusinessPage() {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [businessData, setBusinessData] = useState<MyBusinessModel | null>(
    null
  );
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    handleSubmit,
    control,
    reset,
    trigger,
    watch,
    setValue,
    formState: { isSubmitting },
  } = useForm<MyBusinessFormData>({
    resolver: zodResolver(updateMyBusinessSchema),
    defaultValues: {
      imageUrl: "",
      name: "",
      description: "",
      phone: "",
      address: "",
      businessType: "",
      facebookUrl: "",
      instagramUrl: "",
      telegramUrl: "",
      usdToKhrRate: 0,
      taxRate: 0,
    },
  });

  const imageUrl = watch("imageUrl");

  useEffect(() => {
    if (imageUrl) {
      setLogoPreview(imageUrl);
    }
  }, [imageUrl]);

  useEffect(() => {
    if (businessData) {
      reset({
        name: businessData.name || "",
        description: businessData.description || "",
        phone: businessData.phone || "",
        address: businessData.address || "",
        businessType: businessData.businessType || "",
        facebookUrl: businessData.facebookUrl || "",
        instagramUrl: businessData.instagramUrl || "",
        telegramUrl: businessData.telegramUrl || "",
        usdToKhrRate: businessData.usdToKhrRate || 0,
        taxRate: businessData.taxRate || 0,
        imageUrl: businessData.imageUrl || "",
      });
      setLogoPreview(businessData.imageUrl);
    }
  }, [businessData, reset]);

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
        setValue("imageUrl", response?.imageUrl, {
          shouldValidate: true,
        });
        console.log(
          "Image Preview URL:",
          process.env.NEXT_PUBLIC_API_BASE_URL + response.imageUrl
        );

        setLogoPreview(response?.imageUrl);
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
    setValue("imageUrl", "", { shouldDirty: true });
  };

  const getImageSource = () => {
    return logoPreview?.startsWith("http")
      ? logoPreview
      : (process.env.NEXT_PUBLIC_API_BASE_URL ?? "") + logoPreview;
  };

  const loadMyBusiness = useCallback(async () => {
    try {
      const response = await getMyBusinessService();
      setBusinessData(response);
      console.log("Load business: ", response);
      reset({
        imageUrl: response.imageUrl || "",
        name: response.name || "",
        description: response.description || "",
        phone: response.phone || "",
        address: response.address || "",
        businessType: response.businessType || "",
        facebookUrl: response.facebookUrl || "",
        instagramUrl: response.instagramUrl || "",
        telegramUrl: response.telegramUrl || "",
        usdToKhrRate: response.usdToKhrRate || 0,
        taxRate: response.taxRate || 0,
      });
    } catch (error) {
      console.error("Fail to fetch my business");
    }
  }, []);

  useEffect(() => {
    loadMyBusiness();
  }, []);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    reset({
      imageUrl: businessData?.imageUrl || "",
      name: businessData?.name || "",
      description: businessData?.description || "",
      phone: businessData?.phone || "",
      address: businessData?.address || "",
      businessType: businessData?.businessType || "",
      facebookUrl: businessData?.facebookUrl || "",
      instagramUrl: businessData?.instagramUrl || "",
      telegramUrl: businessData?.telegramUrl || "",
      usdToKhrRate: businessData?.usdToKhrRate || 0,
      taxRate: businessData?.taxRate || 0,
    });
    setIsEditing(false);
  };

  const onSubmit = async (formData: MyBusinessFormData) => {
    setIsLoading(true);
    try {
      const payload: UpdateMyBusinessRequest = {
        imageUrl: cleanValue(formData.imageUrl),
        name: cleanValue(formData.name),
        description: cleanValue(formData.description),
        phone: cleanValue(formData.phone),
        address: cleanValue(formData.address),
        businessType: cleanValue(formData.businessType),
        facebookUrl: cleanValue(formData.facebookUrl),
        instagramUrl: cleanValue(formData.instagramUrl),
        telegramUrl: cleanValue(formData.telegramUrl),
        usdToKhrRate: cleanValue(formData.usdToKhrRate),
        taxRate: cleanValue(formData.taxRate),
      };

      const response = await updateMyBusinessService(payload);
      setBusinessData(response);
      setIsEditing(false);

      AppToast({
        type: "success",
        message: "Business information updated successfully",
        duration: 3000,
        position: "top-right",
      });
    } catch (error) {
      AppToast({
        type: "error",
        message: "Failed to update business information",
        duration: 3000,
        position: "top-right",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getSubscriptionStatus = () => {
    if (!businessData?.hasActiveSubscription) {
      return { color: "bg-red-100 text-red-800", text: "Inactive" };
    }
    if (businessData?.daysRemaining <= 7) {
      return { color: "bg-yellow-100 text-yellow-800", text: "Expiring Soon" };
    }
    return { color: "bg-green-100 text-green-800", text: "Active" };
  };

  return (
    <div className="p-2 space-y-2 min-h-screen">
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardHeaderSection
          breadcrumbs={[
            { label: "Dashboard", href: ROUTES.DASHBOARD.INDEX },
            { label: "My Business", href: "" },
          ]}
          title="My Business"
          customAddNewButton={
            <div>
              {isEditing ? (
                <div className="flex gap-2 flex-row">
                  <Button
                    type="button"
                    variant="outline"
                    className="hover:bg-none"
                    onClick={handleCancel}
                    disabled={isLoading}
                  >
                    <X className="w-4 h-4 mr-2" />
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isLoading}>
                    <Save className="w-4 h-4 mr-2" />
                    {isLoading ? "Saving..." : "Save Changes"}
                  </Button>
                </div>
              ) : (
                <Button
                  type="button"
                  onClick={handleEdit}
                  className="text-white border-0 flex gap-2 font-medium transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-pink-500/25 group"
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Business
                </Button>
              )}
            </div>
          }
        />

        <div className="grid grid-cols-1 mt-4 lg:grid-cols-3 gap-4">
          {/* Business Overview */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="w-5 h-5" />
                  Business Overview
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="text-center">
                  {isEditing ? (
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
                  ) : (
                    <Avatar className="w-24 h-24 mx-auto mb-4">
                      <AvatarImage
                        src={getImageSource() || "/placeholder.svg"}
                        alt={businessData?.name}
                      />
                      <AvatarFallback className="text-2xl">
                        {businessData?.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  )}
                </div>

                <div className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-600">
                      Business Name
                    </Label>
                    <p className="text-lg font-semibold text-gray-900">
                      {businessData?.name || "---"}
                    </p>
                  </div>

                  <div>
                    <Label className="text-sm font-medium text-gray-600">
                      Business Type
                    </Label>
                    <div className="flex items-center gap-2 mt-1">
                      <ChefHat className="w-4 h-4 text-gray-500" />
                      <span className="text-gray-900">
                        {businessData?.businessType || "---"}
                      </span>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <Label className="text-sm font-medium text-gray-600">
                      Subscription Status
                    </Label>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge className={getSubscriptionStatus().color}>
                        {getSubscriptionStatus().text}
                      </Badge>
                      {businessData?.hasActiveSubscription && (
                        <span className="text-sm text-gray-600">
                          {businessData?.daysRemaining || "---"} days left
                        </span>
                      )}
                    </div>
                  </div>

                  <div>
                    <Label className="text-sm font-medium text-gray-600">
                      Current Plan
                    </Label>
                    <p className="text-gray-900 font-medium">
                      {businessData?.currentPlan || "---"}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Business Name</Label>
                    {isEditing ? (
                      <Controller
                        control={control}
                        name="name"
                        render={({ field }) => (
                          <Input
                            {...field}
                            id="name"
                            type="text"
                            autoFocus
                            disabled={isSubmitting}
                            autoComplete="name"
                          />
                        )}
                      />
                    ) : (
                      <p className="mt-1 text-gray-900">
                        {businessData?.name || "---"}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="businessType">Business Type</Label>
                    {isEditing ? (
                      <Controller
                        control={control}
                        name="businessType"
                        render={({ field }) => (
                          <Input
                            {...field}
                            id="businessType"
                            type="text"
                            autoFocus
                            disabled={isSubmitting}
                            autoComplete="businessType"
                          />
                        )}
                      />
                    ) : (
                      <p className="mt-1 text-gray-900">
                        {businessData?.businessType || "---"}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <Label htmlFor="description">Description</Label>
                  {isEditing ? (
                    <Controller
                      control={control}
                      name="description"
                      render={({ field }) => (
                        <Textarea
                          {...field}
                          id="description"
                          autoFocus
                          disabled={isSubmitting}
                          autoComplete="description"
                          rows={3}
                        />
                      )}
                    />
                  ) : (
                    <p className="mt-1 text-gray-900">
                      {businessData?.description || "---"}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    {isEditing ? (
                      <Controller
                        control={control}
                        name="phone"
                        render={({ field }) => (
                          <Input
                            {...field}
                            id="phone"
                            type="text"
                            autoFocus
                            disabled={isSubmitting}
                            autoComplete="phone"
                          />
                        )}
                      />
                    ) : (
                      <div className="flex items-center gap-2 mt-1">
                        <Phone className="w-4 h-4 text-gray-500" />
                        <span className="text-gray-900">
                          {businessData?.phone || "---"}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <Label htmlFor="address">Address</Label>
                  {isEditing ? (
                    <Controller
                      control={control}
                      name="address"
                      render={({ field }) => (
                        <Textarea
                          {...field}
                          id="address"
                          autoFocus
                          disabled={isSubmitting}
                          autoComplete="address"
                          rows={2}
                        />
                      )}
                    />
                  ) : (
                    <div className="flex items-start gap-2 mt-1">
                      <MapPin className="w-4 h-4 text-gray-500 mt-0.5" />
                      <span className="text-gray-900">
                        {businessData?.address || "---"}
                      </span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Social Media */}
            <Card>
              <CardHeader>
                <CardTitle>Social Media</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="facebookUrl">Facebook URL</Label>
                    {isEditing ? (
                      <Controller
                        control={control}
                        name="facebookUrl"
                        render={({ field }) => (
                          <Input
                            {...field}
                            id="facebookUrl"
                            type="text"
                            autoFocus
                            disabled={isSubmitting}
                            autoComplete="facebookUrl"
                          />
                        )}
                      />
                    ) : (
                      <div className="flex items-center gap-2 mt-1">
                        <img
                          src={AppIcons.Facebook}
                          alt="Facebook Icon"
                          className="h-4 w-4 mr-3 sm:mr-5 text-muted-foreground"
                        />{" "}
                        <a
                          href={businessData?.facebookUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          Facebook Page
                        </a>
                      </div>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="instagramUrl">Instagram URL</Label>
                    {isEditing ? (
                      <Controller
                        control={control}
                        name="instagramUrl"
                        render={({ field }) => (
                          <Input
                            {...field}
                            id="instagramUrl"
                            type="text"
                            autoFocus
                            disabled={isSubmitting}
                            autoComplete="instagramUrl"
                          />
                        )}
                      />
                    ) : (
                      <div className="flex items-center gap-2 mt-1">
                        <img
                          src={AppIcons.Instagram}
                          alt="Instagram Icon"
                          className="h-4 w-4 mr-3 sm:mr-5 text-muted-foreground"
                        />{" "}
                        <a
                          href={businessData?.instagramUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-pink-600 hover:underline"
                        >
                          Instagram Profile
                        </a>
                      </div>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="telegramUrl">Telegram URL</Label>
                    {isEditing ? (
                      <Controller
                        control={control}
                        name="telegramUrl"
                        render={({ field }) => (
                          <Input
                            {...field}
                            id="telegramUrl"
                            type="text"
                            autoFocus
                            disabled={isSubmitting}
                            autoComplete="telegramUrl"
                          />
                        )}
                      />
                    ) : (
                      <div className="flex items-center gap-2 mt-1">
                        <img
                          src={AppIcons.Telegram}
                          alt="Telegram Icon"
                          className="h-4 w-4 mr-3 sm:mr-5 text-muted-foreground"
                        />{" "}
                        <a
                          href={businessData?.telegramUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-pink-600 hover:underline"
                        >
                          Telegram Profile
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Financial Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="w-5 h-5" />
                  Financial Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="usdToKhrRate">USD to KHR Rate</Label>
                    {isEditing ? (
                      <Controller
                        control={control}
                        name="usdToKhrRate"
                        render={({ field }) => (
                          <Input
                            {...field}
                            id="usdToKhrRate"
                            type="text"
                            autoFocus
                            disabled={isSubmitting}
                            autoComplete="usdToKhrRate"
                            onChange={(e) => {
                              field.onChange(Number(e.target.value));
                            }}
                          />
                        )}
                      />
                    ) : (
                      <p className="mt-1 text-lg font-semibold text-gray-900">
                        {businessData?.usdToKhrRate.toLocaleString()} KHR
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="taxRate">Tax Rate (%)</Label>
                    {isEditing ? (
                      <Controller
                        control={control}
                        name="taxRate"
                        render={({ field }) => (
                          <Input
                            {...field}
                            id="taxRate"
                            type="text"
                            autoFocus
                            disabled={isSubmitting}
                            autoComplete="taxRate"
                            onChange={(e) =>
                              field.onChange(Number(e.target.value))
                            }
                          />
                        )}
                      />
                    ) : (
                      <div className="flex items-center gap-1 mt-1">
                        <Percent className="w-4 h-4 text-gray-500" />
                        <span className="text-lg font-semibold text-gray-900">
                          {businessData?.taxRate}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Subscription Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  Subscription Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-600">
                      Current Plan
                    </Label>
                    <p className="text-lg font-semibold text-gray-900">
                      {businessData?.currentPlan}
                    </p>
                  </div>

                  <div>
                    <Label className="text-sm font-medium text-gray-600">
                      Status
                    </Label>
                    <div className="mt-1">
                      <Badge className={getSubscriptionStatus().color}>
                        {getSubscriptionStatus().text}
                      </Badge>
                    </div>
                  </div>

                  <div>
                    <Label className="text-sm font-medium text-gray-600">
                      Days Remaining
                    </Label>
                    <p className="text-lg font-semibold text-gray-900">
                      {businessData?.daysRemaining} days
                    </p>
                  </div>

                  <div>
                    <Label className="text-sm font-medium text-gray-600">
                      Subscription End Date
                    </Label>
                    <div className="flex items-center gap-2 mt-1">
                      <Calendar className="w-4 h-4 text-gray-500" />
                      <span className="text-gray-900">
                        {businessData?.subscriptionEndDate || "---"}
                      </span>
                    </div>
                  </div>
                </div>

                {typeof businessData?.daysRemaining === "number" &&
                  businessData.daysRemaining <= 7 &&
                  businessData?.hasActiveSubscription && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                      <div className="flex items-start gap-3">
                        <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-yellow-800">
                            Subscription Expiring Soon
                          </p>
                          <p className="text-sm text-yellow-700 mt-1">
                            Your subscription will expire in{" "}
                            {businessData?.daysRemaining} days. Please renew to
                            continue using all features.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </div>
  );
}
