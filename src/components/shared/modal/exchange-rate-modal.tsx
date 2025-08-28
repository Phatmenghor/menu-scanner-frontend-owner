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
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ModalMode } from "@/constants/AppResource/status/status";
import {
  ExchangeRateFormData,
  SaveExchangeRateRequestSchema,
} from "@/models/dashboard/payment/exchange-rate/exchange-rate.schema";
import { ExchangeRateModel } from "@/models/dashboard/payment/exchange-rate/exchange-rate.response.model";

type Props = {
  mode: ModalMode;
  Data?: ExchangeRateModel | null;
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
    resolver: zodResolver(SaveExchangeRateRequestSchema),
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
        id: Data?.id,
        usdToKhrRate: Data?.usdToKhrRate || 0,
        notes: Data?.notes || "",
      };

      reset(formData);
    }
  }, [isOpen, Data, reset]);

  const onSubmit = (data: ExchangeRateFormData) => {
    const payload = {
      id: Data?.id,
      usdToKhrRate: data.usdToKhrRate || 0,
      notes: data.notes?.trim() || "",
    };

    onSave(payload);
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
            {isCreate ? "Create Exchange Rate" : "Edit Exchange Rate"}
          </DialogTitle>
          <DialogDescription>
            {isCreate
              ? "Fill out the form to create a new exchange rate."
              : "Update exchange rate information below."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-4">
          {/* USD to KHR Rate Field */}
          <div className="space-y-2">
            <Label htmlFor="usdToKhrRate">
              USD to KHR Rate <span className="text-red-500">*</span>
            </Label>
            <Controller
              control={control}
              name="usdToKhrRate"
              render={({ field }) => (
                <Input
                  {...field}
                  id="usdToKhrRate"
                  type="number"
                  step="1"
                  min="0"
                  onChange={(e) => field.onChange(Number(e.target.value))}
                  placeholder="Enter exchange rate (e.g., 4100)"
                  disabled={isSubmitting}
                  autoComplete="off"
                  className={errors.usdToKhrRate ? "border-red-500" : ""}
                />
              )}
            />
            {errors.usdToKhrRate && (
              <p className="text-sm text-destructive">
                {errors.usdToKhrRate.message}
              </p>
            )}
            <p className="text-xs text-muted-foreground">
              Enter the exchange rate from USD to Khmer Riel (KHR)
            </p>
          </div>

          {/* Notes Field */}
          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Controller
              control={control}
              name="notes"
              render={({ field }) => (
                <Textarea
                  {...field}
                  id="notes"
                  rows={3}
                  placeholder="Enter additional notes or comments..."
                  disabled={isSubmitting}
                  className={errors.notes ? "border-red-500" : ""}
                />
              )}
            />
            {errors.notes && (
              <p className="text-sm text-destructive">{errors.notes.message}</p>
            )}
            <p className="text-xs text-muted-foreground">
              Optional: Add any relevant notes or comments about this exchange
              rate
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-6">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  Processing...
                </>
              ) : isCreate ? (
                "Create Exchange Rate"
              ) : (
                "Save Changes"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
