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
import { ModalMode } from "@/constants/AppResource/status/status";
import {
  ExchangeRateFormData,
  SaveExchangeRateRequestSchema,
} from "@/models/dashboard/payment/exchange-rate/exchange-rate.schema";

type Props = {
  mode: ModalMode;
  Data?: ExchangeRateFormData | null;
  onClose: () => void;
  isOpen: boolean;
  isSubmitting?: boolean;
  onSave: (data: ExchangeRateFormData) => void;
};

export default function ModalExchangeRate({
  isOpen,
  onClose,
  Data,
  mode,
  onSave,
  isSubmitting = false,
}: Props) {
  const isCreate = mode === ModalMode.CREATE_MODE;

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ExchangeRateFormData>({
    resolver: zodResolver(SaveExchangeRateRequestSchema), // Always use the form schema
    defaultValues: {
      usdToKhrRate: 0,
      notes: "",
    },
    mode: "onChange",
  });

  // Reset form when modal opens or data changes
  useEffect(() => {
    if (isOpen) {
      const formData = {
        usdToKhrRate: Data?.usdToKhrRate || 0,
        notes: Data?.notes || "",
      };

      reset(formData);
    }
  }, [isOpen, Data, reset]);

  const onSubmit = (data: ExchangeRateFormData) => {
    console.log("Form submitted with mode:", mode, "Data:", data); // Debug log

    const payload = {
      id: Data?.id,
      usdToKhrRate: data?.usdToKhrRate || 0,
      notes: data?.notes?.trim() || "",
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
            {isCreate ? "Create Subscription Plan" : "Edit Subscription Plan"}
          </DialogTitle>
          <DialogDescription>
            {isCreate
              ? "Fill out the form to create a new Subscription Plan."
              : "Update Subscription Plan information below."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-2 pt-4">
          {/* name Field */}
          <div className="space-y-1">
            <Label htmlFor="usdToKhrRate">
              Usd to Khmer Rate<span className="text-red-500">*</span>
            </Label>
            <Controller
              control={control}
              name="usdToKhrRate"
              render={({ field }) => (
                <Input
                  {...field}
                  id="usdToKhrRate"
                  type="text"
                  onChange={(e) => field.onChange(Number(e.target.value))}
                  placeholder="Enter exchange rate (e.g., 4100)"
                  disabled={isSubmitting}
                  autoComplete="usdToKhrRate"
                  className={errors.usdToKhrRate ? "border-red-500" : ""}
                />
              )}
            />
            {errors.usdToKhrRate && (
              <p className="text-sm text-destructive">
                {errors.usdToKhrRate.message}
              </p>
            )}
          </div>

          {/* Price Field */}
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
                  placeholder="Enter notes"
                  disabled={isSubmitting}
                  autoComplete="off"
                  className={errors.notes ? "border-red-500" : ""}
                />
              )}
            />
            {errors.notes && (
              <p className="text-sm text-destructive">{errors.notes.message}</p>
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
              {isSubmitting ? "Processing..." : isCreate ? "Create" : "Save"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
