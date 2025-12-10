import { z } from "zod";

/**
 * Create SubscriptionPlan Schema
 */
export const createSubscriptionPlanSchema = z.object({
  name: z.string().min(1, "Plan name is required"),
  description: z.string().optional().or(z.literal("")),
  price: z.coerce.number().min(0, "Price must be 0 or greater"),
  durationDays: z.coerce
    .number()
    .int("Duration must be a whole number")
    .min(1, "Duration must be at least 1 day"),
  status: z.string().min(1, "Status is required"),
});

/**
 * Update SubscriptionPlan Schema
 */
export const updateSubscriptionPlanSchema = z.object({
  id: z.string().min(1, "Plan ID is required"),
  name: z.string().min(1, "Plan name is required"),
  description: z.string().optional().or(z.literal("")),
  price: z.coerce.number().min(0, "Price must be 0 or greater"),
  durationDays: z.coerce
    .number()
    .int("Duration must be a whole number")
    .min(1, "Duration must be at least 1 day"),
  status: z.string().min(1, "Status is required"),
});

/**
 * Combined form data type - includes all possible fields
 */
export type SubscriptionPlanFormData = {
  id: string;
  name: string;
  description?: string;
  price: number;
  durationDays: number;
  status: string;
};
