"use client";

import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import {
  Building2,
  Edit,
  Save,
  X,
  Upload,
  Globe,
  Phone,
  MapPin,
  Clock,
  Facebook,
  Instagram,
  MessageCircle,
  DollarSign,
  Percent,
  CreditCard,
  Shield,
  Calendar,
  ChefHat,
  CheckCircle,
  AlertTriangle,
} from "lucide-react";
import { MyBusinessModel } from "@/models/dashboard/user/business-user/business-user.response.model";
import {
  getMyBusinessService,
  updateMyBusinessService,
} from "@/services/dashboard/user/business.user.service";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  MyBusinessFormData,
  updateMyBusinessSchema,
} from "@/models/dashboard/user/business-user/business-user.schema";
import { CardHeaderSection } from "@/components/layout/main/card-header-section";
import { ROUTES } from "@/constants/AppRoutes/routes";

export default function BusinessPage() {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [businessData, setBusinessData] = useState<MyBusinessModel | null>(
    null
  );

  const { handleSubmit, control } = useForm<MyBusinessFormData>({
    resolver: zodResolver(updateMyBusinessSchema),
    defaultValues: {
      logoUrl: "",
      name: "",
      description: "",
      phone: "",
      address: "",
      website: "",
      businessType: undefined,
      cuisineType: undefined,
      operatingHours: "",
      facebookUrl: "",
      instagramUrl: "",
      telegramContact: "",
      usdToKhrRate: undefined,
      taxRate: undefined,
      serviceChargeRate: undefined,
      acceptsOnlinePayment: false,
      acceptsCashPayment: false,
      acceptsBankTransfer: false,
      acceptsMobilePayment: false,
    },
  });

  const loadMyBusiness = useCallback(async () => {
    try {
      const response = await getMyBusinessService();
      setBusinessData(response);
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
    setIsEditing(false);
  };

  const onSubmit = async (formData: MyBusinessFormData) => {
    setIsLoading(true);
    try {
      const payload: MyBusinessFormData = {
        logoUrl: formData.logoUrl?.trim(),
        name: formData.name?.trim(),
        description: formData.description?.trim(),
        phone: formData.phone?.trim(),
        address: formData.address?.trim(),
        website: formData.website?.trim(),

        businessType: formData.businessType,
        cuisineType: formData.cuisineType,
        operatingHours: formData.operatingHours?.trim(),

        facebookUrl: formData.facebookUrl?.trim(),
        instagramUrl: formData.instagramUrl?.trim(),
        telegramContact: formData.telegramContact?.trim(),

        usdToKhrRate: formData.usdToKhrRate,
        taxRate: formData.taxRate,
        serviceChargeRate: formData.serviceChargeRate,

        acceptsOnlinePayment: formData.acceptsOnlinePayment,
        acceptsCashPayment: formData.acceptsCashPayment,
        acceptsBankTransfer: formData.acceptsBankTransfer,
        acceptsMobilePayment: formData.acceptsMobilePayment,
      };

      await updateMyBusinessService(payload);
      setIsEditing(false);
      toast.success("Business information updated successfully");
    } catch (error) {
      toast.error("Failed to update business information");
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
                  <Button disabled={isLoading}>
                    <Save className="w-4 h-4 mr-2" />
                    {isLoading ? "Saving..." : "Save Changes"}
                  </Button>
                </div>
              ) : (
                <Button
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
                  <Avatar className="w-24 h-24 mx-auto mb-4">
                    <AvatarImage
                      src={businessData?.logoUrl || "/placeholder.svg"}
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
                  {isEditing && (
                    <Button variant="outline" size="sm">
                      <Upload className="w-4 h-4 mr-2" />
                      Change Logo
                    </Button>
                  )}
                </div>

                <div className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-600">
                      Business Name
                    </Label>
                    <p className="text-lg font-semibold text-gray-900">
                      {businessData?.name}
                    </p>
                  </div>

                  <div>
                    <Label className="text-sm font-medium text-gray-600">
                      Business Type
                    </Label>
                    <div className="flex items-center gap-2 mt-1">
                      <ChefHat className="w-4 h-4 text-gray-500" />
                      <span className="text-gray-900">
                        {businessData?.businessType}
                      </span>
                    </div>
                  </div>

                  <div>
                    <Label className="text-sm font-medium text-gray-600">
                      Cuisine Type
                    </Label>
                    <p className="text-gray-900">{businessData?.cuisineType}</p>
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
                          {businessData?.daysRemaining} days left
                        </span>
                      )}
                    </div>
                  </div>

                  <div>
                    <Label className="text-sm font-medium text-gray-600">
                      Current Plan
                    </Label>
                    <p className="text-gray-900 font-medium">
                      {businessData?.currentPlan}
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
                        render={({ field }) => <Input id="name" {...field} />}
                      />
                    ) : (
                      <p className="mt-1 text-gray-900">{businessData?.name}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="businessType">Business Type</Label>
                    {isEditing ? (
                      <Controller
                        control={control}
                        name="businessType"
                        render={({ field }) => (
                          <Input id="businessType" {...field} />
                        )}
                      />
                    ) : (
                      <p className="mt-1 text-gray-900">
                        {businessData?.businessType}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="cuisineType">Cuisine Type</Label>
                    {isEditing ? (
                      <Controller
                        control={control}
                        name="cuisineType"
                        render={({ field }) => (
                          <Input id="cuisineType" {...field} />
                        )}
                      />
                    ) : (
                      <p className="mt-1 text-gray-900">
                        {businessData?.cuisineType}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="operatingHours">Operating Hours</Label>
                    {isEditing ? (
                      <Controller
                        control={control}
                        name="operatingHours"
                        render={({ field }) => (
                          <Input id="operatingHours" {...field} />
                        )}
                      />
                    ) : (
                      <div className="flex items-center gap-2 mt-1">
                        <Clock className="w-4 h-4 text-gray-500" />
                        <span className="text-gray-900">
                          {businessData?.operatingHours}
                        </span>
                      </div>
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
                        <Textarea id="description" {...field} rows={3} />
                      )}
                    />
                  ) : (
                    <p className="mt-1 text-gray-900">
                      {businessData?.description}
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
                        render={({ field }) => <Input id="phone" {...field} />}
                      />
                    ) : (
                      <div className="flex items-center gap-2 mt-1">
                        <Phone className="w-4 h-4 text-gray-500" />
                        <span className="text-gray-900">
                          {businessData?.phone}
                        </span>
                      </div>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="website">Website</Label>
                    {isEditing ? (
                      <Controller
                        control={control}
                        name="website"
                        render={({ field }) => (
                          <Input id="website" {...field} />
                        )}
                      />
                    ) : (
                      <div className="flex items-center gap-2 mt-1">
                        <Globe className="w-4 h-4 text-gray-500" />
                        <a
                          href={businessData?.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          {businessData?.website}
                        </a>
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
                        <Textarea id="address" {...field} rows={2} />
                      )}
                    />
                  ) : (
                    <div className="flex items-start gap-2 mt-1">
                      <MapPin className="w-4 h-4 text-gray-500 mt-0.5" />
                      <span className="text-gray-900">
                        {businessData?.address}
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
                          <Input id="facebookUrl" {...field} />
                        )}
                      />
                    ) : (
                      <div className="flex items-center gap-2 mt-1">
                        <Facebook className="w-4 h-4 text-blue-600" />
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
                          <Input id="instagramUrl" {...field} />
                        )}
                      />
                    ) : (
                      <div className="flex items-center gap-2 mt-1">
                        <Instagram className="w-4 h-4 text-pink-600" />
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
                    <Label htmlFor="telegramContact">Telegram Contact</Label>
                    {isEditing ? (
                      <Controller
                        control={control}
                        name="telegramContact"
                        render={({ field }) => (
                          <Input id="telegramContact" {...field} />
                        )}
                      />
                    ) : (
                      <div className="flex items-center gap-2 mt-1">
                        <MessageCircle className="w-4 h-4 text-blue-500" />
                        <span className="text-gray-900">
                          {businessData?.telegramContact}
                        </span>
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
                          <Input id="usdToKhrRate" type="number" {...field} />
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
                          <Input id="taxRate" type="number" {...field} />
                        )}
                      />
                    ) : (
                      <div className="flex items-center gap-1 mt-1">
                        <Percent className="w-4 h-4 text-gray-500" />
                        <span className="text-lg font-semibold text-gray-900">
                          {businessData?.taxRate}%
                        </span>
                      </div>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="serviceChargeRate">
                      Service Charge (%)
                    </Label>
                    {isEditing ? (
                      <Controller
                        control={control}
                        name="serviceChargeRate"
                        render={({ field }) => (
                          <Input
                            id="serviceChargeRate"
                            type="number"
                            {...field}
                          />
                        )}
                      />
                    ) : (
                      <div className="flex items-center gap-1 mt-1">
                        <Percent className="w-4 h-4 text-gray-500" />
                        <span className="text-lg font-semibold text-gray-900">
                          {businessData?.serviceChargeRate}%
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Payment Methods */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5" />
                  Payment Methods
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Online Payment</span>
                    {isEditing ? (
                      <Controller
                        control={control}
                        name="acceptsOnlinePayment"
                        render={({ field }) => (
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            disabled={field.disabled}
                            name={field.name}
                            ref={field.ref}
                          />
                        )}
                      />
                    ) : (
                      <div className="flex items-center gap-1">
                        {businessData?.acceptsOnlinePayment ? (
                          <CheckCircle className="w-4 h-4 text-green-600" />
                        ) : (
                          <X className="w-4 h-4 text-red-600" />
                        )}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Cash Payment</span>
                    {isEditing ? (
                      <Controller
                        control={control}
                        name="acceptsCashPayment"
                        render={({ field }) => (
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            disabled={field.disabled}
                            name={field.name}
                            ref={field.ref}
                          />
                        )}
                      />
                    ) : (
                      <div className="flex items-center gap-1">
                        {businessData?.acceptsCashPayment ? (
                          <CheckCircle className="w-4 h-4 text-green-600" />
                        ) : (
                          <X className="w-4 h-4 text-red-600" />
                        )}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Bank Transfer</span>
                    {isEditing ? (
                      <Controller
                        control={control}
                        name="acceptsBankTransfer"
                        render={({ field }) => (
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            disabled={field.disabled}
                            name={field.name}
                            ref={field.ref}
                          />
                        )}
                      />
                    ) : (
                      <div className="flex items-center gap-1">
                        {businessData?.acceptsBankTransfer ? (
                          <CheckCircle className="w-4 h-4 text-green-600" />
                        ) : (
                          <X className="w-4 h-4 text-red-600" />
                        )}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Mobile Payment</span>
                    {isEditing ? (
                      <Controller
                        control={control}
                        name="acceptsMobilePayment"
                        render={({ field }) => (
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            disabled={field.disabled}
                            name={field.name}
                            ref={field.ref}
                          />
                        )}
                      />
                    ) : (
                      <div className="flex items-center gap-1">
                        {businessData?.acceptsMobilePayment ? (
                          <CheckCircle className="w-4 h-4 text-green-600" />
                        ) : (
                          <X className="w-4 h-4 text-red-600" />
                        )}
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
                        {formatDate(businessData?.subscriptionEndDate || "---")}
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
