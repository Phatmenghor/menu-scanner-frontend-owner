import z from "zod";

export const SaveExchangeRateRequestSchema = z.object({
  usdToKhrRate: z.number().positive("Exchange rate must be a positive number"),
  notes: z.string().max(500, "Notes must be under 500 characters").optional(),
});

export type ExchangeRateFormData = z.infer<
  typeof SaveExchangeRateRequestSchema
> & {
  id?: string;
};
