import { z } from "zod";

export const updateMyBusinessSchema = z.object({
  logoUrl: z.string().url().optional().or(z.literal("")),
  name: z.string().optional(),
  description: z.string().optional(),
  phone: z.string().optional(),
  address: z.string().optional(),
  website: z.string().url().optional().or(z.literal("")),

  businessType: z.string().optional(),
  cuisineType: z.string().optional(),
  operatingHours: z
    .string()
    .regex(
      /^([A-Za-z,-]+):\s*\d{1,2}(AM|PM)-\d{1,2}(AM|PM)$/,
      "Operating hours must be in format like 'Mon-Sun: 6AM-10PM'"
    )
    .optional(),

  facebookUrl: z.string().url().optional().or(z.literal("")),
  instagramUrl: z.string().url().optional().or(z.literal("")),
  telegramContact: z.string().optional(),

  usdToKhrRate: z.coerce
    .number()
    .min(1000, "Exchange rate must be at least 1000 KHR per USD")
    .max(10000, "Exchange rate cannot exceed 10000 KHR per USD")
    .optional(),

  taxRate: z.coerce
    .number()
    .min(0, "Tax rate cannot be negative")
    .max(100, "Tax rate cannot exceed 100%")
    .optional(),

  serviceChargeRate: z.coerce
    .number()
    .min(0, "Service charge cannot be negative")
    .max(100, "Service charge cannot exceed 100%")
    .optional(),

  acceptsOnlinePayment: z.boolean().optional(),
  acceptsCashPayment: z.boolean().optional(),
  acceptsBankTransfer: z.boolean().optional(),
  acceptsMobilePayment: z.boolean().optional(),
});

export const updateMyBusiness = updateMyBusinessSchema.extend({
  id: z.string().min(1, "id is required").optional(),
});

export type MyBusinessFormData = z.infer<typeof updateMyBusiness>;
