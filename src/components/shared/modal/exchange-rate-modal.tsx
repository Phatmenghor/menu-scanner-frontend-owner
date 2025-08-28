"use client";

import React, { useEffect, useState } from "react";
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
import { DollarSign, Loader2 } from "lucide-react";
import { ModalMode } from "@/constants/AppResource/status/status";
import {
  ExchangeRateFormData,
  ExchangeRateRequestSchema,
} from "@/models/dashboard/payment/exchange-rate/exchange-rate.schema";
import { ExchangeRateModel } from "@/models/dashboard/payment/exchange-rate/exchange-rate.response.model";
import { getExchangeRateByIdService } from "@/services/dashboard/payment/exchange-rate/exchange-rate.service";
import Loading from "@/components/shared/common/loading";

// Updated request interface to match existing schema pattern
export interface SaveExchangeRateRequest {
  usdToKhrRate: number;
  notes?: string;
}

type Props = {
  mode: ModalMode;
  exchangeRateId?: string;
  onClose: () => void;
  isOpen: boolean;
  isSubmitting?: boolean;
  onSave: (data: SaveExchangeRateRequest) => void;
  error?: string | null;
};

export default function ModalExchangeRate({
  isOpen,
  onClose,
  exchangeRateId,
  mode,
  onSave,
  isSubmitting = false,
  error = null,
}: Props) {
  const isCreate = mode === ModalMode.CREATE_MODE;

  const [exchangeRateData, setExchangeRateData] =
    useState<ExchangeRateModel | null>(null);
  const [isLoadingData, setIsLoadingData] = useState(false);

  const {
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isDirty },
  } = useForm<ExchangeRateFormData>({
    resolver: zodResolver(ExchangeRateRequestSchema),
    defaultValues: {
      usdToKhrRate: 0,
      notes: "",
    },
    mode: "onChange",
  });

  const currentRate = watch("usdToKhrRate");

  // Fetch exchange rate data for edit mode
  useEffect(() => {
    const fetchExchangeRateData = async () => {
      if (!exchangeRateId || !isOpen || isCreate) return;

      setIsLoadingData(true);
      try {
        const data = await getExchangeRateByIdService(exchangeRateId);
        setExchangeRateData(data);

        // Populate form with fetched data
        const formData = {
          usdToKhrRate: data?.usdToKhrRate || 0,
          notes: data?.notes || "",
        };
        reset(formData);
      } catch (error: any) {
        console.error("Error fetching exchange rate data:", error);
      } finally {
        setIsLoadingData(false);
      }
    };

    fetchExchangeRateData();
  }, [exchangeRateId, isOpen, reset, isCreate]);

  // Reset form for create mode
  useEffect(() => {
    if (isOpen && isCreate) {
      const formData: ExchangeRateFormData = {
        usdToKhrRate: 0,
        notes: "",
      };
      reset(formData);
      setExchangeRateData(null);
    }
  }, [isOpen, isCreate, reset]);

  const onSubmit = (formData: ExchangeRateFormData) => {
    const payload = {
      usdToKhrRate: formData.usdToKhrRate ?? 0,
      notes: (formData.notes || "").trim(),
    };

    onSave(payload);
  };

  const handleClose = () => {
    reset();
    setExchangeRateData(null);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl h-[90vh] p-0 gap-0 flex flex-col">
        {/* Header */}
        <DialogHeader className="px-6 py-4 border-b bg-muted/30 flex-shrink-0">
          <div className="flex items-center gap-4 pr-8">
            <div className="p-2 bg-emerald-100 rounded-full">
              <DollarSign className="h-5 w-5 text-emerald-600" />
            </div>
            <div className="flex-1">
              <DialogTitle className="text-xl font-semibold">
                {isCreate ? "Create Exchange Rate" : "Edit Exchange Rate"}
              </DialogTitle>
              <DialogDescription className="text-base text-muted-foreground">
                {isCreate
                  ? "Set up a new USD to KHR exchange rate."
                  : exchangeRateData
                  ? `Update the exchange rate of ${exchangeRateData.usdToKhrRate.toLocaleString()} KHR`
                  : "Loading exchange rate information..."}
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
            ) : !isCreate && !exchangeRateData ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">
                  No exchange rate data available
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

                {/* USD to KHR Rate */}
                <div className="space-y-2">
                  <Label htmlFor="usdToKhrRate" className="text-sm font-medium">
                    USD to KHR Exchange Rate{" "}
                    <span className="text-red-500">*</span>
                  </Label>
                  <div className="relative">
                    <Controller
                      control={control}
                      name="usdToKhrRate"
                      render={({ field }) => (
                        <Input
                          {...field}
                          id="usdToKhrRate"
                          type="number"
                          step="0.01"
                          min="0"
                          onChange={(e) =>
                            field.onChange(Number(e.target.value))
                          }
                          placeholder="4000.00"
                          disabled={isSubmitting}
                          className={`pl-12 transition-colors focus:border-green-500 ${
                            errors.usdToKhrRate ? "border-red-500" : ""
                          }`}
                        />
                      )}
                    />
                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
                      KHR
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Enter the amount in KHR for 1 USD
                  </p>
                  {errors.usdToKhrRate && (
                    <p className="text-sm text-red-600">
                      {errors.usdToKhrRate.message}
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
                        placeholder="Additional notes about this exchange rate..."
                        rows={4}
                        disabled={isSubmitting}
                        className="transition-colors focus:border-green-500"
                      />
                    )}
                  />
                  {errors.notes && (
                    <p className="text-sm text-red-600">
                      {errors.notes.message}
                    </p>
                  )}
                </div>

                {/* Exchange Rate Preview Card */}
                <div className="mt-6 p-4 bg-muted/30 rounded-lg border border-border">
                  <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    Exchange Rate Preview
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center justify-between p-3 bg-white rounded-md border">
                      <span className="text-muted-foreground">1 USD =</span>
                      <span className="font-mono font-semibold text-lg">
                        {currentRate
                          ? `${Number(currentRate).toLocaleString()} KHR`
                          : "0 KHR"}
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-white rounded-md border">
                      <span className="text-muted-foreground">100 USD =</span>
                      <span className="font-mono font-semibold text-lg">
                        {currentRate
                          ? `${(
                              Number(currentRate) * 100
                            ).toLocaleString()} KHR`
                          : "0 KHR"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Current Exchange Rate Info - Edit mode only */}
                {!isCreate && exchangeRateData && (
                  <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      Current Exchange Rate Information
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">
                          Current Rate:
                        </span>
                        <p className="font-medium">
                          {exchangeRateData.usdToKhrRate.toLocaleString()} KHR
                          per USD
                        </p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Status:</span>
                        <p className="font-medium flex items-center gap-2">
                          <div
                            className={`w-2 h-2 rounded-full ${
                              exchangeRateData.isActive
                                ? "bg-green-500"
                                : "bg-gray-400"
                            }`}
                          ></div>
                          {exchangeRateData.isActive ? "Active" : "Inactive"}
                        </p>
                      </div>
                      {exchangeRateData.createdAt && (
                        <div>
                          <span className="text-muted-foreground">
                            Created:
                          </span>
                          <p className="font-medium">
                            {new Date(
                              exchangeRateData.createdAt
                            ).toLocaleDateString()}
                          </p>
                        </div>
                      )}
                      {exchangeRateData.updatedAt && (
                        <div>
                          <span className="text-muted-foreground">
                            Last Updated:
                          </span>
                          <p className="font-medium">
                            {new Date(
                              exchangeRateData.updatedAt
                            ).toLocaleDateString()}
                          </p>
                        </div>
                      )}
                    </div>
                    {exchangeRateData.notes && (
                      <div className="mt-3">
                        <span className="text-muted-foreground">
                          Current Notes:
                        </span>
                        <p className="font-medium mt-1 text-sm bg-white p-2 rounded border">
                          {exchangeRateData.notes}
                        </p>
                      </div>
                    )}
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
                <Loader2 className="h-3 w-3 animate-spin" />
                {isCreate
                  ? "Creating exchange rate..."
                  : "Updating exchange rate..."}
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
                  {isCreate ? "Creating..." : "Updating..."}
                </>
              ) : isCreate ? (
                "Create Exchange Rate"
              ) : (
                "Update Exchange Rate"
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
