"use client";

import type React from "react";

import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Building2,
  User,
  CreditCard,
  Package,
  CheckCircle,
  ArrowLeft,
  ArrowRight,
  AlertCircle,
  Loader2,
  Users,
  Crown,
} from "lucide-react";
import { Controller, useForm, useWatch } from "react-hook-form";
import {
  BusinessOwnerCreateRequestSchema,
  BusinessOwnerFormData,
} from "@/models/dashboard/user/business-owner/business-owner.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { createBusinessOwnerService } from "@/services/dashboard/user/business-owner/business-owner.service";
import { CreateBusinessOwnerRequest } from "@/models/dashboard/user/business-owner/business-owner.request.model";
import { AppToast } from "@/components/shared/toast/app-toast";
import { getAllSubscriptionPlanService } from "@/services/dashboard/master-data/subscrion-plan/subscription-plan.service";
import {
  AllSubscriptionPlan,
  SubscriptionPlanModel,
} from "@/models/dashboard/master-data/subscription-plan/subscription-plan-response";
import { Skeleton } from "@/components/ui/skeleton";
import {
  paymentMethodOptions,
  PaymentStatus,
} from "@/constants/AppResource/status/payment";
import { UploadImageRequest } from "@/models/dashboard/image/image.request.model";
import { uploadImageService } from "@/services/dashboard/image/image.service";

interface FormErrors {
  [key: string]: string;
}

const steps = [
  {
    id: 1,
    title: "Owner Details",
    description: "Tell us about yourself",
    icon: User,
  },
  {
    id: 2,
    title: "Business Info",
    description: "Your business details",
    icon: Building2,
  },
  {
    id: 3,
    title: "Plan & Payment",
    description: "Choose your plan",
    icon: Package,
  },
];

export default function BusinessRegistrationForm() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isPlanLoading, setIsPlanLoading] = useState(false);
  const [plans, setPlans] = useState<AllSubscriptionPlan | null>(null);
  const [selectedPlan, setSelectedPlan] =
    useState<SubscriptionPlanModel | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const {
    control,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
    setError,
    getValues,
    setValue,
  } = useForm<BusinessOwnerFormData>({
    resolver: zodResolver(BusinessOwnerCreateRequestSchema),
    defaultValues: {
      autoRenew: false,
      businessAddress: "",
      businessDescription: "",
      businessEmail: "",
      businessName: "",
      businessPhone: "",
      ownerAddress: "",
      ownerEmail: "",
      ownerFirstName: "",
      ownerLastName: "",
      ownerPassword: "",
      ownerPhone: "",
      ownerUserIdentifier: "",
      paymentAmount: 0,
      paymentImageUrl: "",
      paymentMethod: "",
      paymentNotes: "",
      paymentReferenceNumber: "",
      paymentStatus: "",
      preferredSubdomain: "",
      subscriptionPlanId: "",
      subscriptionStartDate: "",
    },
  });

  console.log(errors); // check if something is invalid

  watch("subscriptionPlanId");
  const subdomain = useWatch({ control, name: "preferredSubdomain" });

  // Clean up blob URLs
  useEffect(() => {
    return () => {
      if (imagePreview?.startsWith("blob:")) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

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
          setValue(
            "paymentImageUrl",
            process.env.NEXT_PUBLIC_API_BASE_URL + response?.imageUrl,
            {
              shouldValidate: true,
            }
          );
          console.log(
            "Image Preview URL:",
            process.env.NEXT_PUBLIC_API_BASE_URL + response.imageUrl
          );

          setImagePreview(response?.imageUrl);
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
    setImagePreview(null);
    setValue("paymentImageUrl", "", { shouldDirty: true });
  };

  const getImageSource = () => {
    return imagePreview?.startsWith("http")
      ? imagePreview
      : (process.env.NEXT_PUBLIC_API_BASE_URL ?? "") + imagePreview;
  };

  const loadPlan = useCallback(async () => {
    setIsPlanLoading(true);
    try {
      const response = await getAllSubscriptionPlanService({
        pageNo: 1,
        pageSize: 10,
        publicOnly: true,
      });
      setPlans(response);
    } catch (error: any) {
      console.log("error to load plan", error.message);
    } finally {
      setIsPlanLoading(false);
    }
  }, []);

  useEffect(() => {
    console.log(errors); // check if something is invalid

    loadPlan();
    console.log("Validation failed", validateStep(3));
  }, [loadPlan]);

  const validateStep = (step: number) => {
    const stepErrors: FormErrors = {};

    if (step === 1) {
      if (!getValues("ownerFirstName"))
        stepErrors.ownerFirstName = "First name is required";
      if (!getValues("ownerLastName"))
        stepErrors.ownerLastName = "Last name is required";
      if (!getValues("ownerEmail")) stepErrors.ownerEmail = "Email is required";
      if (!getValues("ownerPassword"))
        stepErrors.ownerPassword = "Password is required";
    }

    if (step === 2) {
      if (!getValues("businessName"))
        stepErrors.businessName = "Business name is required";
      if (!getValues("preferredSubdomain"))
        stepErrors.preferredSubdomain = "Subdomain is required";
    }

    if (step === 3) {
      if (!getValues("subscriptionPlanId"))
        stepErrors.subscriptionPlanId = "Please select a subscription plan";
      if (!getValues("paymentMethod"))
        stepErrors.paymentMethod = "Please select a payment method";
    }

    if (Object.keys(stepErrors).length > 0) {
      // Optional: show errors using setError from react-hook-form
      Object.entries(stepErrors).forEach(([field, message]) => {
        setError(field as keyof BusinessOwnerFormData, {
          type: "manual",
          message,
        });
      });
      return false;
    }
    return true;
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, steps.length));
    }
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const trimString = (val?: string) =>
    typeof val === "string" ? val.trim() : undefined;

  const onSubmit = async (e: BusinessOwnerFormData) => {
    if (!validateStep(3)) return;
    console.log("Validation failed", validateStep(3));

    setIsLoading(true);
    try {
      const payload: CreateBusinessOwnerRequest = {
        businessName: trimString(e.businessName)!,
        ownerFirstName: trimString(e.ownerFirstName)!,
        ownerLastName: trimString(e.ownerLastName)!,
        ownerPassword: trimString(e.ownerPassword)!,
        ownerUserIdentifier: trimString(e.ownerUserIdentifier)!,
        preferredSubdomain: trimString(e.preferredSubdomain)!,
        autoRenew: e.autoRenew,
        businessAddress: trimString(e.businessAddress),
        businessDescription: trimString(e.businessDescription),
        businessEmail: trimString(e.businessEmail) || undefined,
        businessPhone: trimString(e.businessPhone) || undefined,
        ownerAddress: trimString(e.ownerAddress),
        ownerEmail: trimString(e.ownerEmail) || undefined,
        ownerPhone: trimString(e.ownerPhone) || undefined,
        paymentAmount: selectedPlan?.price === 0 ? undefined : e.paymentAmount,
        paymentImageUrl: trimString(e.paymentImageUrl),
        paymentInfoComplete: true,
        paymentMethod: trimString(e.paymentMethod),
        paymentNotes: trimString(e.paymentNotes),
        paymentReferenceNumber: trimString(e.paymentReferenceNumber),
        paymentStatus: e.paymentStatus || PaymentStatus.PENDING,
        subscriptionPlanId: trimString(e.subscriptionPlanId),
        subscriptionStartDate: e.subscriptionStartDate || undefined,
      };

      const response = await createBusinessOwnerService(payload);

      AppToast({
        type: "success",
        message: `Owner ${
          response.ownerUserIdentifier || response.ownerUserIdentifier
        } added successfully`,
        duration: 4000,
        position: "top-right",
      });
    } catch (error: any) {
      console.error("Fail to save business user", error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectedPlan = (plan: SubscriptionPlanModel) => {
    setSelectedPlan(plan);
    console.log("PlanId: ", plan.id);
    setValue("subscriptionPlanId", plan.id);
    setValue("paymentAmount", plan.price);
  };

  const progress = (currentStep / steps.length) * 100;

  // Helper function to get plan popularity
  const getPlanPopularity = (plan: SubscriptionPlanModel) => {
    const activeCounts =
      plans?.content?.map((p) => p.activeSubscriptionsCount) ?? [];
    const maxSubscriptions = Math.max(...activeCounts);

    if (plan.activeSubscriptionsCount === maxSubscriptions)
      return "Most Popular";
    if (plan.isFree) return "Free";
    if (plan.price < 50) return "Best Value";
    return null;
  };

  // Helper function to format duration
  const formatDuration = (days: number) => {
    if (days === 30) return "month";
    if (days === 365) return "year";
    if (days === 7) return "week";
    return `${days} days`;
  };

  return (
    <div className="bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
            Start Your Business Journey
          </h1>
          <p className="text-lg text-gray-600">
            Join thousands of successful businesses on our platform
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4 overflow-x-auto">
            {steps.map((step, index) => (
              <div
                key={step.id}
                className="flex items-center min-w-0 flex-shrink-0"
              >
                <div
                  className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                    currentStep >= step.id
                      ? "bg-primary border-primary text-white"
                      : "bg-white border-gray-300 text-gray-400"
                  }`}
                >
                  {currentStep > step.id ? (
                    <CheckCircle className="w-6 h-6" />
                  ) : (
                    <step.icon className="w-5 h-5" />
                  )}
                </div>
                <div className="ml-3 hidden sm:block flex-1 min-w-0">
                  <p
                    className={`text-sm font-medium truncate ${
                      currentStep >= step.id ? "text-blue-600" : "text-gray-400"
                    }`}
                  >
                    {step.title}
                  </p>
                  <p className="text-xs text-gray-500 truncate">
                    {step.description}
                  </p>
                </div>
                {/* Connection line between steps */}
                {index < steps.length - 1 && (
                  <div
                    className={`hidden sm:block w-8 h-0.5 mx-4 ${
                      currentStep > step.id ? "bg-primary" : "bg-gray-300"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* FIXED: Removed overflow constraints from form container */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Step 1: Owner Information */}
          {currentStep === 1 && (
            <Card className="shadow-lg border-0">
              <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-t-lg">
                <CardTitle className="flex items-center gap-2 text-xl">
                  <User className="h-6 w-6" />
                  Tell us about yourself
                </CardTitle>
                <CardDescription className="text-blue-100">
                  We need some basic information to get started
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6 sm:p-8 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="firstName" className="text-sm font-medium">
                      First Name <span className="text-red-500">*</span>
                    </Label>
                    <Controller
                      control={control}
                      name="ownerFirstName"
                      render={({ field }) => (
                        <Input
                          {...field}
                          id="firstName"
                          placeholder="john"
                          type="text"
                          className="w-full"
                        />
                      )}
                    />
                    {errors.ownerFirstName && (
                      <p className="text-sm text-red-500 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4 flex-shrink-0" />
                        {errors.ownerFirstName.message}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName" className="text-sm font-medium">
                      Last Name <span className="text-red-500">*</span>
                    </Label>
                    <Controller
                      control={control}
                      name="ownerLastName"
                      render={({ field }) => (
                        <Input
                          {...field}
                          id="lastName"
                          placeholder="doe"
                          type="text"
                          className="w-full"
                        />
                      )}
                    />
                    {errors.ownerLastName && (
                      <p className="text-sm text-red-500 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4 flex-shrink-0" />
                        {errors.ownerLastName.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="ownerEmail" className="text-sm font-medium">
                      Email <span className="text-red-500">*</span>
                    </Label>
                    <Controller
                      control={control}
                      name="ownerEmail"
                      render={({ field }) => (
                        <Input
                          {...field}
                          id="ownerEmail"
                          type="email"
                          placeholder="your@email.com"
                          className="w-full"
                        />
                      )}
                    />
                    {errors.ownerEmail && (
                      <p className="text-sm text-red-500 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4 flex-shrink-0" />
                        {errors.ownerEmail.message}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-sm font-medium">
                      Password <span className="text-red-500">*</span>
                    </Label>
                    <Controller
                      control={control}
                      name="ownerPassword"
                      render={({ field }) => (
                        <Input
                          {...field}
                          id="password"
                          placeholder="Create a secure password"
                          type="password"
                          className="w-full"
                        />
                      )}
                    />
                    {errors.ownerPassword && (
                      <p className="text-sm text-red-500 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4 flex-shrink-0" />
                        {errors.ownerPassword.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="ownerPhone" className="text-sm font-medium">
                      Phone Number <span className="text-red-500">*</span>
                    </Label>
                    <Controller
                      control={control}
                      name="ownerPhone"
                      render={({ field }) => (
                        <Input
                          {...field}
                          id="ownerPhone"
                          placeholder="+1 (555) 123-4567"
                          type="tel"
                          className="w-full"
                        />
                      )}
                    />
                    {errors.ownerPhone && (
                      <p className="text-sm text-red-500 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4 flex-shrink-0" />
                        {errors.ownerPhone.message}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label
                      htmlFor="ownerUserIdentifier"
                      className="text-sm font-medium"
                    >
                      Username <span className="text-red-500">*</span>
                    </Label>
                    <Controller
                      control={control}
                      name="ownerUserIdentifier"
                      render={({ field }) => (
                        <Input
                          {...field}
                          id="ownerUserIdentifier"
                          placeholder="Choose a username"
                          type="text"
                          className="w-full"
                        />
                      )}
                    />
                    {errors.ownerUserIdentifier && (
                      <p className="text-sm text-red-500 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4 flex-shrink-0" />
                        {errors.ownerUserIdentifier.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="ownerAddress" className="text-sm font-medium">
                    Address (Optional)
                  </Label>
                  <Controller
                    control={control}
                    name="ownerAddress"
                    render={({ field }) => (
                      <Textarea
                        {...field}
                        id="ownerAddress"
                        placeholder="Your full address"
                        rows={3}
                        className="w-full resize-none"
                      />
                    )}
                  />
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 2: Business Information */}
          {currentStep === 2 && (
            <Card className="shadow-lg border-0">
              <CardHeader className="bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-t-lg">
                <CardTitle className="flex items-center gap-2 text-xl">
                  <Building2 className="h-6 w-6" />
                  Business Information
                </CardTitle>
                <CardDescription className="text-green-100">
                  Tell us about your business
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6 sm:p-8 space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="businessName" className="text-sm font-medium">
                    Business Name <span className="text-red-500">*</span>
                  </Label>
                  <Controller
                    control={control}
                    name="businessName"
                    render={({ field }) => (
                      <Input
                        {...field}
                        id="businessName"
                        placeholder="Your amazing business name"
                        type="text"
                        className="w-full"
                      />
                    )}
                  />
                  {errors.businessName && (
                    <p className="text-sm text-red-500 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4 flex-shrink-0" />
                      {errors.businessName.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="preferredSubdomain"
                    className="text-sm font-medium"
                  >
                    Your Website URL <span className="text-red-500">*</span>
                  </Label>
                  <div className="flex items-center w-full">
                    <span className="bg-gray-100 border border-r-0 rounded-l-md px-3 py-2 text-sm text-gray-600 whitespace-nowrap">
                      https://
                    </span>
                    <Controller
                      control={control}
                      name="preferredSubdomain"
                      render={({ field }) => (
                        <Input
                          {...field}
                          id="preferredSubdomain"
                          placeholder="yoursite"
                          className={`rounded-none flex-1 min-w-0 ${
                            errors.preferredSubdomain ? "border-red-500" : ""
                          }`}
                        />
                      )}
                    />
                    <span className="bg-gray-100 border border-l-0 rounded-r-md px-3 py-2 text-sm text-gray-600 whitespace-nowrap">
                      .cms.com
                    </span>
                  </div>
                  {errors.preferredSubdomain && (
                    <p className="text-sm text-red-500 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4 flex-shrink-0" />
                      {errors.preferredSubdomain.message}
                    </p>
                  )}
                  {subdomain && !errors.preferredSubdomain && (
                    <p className="text-sm text-green-600">
                      ✓ Your website will be: https://
                      <strong>{subdomain}</strong>.cms.com
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                  <div className="space-y-2">
                    <Label
                      htmlFor="businessEmail"
                      className="text-sm font-medium"
                    >
                      Email <span className="text-red-500">*</span>
                    </Label>
                    <Controller
                      control={control}
                      name="businessEmail"
                      render={({ field }) => (
                        <Input
                          {...field}
                          id="businessEmail"
                          placeholder="contact@yourbusiness.com"
                          type="email"
                          className="w-full"
                        />
                      )}
                    />
                    {errors.businessEmail && (
                      <p className="text-sm text-red-500 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4 flex-shrink-0" />
                        {errors.businessEmail.message}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label
                      htmlFor="businessPhone"
                      className="text-sm font-medium"
                    >
                      Contact <span className="text-red-500">*</span>
                    </Label>
                    <Controller
                      control={control}
                      name="businessPhone"
                      render={({ field }) => (
                        <Input
                          {...field}
                          id="businessPhone"
                          placeholder="+1 (555) 987-6543"
                          type="tel"
                          className={`w-full ${
                            errors.businessPhone ? "border-red-500" : ""
                          }`}
                        />
                      )}
                    />
                    {errors.businessPhone && (
                      <p className="text-sm text-red-500 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4 flex-shrink-0" />
                        {errors.businessPhone.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="businessAddress"
                    className="text-sm font-medium"
                  >
                    Business Address
                  </Label>
                  <Controller
                    control={control}
                    name="businessAddress"
                    render={({ field }) => (
                      <Textarea
                        {...field}
                        id="businessAddress"
                        placeholder="Your business address"
                        rows={3}
                        className="w-full resize-none"
                      />
                    )}
                  />
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="businessDescription"
                    className="text-sm font-medium"
                  >
                    What does your business do?
                  </Label>
                  <Controller
                    control={control}
                    name="businessDescription"
                    render={({ field }) => (
                      <Textarea
                        {...field}
                        id="businessDescription"
                        placeholder="Describe your business, products, or services..."
                        rows={4}
                        className="w-full resize-none"
                      />
                    )}
                  />
                  <p className="text-xs text-gray-500">
                    This helps us customize your experience and suggest relevant
                    features.
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 3: Subscription & Payment - COMPLETELY FIXED */}
          {currentStep === 3 && (
            <div className="space-y-6">
              {/* Plan Selection */}
              <Card className="shadow-lg border-0">
                <CardHeader className="bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-t-lg">
                  <CardTitle className="flex items-center gap-2 text-xl">
                    <Package className="h-6 w-6" />
                    Choose Your Plan
                  </CardTitle>
                  <CardDescription className="text-purple-100">
                    Select the plan that best fits your needs
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6 sm:p-8">
                  {isPlanLoading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6 mb-6">
                      {[1, 2, 3].map((i) => (
                        <Card key={i} className="p-6">
                          <Skeleton className="h-6 w-32 mb-4" />
                          <Skeleton className="h-8 w-20 mb-4" />
                          <div className="space-y-2">
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-3/4" />
                          </div>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6 mb-6">
                      {plans?.content.map((plan) => {
                        const popularity = getPlanPopularity(plan);
                        return (
                          <div
                            key={plan.id}
                            className={`relative border-2 rounded-lg p-4 sm:p-6 cursor-pointer transition-all ${
                              getValues("subscriptionPlanId") === plan.id
                                ? "border-blue-500 bg-blue-50"
                                : "border-gray-200 hover:border-gray-300"
                            }`}
                            onClick={() => handleSelectedPlan(plan)}
                          >
                            {popularity && (
                              <Badge
                                className={`absolute -top-2 left-4 ${
                                  popularity === "Most Popular"
                                    ? "bg-blue-600"
                                    : popularity === "Free"
                                    ? "bg-green-600"
                                    : "bg-orange-600"
                                }`}
                              >
                                {popularity === "Most Popular" && (
                                  <Crown className="w-3 h-3 mr-1" />
                                )}
                                {popularity}
                              </Badge>
                            )}
                            <div className="text-center mb-4">
                              <h3 className="text-lg font-semibold">
                                {plan.name}
                              </h3>
                              <div className="text-2xl sm:text-3xl font-bold text-blue-600 mt-2">
                                {plan.isFree ? (
                                  "Free"
                                ) : (
                                  <>
                                    ${plan.price}
                                    <span className="text-sm text-gray-500 font-normal">
                                      /{formatDuration(plan.durationDays)}
                                    </span>
                                  </>
                                )}
                              </div>
                              {plan.pricingDisplay &&
                                plan.pricingDisplay !== `$${plan.price}` && (
                                  <p className="text-sm text-gray-600 mt-1">
                                    {plan.pricingDisplay}
                                  </p>
                                )}
                            </div>

                            <div className="mb-4">
                              <p className="text-sm text-gray-600 text-center">
                                {plan.description}
                              </p>
                            </div>

                            <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                              <Users className="w-4 h-4" />
                              <span>
                                {plan.activeSubscriptionsCount} active users
                              </span>
                            </div>

                            {getValues("subscriptionPlanId") === plan.id && (
                              <div className="absolute top-2 right-2">
                                <CheckCircle className="w-6 h-6 text-blue-600" />
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Payment Information - COMPLETELY FIXED */}
              {selectedPlan && (
                <Card className="shadow-lg border-0">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CreditCard className="h-5 w-5" />
                      Payment Details
                    </CardTitle>
                    <CardDescription>
                      Complete your registration with payment information
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-6 sm:p-8 space-y-6">
                    <Alert className="border-blue-200 bg-blue-50">
                      <Package className="h-4 w-4 text-blue-600" />
                      <AlertDescription className="text-blue-800">
                        <strong>{selectedPlan.name}</strong> -{" "}
                        {selectedPlan.pricingDisplay ||
                          `$${selectedPlan.price}/${formatDuration(
                            selectedPlan.durationDays
                          )}`}
                        {getValues("autoRenew") && " (Auto-renewal enabled)"}
                      </AlertDescription>
                    </Alert>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                      <div className="space-y-2">
                        <Controller
                          name="paymentMethod"
                          control={control}
                          defaultValue=""
                          render={({ field: { value, onChange } }) => (
                            <div className="space-y-2">
                              <Label
                                htmlFor="paymentMethod"
                                className="text-sm font-medium"
                              >
                                Payment Method{" "}
                                <span className="text-red-500">*</span>
                              </Label>

                              <Select value={value} onValueChange={onChange}>
                                <SelectTrigger
                                  className={`w-full ${
                                    errors.paymentMethod ? "border-red-500" : ""
                                  }`}
                                >
                                  <SelectValue placeholder="Choose payment method" />
                                </SelectTrigger>
                                <SelectContent>
                                  {paymentMethodOptions.map((item) => (
                                    <SelectItem
                                      key={item.value}
                                      value={item.value}
                                    >
                                      💳 {item.label}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>

                              {errors.paymentMethod && (
                                <p className="text-sm text-red-500 flex items-center gap-1">
                                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                                  {errors.paymentMethod.message ||
                                    "This field is required"}
                                </p>
                              )}
                            </div>
                          )}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label
                          htmlFor="subscriptionStartDate"
                          className="text-sm font-medium"
                        >
                          Start Date <span className="text-red-500">*</span>
                        </Label>
                        <Controller
                          control={control}
                          name="subscriptionStartDate"
                          render={({ field }) => (
                            <Input
                              {...field}
                              id="subscriptionStartDate"
                              type="date"
                              className="w-full"
                            />
                          )}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                      <div className="space-y-2">
                        <Label
                          htmlFor="paymentReferenceNumber"
                          className="text-sm font-medium"
                        >
                          Reference Number
                        </Label>
                        <Controller
                          control={control}
                          name="paymentReferenceNumber"
                          render={({ field }) => (
                            <Input
                              {...field}
                              id="paymentReferenceNumber"
                              placeholder="i.e, kj9475"
                              type="text"
                              className="w-full"
                            />
                          )}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label
                          htmlFor="paymentNotes"
                          className="text-sm font-medium"
                        >
                          Notes
                        </Label>
                        <Controller
                          control={control}
                          name="paymentNotes"
                          render={({ field }) => (
                            <Textarea
                              {...field}
                              id="paymentNotes"
                              placeholder="Note about the payment..."
                              rows={3}
                              className="w-full resize-none"
                            />
                          )}
                        />
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Controller
                        name="autoRenew"
                        control={control}
                        render={({ field: { value, onChange } }) => (
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id="autoRenew"
                              checked={!!value}
                              onCheckedChange={(checked) => onChange(!!checked)}
                            />
                            <Label htmlFor="autoRenew" className="text-sm">
                              Enable auto-renewal (recommended)
                            </Label>
                          </div>
                        )}
                      />
                    </div>

                    {/* COMPLETELY FIXED: Upload section */}
                    <div className="w-full max-w-sm mx-auto">
                      <Card>
                        <CardContent className="p-6">
                          <div className="text-center mb-4">
                            <h3 className="text-lg font-semibold">
                              Upload Payment Receipt
                            </h3>
                            <p className="text-sm text-muted-foreground">
                              Upload a photo or screenshot of your payment
                              receipt
                            </p>
                          </div>

                          <div className="flex justify-center">
                            <div className="relative w-28 h-28">
                              {imagePreview ? (
                                <>
                                  <img
                                    src={getImageSource()}
                                    alt="Payment Receipt"
                                    className="w-full h-full object-cover rounded-xl border border-gray-300 shadow-sm"
                                  />
                                  <button
                                    type="button"
                                    onClick={handleRemoveLogo}
                                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 text-xs flex items-center justify-center hover:bg-red-600 shadow-md"
                                    title="Remove image"
                                  >
                                    ×
                                  </button>
                                </>
                              ) : (
                                <div
                                  onClick={() => fileInputRef.current?.click()}
                                  className="w-full h-full flex flex-col items-center justify-center border-2 border-dashed border-gray-400 rounded-xl cursor-pointer transition-colors hover:border-blue-500 bg-gray-50"
                                >
                                  <span className="text-gray-500 text-3xl leading-none">
                                    +
                                  </span>
                                  <span className="text-xs text-muted-foreground mt-1">
                                    Upload
                                  </span>
                                </div>
                              )}
                              <Input
                                type="file"
                                ref={fileInputRef}
                                accept="image/*"
                                className="hidden"
                                onChange={handleFileChange}
                              />
                            </div>
                          </div>

                          {imagePreview && (
                            <p className="text-xs text-muted-foreground text-center mt-2">
                              Click ❌ to remove
                            </p>
                          )}
                        </CardContent>
                      </Card>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          {/* Navigation */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-8 border-t border-gray-200">
            <Button
              type="button"
              variant="outline"
              onClick={prevStep}
              disabled={currentStep === 1}
              className="flex items-center gap-2 bg-transparent w-full sm:w-auto order-2 sm:order-1"
            >
              <ArrowLeft className="w-4 h-4" />
              Previous
            </Button>

            <div className="text-sm text-gray-500 order-1 sm:order-2">
              Step {currentStep} of {steps.length}
            </div>

            {currentStep < steps.length ? (
              <Button
                type="button"
                onClick={nextStep}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 w-full sm:w-auto order-3"
              >
                Next
                <ArrowRight className="w-4 h-4" />
              </Button>
            ) : (
              <Button
                type="submit"
                disabled={isLoading}
                className="flex items-center gap-2 bg-green-600 hover:bg-green-700 min-w-[140px] w-full sm:w-auto order-3"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4" />
                    Complete Registration
                  </>
                )}
              </Button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
