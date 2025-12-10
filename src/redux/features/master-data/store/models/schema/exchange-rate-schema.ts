import { z } from "zod";

/**
 * Create Exchange Rate Schema
 */
export const createExchangeRateSchema = z.object({
  usdToKhrRate: z.coerce
    .number()
    .min(0.01, "Exchange rate must be greater than 0"),
  notes: z.string().optional().or(z.literal("")),
});

/**
 * Update Exchange Rate Schema
 */
export const updateExchangeRateSchema = z.object({
  id: z.string().min(1, "Exchange rate ID is required"),
  usdToKhrRate: z.coerce
    .number()
    .min(0.01, "Exchange rate must be greater than 0"),
  notes: z.string().optional().or(z.literal("")),
});

/**
 * Combined form data type - includes all possible fields
 */
export type ExchangeRateFormData = {
  id: string;
  usdToKhrRate: number;
  notes?: string;
};
