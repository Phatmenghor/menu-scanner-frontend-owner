import { z } from "zod";

export const updateMyBusinessSchema = z.object({
  logoUrl: z.string().url().optional(),
  name: z.string().optional(),
  description: z.string().optional(),
  phone: z.string().optional(),
  address: z.string().optional(),
  website: z.string().url().optional(),

  businessType: z
    .enum(["Restaurant", "Cafe", "Bar", "Food Truck", "Bakery"])
    .optional(),
  cuisineType: z
    .enum(["Khmer", "Chinese", "Thai", "Vietnamese", "Western", "Mixed"])
    .optional(),

  operatingHours: z.string().optional(),

  facebookUrl: z.string().url().optional(),
  instagramUrl: z.string().url().optional(),
  telegramContact: z.string().optional(),

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

  serviceChargeRate: z
    .number()
    .min(0, "Service charge cannot be negative")
    .max(100, "Service charge cannot exceed 100%")
    .optional(),

  acceptsOnlinePayment: z.boolean().optional(),
  acceptsCashPayment: z.boolean().optional(),
  acceptsBankTransfer: z.boolean().optional(),
  acceptsMobilePayment: z.boolean().optional(),
});

export type MyBusinessFormData = z.infer<typeof updateMyBusinessSchema>;
