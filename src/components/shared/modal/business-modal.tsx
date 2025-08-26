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
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2, Building2, X } from "lucide-react";
import { BUSINESS_STATUS_OPTIONS } from "@/constants/AppResource/status/status";
import {
  BusinessFormData,
  updateBusinessSchema,
} from "@/models/dashboard/master-data/business/business.schema";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Props = {
  data?: BusinessFormData | null;
  onClose: () => void;
  isOpen: boolean;
  isSubmitting?: boolean;
  onSave: (data: BusinessFormData) => void;
};

export default function ModalBusiness({
  isOpen,
  onClose,
  data: Data,
  onSave,
  isSubmitting = false,
}: Props) {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<BusinessFormData>({
    resolver: zodResolver(updateBusinessSchema),
    defaultValues: {
      id: "",
      address: "",
      description: "",
      email: "",
      name: "",
      phone: "",
      status: "active", // Default to active to fix the type issue
    },
    mode: "onChange",
  });

  // Reset form when modal opens or data changes
  useEffect(() => {
    if (isOpen && Data) {
      const formData = {
        id: Data.id || "",
        email: Data.email || "",
        name: Data.name || "",
        status: Data.status || "active", // Provide fallback to fix undefined issue
        address: Data.address || "",
        description: Data.description || "",
        phone: Data.phone || "",
      };
      reset(formData);
    }
  }, [isOpen, Data, reset]);

  const onSubmit = (data: BusinessFormData) => {
    console.log("Form submitted - Update Mode, Data:", data);

    const payload = {
      id: data.id || "",
      email: data.email?.trim() || "",
      name: data.name?.trim() || "",
      status: data.status || "active",
      address: data.address?.trim() || "",
      description: data.description?.trim() || "",
      phone: data.phone?.trim() || "",
    };

    console.log("Update Payload:", payload);
    onSave(payload);
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl h-[90vh] p-0 gap-0 flex flex-col">
        {/* Header */}
        <DialogHeader className="px-6 py-4 border-b bg-muted/30 flex-shrink-0">
          <div className="flex items-center gap-4 pr-8">
            <div className="p-2 bg-blue-100 rounded-full">
              <Building2 className="h-5 w-5 text-blue-600" />
            </div>
            <div className="flex-1">
              <DialogTitle className="text-xl font-semibold">
                Edit Business
              </DialogTitle>
              <DialogDescription className="text-base text-muted-foreground">
                Update "{Data?.name || "business"}" information below.
              </DialogDescription>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="absolute right-4 top-4"
            onClick={handleClose}
            disabled={isSubmitting}
          >
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>

        {/* Content */}
        <ScrollArea className="flex-1 min-h-0">
          <div className="p-6">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Basic Information Section */}
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Business Name */}
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-sm font-medium">
                      Business Name <span className="text-red-500">*</span>
                    </Label>
                    <Controller
                      control={control}
                      name="name"
                      render={({ field }) => (
                        <Input
                          {...field}
                          id="name"
                          type="text"
                          placeholder="Enter business name"
                          disabled={isSubmitting}
                          autoComplete="organization"
                          className={`transition-colors ${
                            errors.name
                              ? "border-red-500 focus:border-red-500"
                              : "focus:border-blue-500"
                          }`}
                        />
                      )}
                    />
                    {errors.name && (
                      <p className="text-sm text-red-600 flex items-center gap-1">
                        {errors.name.message}
                      </p>
                    )}
                  </div>

                  {/* Email */}
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
                          placeholder="business@example.com"
                          disabled={isSubmitting}
                          autoComplete="email"
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
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Phone */}
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-sm font-medium">
                      Phone Number <span className="text-red-500">*</span>
                    </Label>
                    <Controller
                      control={control}
                      name="phone"
                      render={({ field }) => (
                        <Input
                          {...field}
                          id="phone"
                          type="tel"
                          placeholder="+1 (555) 123-4567"
                          disabled={isSubmitting}
                          autoComplete="tel"
                          className={`transition-colors ${
                            errors.phone
                              ? "border-red-500 focus:border-red-500"
                              : "focus:border-blue-500"
                          }`}
                        />
                      )}
                    />
                    {errors.phone && (
                      <p className="text-sm text-red-600">
                        {errors.phone.message}
                      </p>
                    )}
                  </div>

                  {/* Status */}
                  <div className="space-y-2">
                    <Label
                      htmlFor="status-select"
                      className="text-sm font-medium"
                    >
                      Status <span className="text-red-500">*</span>
                    </Label>
                    <Controller
                      control={control}
                      name="status"
                      render={({ field }) => (
                        <Select
                          value={field.value || "active"}
                          onValueChange={field.onChange}
                          disabled={isSubmitting}
                        >
                          <SelectTrigger
                            id="status-select"
                            className={`transition-colors ${
                              errors.status
                                ? "border-red-500 focus:border-red-500"
                                : "focus:border-blue-500"
                            }`}
                          >
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                          <SelectContent>
                            {BUSINESS_STATUS_OPTIONS.map((status) => (
                              <SelectItem
                                key={status.value || "unknown"}
                                value={String(status.value || "active")}
                              >
                                <div className="flex items-center gap-2">
                                  <div
                                    className={`w-2 h-2 rounded-full ${
                                      String(status.value) === "active"
                                        ? "bg-green-500"
                                        : String(status.value) === "pending"
                                        ? "bg-yellow-500"
                                        : String(status.value) === "suspended"
                                        ? "bg-red-500"
                                        : "bg-gray-500"
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
                    {errors.status && (
                      <p className="text-sm text-red-600">
                        {errors.status.message}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Additional Information Section */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <div className="w-1 h-6 bg-gray-400 rounded-full"></div>
                  <h3 className="text-lg font-semibold text-foreground">
                    Additional Information
                  </h3>
                </div>

                {/* Address */}
                <div className="space-y-2">
                  <Label htmlFor="address" className="text-sm font-medium">
                    Business Address
                  </Label>
                  <Controller
                    control={control}
                    name="address"
                    render={({ field }) => (
                      <Input
                        {...field}
                        id="address"
                        type="text"
                        placeholder="123 Main Street, City, State, ZIP"
                        disabled={isSubmitting}
                        autoComplete="street-address"
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

                {/* Description */}
                <div className="space-y-2">
                  <Label htmlFor="description" className="text-sm font-medium">
                    Description
                  </Label>
                  <Controller
                    control={control}
                    name="description"
                    render={({ field }) => (
                      <Textarea
                        {...field}
                        id="description"
                        placeholder="Brief description of the business..."
                        disabled={isSubmitting}
                        className={`min-h-[100px] transition-colors ${
                          errors.description
                            ? "border-red-500 focus:border-red-500"
                            : "focus:border-blue-500"
                        }`}
                        rows={4}
                      />
                    )}
                  />
                  {errors.description && (
                    <p className="text-sm text-red-600">
                      {errors.description.message}
                    </p>
                  )}
                </div>
              </div>
            </form>
          </div>
        </ScrollArea>

        {/* Footer */}
        <div className="flex justify-between items-center p-6 border-t bg-muted/30 flex-shrink-0">
          <div className="text-sm text-muted-foreground">
            {isDirty ? "You have unsaved changes" : "No changes made"}
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
                "Update Business"
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
