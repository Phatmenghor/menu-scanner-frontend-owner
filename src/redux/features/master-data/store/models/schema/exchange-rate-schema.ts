import { z } from "zod";

/**
 * Create Exchange Rate Schema
 */
export const createExchangeRateSchema = z.object({
  usdToKhrRate: z.number().min(1, "usdToKhrRate is required").optional(),
  notes: z.string().optional(),
});

/**
 * Update Exchange Rate Schema
 */
export const updateExchangeRateSchema = z.object({
  usdToKhrRate: z.string().min(1, "usdToKhrRate is required").optional(),
  notes: z.string().optional().nullable(),
});

/**
 * Exchange Rate Form Data Type
 */
export type ExchangeRateFormData = z.infer<typeof createExchangeRateSchema> & {
  id?: string;
};
