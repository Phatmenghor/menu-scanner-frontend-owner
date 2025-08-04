import { z } from "zod";

export const updateMyBusinessSchema = z.object({
  imageUrl: z.string().optional(),
  name: z.string().optional(),
  description: z.string().optional(),
  phone: z.string().optional(),
  address: z.string().optional(),
  businessType: z.string().optional(),
  facebookUrl: z.string().optional(),
  instagramUrl: z.string().optional(),
  telegramUrl: z.string().optional(),
  usdToKhrRate: z
    .number()
    .min(1000, "Exchange rate must be at least 1000 KHR per USD")
    .max(10000, "Exchange rate cannot exceed 10000 KHR per USD")
    .optional(),
  taxRate: z
    .number()
    .min(0, "Tax rate cannot be negative")
    .max(100, "Tax rate cannot exceed 100%")
    .optional(),
});

export type MyBusinessFormData = z.infer<typeof updateMyBusinessSchema> & {
  id?: string;
};
