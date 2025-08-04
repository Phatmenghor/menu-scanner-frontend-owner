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
import {
  MyBusinessFormData,
  updateMyBusinessSchema,
} from "@/models/dashboard/user/business-user/business-user.schema";
import { uploadImageService } from "@/services/dashboard/image/image.service";
import { UploadImageRequest } from "@/models/dashboard/image/image.request.model";
import { Card, CardContent } from "@/components/ui/card";
import z from "zod";

type Props = {
  Data?: MyBusinessFormData | null;
  onClose: () => void;
  isOpen: boolean;
  isSubmitting?: boolean;
  onSave: (data: MyBusinessFormData) => void;
};

export default function ModalBusinessSetting({
  isOpen,
  onClose,
  Data,
  onSave,
  isSubmitting = false,
}: Props) {
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
  } = useForm<z.infer<typeof updateMyBusinessSchema>>({
    resolver: zodResolver(updateMyBusinessSchema),
    defaultValues: {
      logoUrl: "",
      name: "",
      description: "",
      phone: "",
      address: "",
      businessType: "",
      facebookUrl: "",
      instagramUrl: "",
      telegramUrl: "",
      usdToKhrRate: undefined,
      taxRate: undefined,
    },
    mode: "onChange",
  });

  const logoUrl = watch("logoUrl");

  useEffect(() => {
    if (logoUrl) {
      setLogoPreview(logoUrl);
    }
  }, [logoUrl]);

  useEffect(() => {
    reset({
      logoUrl: Data?.logoUrl || "",
      name: Data?.name || "",
      description: Data?.description || "",
      phone: Data?.phone || "",
      address: Data?.address || "",
      businessType: Data?.businessType || "",
      facebookUrl: Data?.facebookUrl || "",
      instagramUrl: Data?.instagramUrl || "",
      telegramUrl: Data?.telegramUrl || "",
      usdToKhrRate: Data?.usdToKhrRate || 0,
      taxRate: Data?.taxRate || 0,
    });
    setLogoPreview(Data?.logoUrl || null);
  }, [Data, reset, isOpen]);

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
          setValue(
            "logoUrl",
            process.env.NEXT_PUBLIC_API_BASE_URL + response?.imageUrl,
            {
              shouldValidate: true,
            }
          );
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
    setValue("logoUrl", "", { shouldDirty: true });
  };

  const getImageSource = () => {
    return logoPreview?.startsWith("http")
      ? logoPreview
      : (process.env.NEXT_PUBLIC_API_BASE_URL ?? "") + logoPreview;
  };

  const onSubmit = (formData: MyBusinessFormData) => {
    console.log("Form submitted Data:", formData); // Debug log

    const cleanValue = (value: any) => {
      if (
        value === null ||
        value === undefined ||
        (typeof value === "string" && value.trim() === "") ||
        value === 0
      ) {
        return undefined;
      }
      return typeof value === "string" ? value.trim() : value;
    };

    const payload: MyBusinessFormData = {
      id: cleanValue(Data?.id),
      logoUrl: cleanValue(formData.logoUrl),
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

    console.log(" Payload:", payload);
    onSave(payload);
    onClose();
  };

  const handleClose = () => {
    reset(); // Reset form when closing
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="w-full max-w-lg md:max-w-xl lg:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Business</DialogTitle>
          <DialogDescription>
            Update Business information below.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* name Field */}
          <div className="space-y-1">
            <Label htmlFor="name">
              Name <span className="text-red-500">*</span>
            </Label>
            <Controller
              control={control}
              name="name"
              render={({ field }) => (
                <Input
                  {...field}
                  id="name"
                  type="text"
                  placeholder="johndoe"
                  disabled={isSubmitting}
                  autoComplete="username"
                  className={errors.name ? "border-red-500" : ""}
                />
              )}
            />
            {errors.name && (
              <p className="text-sm text-destructive">{errors.name.message}</p>
            )}
          </div>

          {/* Phone Number Field */}
          <div className="space-y-1">
            <Label htmlFor="phoneNumber">
              Phone Number <span className="text-red-500">*</span>
            </Label>
            <Controller
              control={control}
              name="phone"
              render={({ field }) => (
                <Input
                  {...field}
                  id="phoneNumber"
                  type="tel"
                  placeholder="+1234567890"
                  disabled={isSubmitting}
                  autoComplete="tel"
                  className={errors.phone ? "border-red-500" : ""}
                />
              )}
            />
            {errors.phone && (
              <p className="text-sm text-destructive">{errors.phone.message}</p>
            )}
          </div>

          {/* Business Type Field - Optional */}
          <div className="space-y-1">
            <Label htmlFor="businessType">Business Type</Label>
            <Controller
              control={control}
              name="businessType"
              render={({ field }) => (
                <Input
                  {...field}
                  id="businessType"
                  type="text"
                  placeholder="e.g. Restaurant, Café, Retail..."
                  disabled={isSubmitting}
                  autoComplete="street-address"
                  className={errors.businessType ? "border-red-500" : ""}
                />
              )}
            />
            {errors.businessType && (
              <p className="text-sm text-destructive">
                {errors.businessType.message}
              </p>
            )}
          </div>

          {/* Description Field - Optional */}
          <div className="space-y-1">
            <Label htmlFor="description">Description</Label>
            <Controller
              control={control}
              name="description"
              render={({ field }) => (
                <Input
                  {...field}
                  id="description"
                  type="text"
                  placeholder="Description"
                  disabled={isSubmitting}
                  className={errors.description ? "border-red-500" : ""}
                />
              )}
            />
            {errors.description && (
              <p className="text-sm text-destructive">
                {errors.description.message}
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

          {/* taxRate Field - Optional */}
          <Controller
            control={control}
            name="taxRate"
            rules={{
              required: "Tax rate is required",
              validate: (value) => {
                const number = Number(value);
                if (isNaN(number)) return "Must be a valid number";
                if (number < 0 || number > 100)
                  return "Tax rate must be between 0 and 100";
                return true;
              },
            }}
            render={({ field }) => (
              <Input
                {...field}
                id="taxRate"
                type="text" // use text to avoid native number input issues
                placeholder="e.g., 20%"
                disabled={isSubmitting}
                autoComplete="taxRate"
                onChange={(e) => field.onChange(e.target.value)} // keep as string
                className={errors.taxRate ? "border-red-500" : ""}
              />
            )}
          />
          {errors.taxRate && (
            <p className="text-sm text-destructive">{errors.taxRate.message}</p>
          )}

          {/* usdToKhrRate Field - Optional */}
          <Controller
            control={control}
            name="usdToKhrRate"
            rules={{
              required: "Rate is required",
              validate: (value) =>
                !isNaN(Number(value)) && Number(value) > 0
                  ? true
                  : "Must be a valid number",
            }}
            render={({ field }) => (
              <Input
                {...field}
                id="usdToKhrRate"
                type="text"
                placeholder="e.g., 4000"
                disabled={isSubmitting}
                autoComplete="usdToKhrRate"
                onChange={(e) => field.onChange(e.target.value)}
                className={errors.usdToKhrRate ? "border-red-500" : ""}
              />
            )}
          />
          {errors.usdToKhrRate && (
            <p className="text-sm text-destructive">
              {errors.usdToKhrRate.message}
            </p>
          )}

          {/* facebookUrl Field - Optional */}
          <div className="space-y-1">
            <Label htmlFor="facebookUrl">Facebook Url</Label>
            <Controller
              control={control}
              name="facebookUrl"
              render={({ field }) => (
                <Input
                  {...field}
                  id="facebookUrl"
                  type="text"
                  placeholder="i.e, link"
                  disabled={isSubmitting}
                  autoComplete="facebookUrl"
                  className={errors.facebookUrl ? "border-red-500" : ""}
                />
              )}
            />
            {errors.facebookUrl && (
              <p className="text-sm text-destructive">
                {errors.facebookUrl.message}
              </p>
            )}
          </div>

          {/* facebookUrl Field - Optional */}
          <div className="space-y-1">
            <Label htmlFor="instagramUrl">Instagram Url</Label>
            <Controller
              control={control}
              name="instagramUrl"
              render={({ field }) => (
                <Input
                  {...field}
                  id="instagramUrl"
                  type="text"
                  placeholder="i.e, link"
                  disabled={isSubmitting}
                  autoComplete="instagramUrl"
                  className={errors.instagramUrl ? "border-red-500" : ""}
                />
              )}
            />
            {errors.instagramUrl && (
              <p className="text-sm text-destructive">
                {errors.instagramUrl.message}
              </p>
            )}
          </div>

          {/* telegramContact Field - Optional */}
          <div className="space-y-1">
            <Label htmlFor="telegramContact">Telegram Contact</Label>
            <Controller
              control={control}
              name="telegramUrl"
              render={({ field }) => (
                <Input
                  {...field}
                  id="telegramContact"
                  type="text"
                  placeholder="i.e, link"
                  disabled={isSubmitting}
                  autoComplete="telegramContact"
                  className={errors.telegramUrl ? "border-red-500" : ""}
                />
              )}
            />
            {errors.telegramUrl && (
              <p className="text-sm text-destructive">
                {errors.telegramUrl.message}
              </p>
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
              {isSubmitting ? "Processing..." : "Update"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
