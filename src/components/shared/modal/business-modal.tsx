import React, { useEffect } from "react";
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
  BUSINESS_STATUS_OPTIONS,
  BusinessStatus,
  ModalMode,
} from "@/constants/AppResource/status/status";
import { CreateUsers, UpdateUsers } from "@/models/dashboard/user/user.schema";
import {
  BusinessFormData,
  createBusinessSchema,
  updateBusinessSchema,
} from "@/models/dashboard/master-data/business/business.schema";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export type UserModalData = Partial<CreateUsers> &
  Partial<UpdateUsers> & {
    userRole?: string;
    userStatus?: string;
  };

type Props = {
  mode: ModalMode;
  Data?: BusinessFormData | null;
  onClose: () => void;
  isOpen: boolean;
  isSubmitting?: boolean;
  onSave: (data: BusinessFormData) => void;
};

export default function ModalBusiness({
  isOpen,
  onClose,
  Data,
  mode,
  onSave,
  isSubmitting = false,
}: Props) {
  const isCreate = mode === ModalMode.CREATE_MODE;
  const schema = isCreate ? createBusinessSchema : updateBusinessSchema;

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<BusinessFormData>({
    resolver: zodResolver(schema), // Use dynamic schema instead of hardcoded UserFormSchema
    defaultValues: {
      id: "",
      address: "",
      description: "",
      email: "",
      name: "",
      phone: "",
      status: "",
    },
    mode: "onChange",
  });

  // Reset form when modal opens or data changes
  useEffect(() => {
    if (isOpen) {
      const formData = {
        id: Data?.id ?? "",
        email: Data?.email ?? "",
        name: Data?.name ?? "",
        status: Data?.status ?? "",
        address: Data?.address ?? "",
        description: Data?.description ?? "",
        phone: Data?.phone ?? "",
      };

      reset(formData);
    }
  }, [isOpen, Data, reset]);

  const onSubmit = (data: BusinessFormData) => {
    console.log("Form submitted with mode:", mode, "Data:", data); // Debug log

    const payload = {
      id: Data?.id?.trim(),
      email: data?.email?.trim()!,
      name: data.name?.trim()!,
      status: data?.status,
      address: data.address?.trim(),
      description: data.description?.trim(),
      phone: data?.phone?.trim(),
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
          <DialogTitle>
            {isCreate ? "Create Business" : "Edit Business"}
          </DialogTitle>
          <DialogDescription>
            {isCreate
              ? "Fill out the form to create a new Business."
              : "Update Business information below."}
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

          {/* Status Field */}
          {!isCreate && (
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
                      {BUSINESS_STATUS_OPTIONS.map((status) => (
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
          )}

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
