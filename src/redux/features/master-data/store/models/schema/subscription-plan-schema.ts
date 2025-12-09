import { z } from "zod";

/**
 * Create SubscriptionPlan Schema
 */
export const createSubscriptionPlanSchema = z.object({
  name: z.string().min(1, "name is required").optional(),
  description: z.string().optional(),
  price: z.number().min(1, "price is required").optional(),
  durationDays: z.number().min(1, "durationDays is required").optional(),
  status: z.string().min(1, "status is required").optional(),
});

/**
 * Update SubscriptionPlan Schema
 */
export const updateSubscriptionPlanSchema = z.object({
  name: z.string().min(1, "name is required").optional(),
  description: z.string().optional(),
  price: z.number().min(1, "price is required").optional(),
  durationDays: z.number().min(1, "durationDays is required").optional(),
  status: z.string().min(1, "status is required").optional(),
});

/**
 * SubscriptionPlan Form Data Type
 */
export type SubscriptionPlanFormData = z.infer<
  typeof createSubscriptionPlanSchema
> & {
  id?: string;
};
