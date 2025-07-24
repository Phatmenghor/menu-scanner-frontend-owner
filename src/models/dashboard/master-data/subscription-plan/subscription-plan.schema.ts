import z from "zod";

// Base business schema for shared fields
const BaseSubscriptionPlanSchema = z.object({
  name: z.string().min(1, "Business name is required"),
  description: z.string().optional(),
  price: z.preprocess(
    (val) => Number(val),
    z.number().min(0, "Price must be 0 or greater")
  ),
  durationDays: z.preprocess(
    (val) => Number(val),
    z.number().min(1, "Duration must be at least 1 day")
  ),
  status: z.string(),
});

// Create schema (no id needed)
export const createSubscriptionPlanSchema = BaseSubscriptionPlanSchema;

// Update schema (includes id)
export const updateSubscriptionPlanSchema = BaseSubscriptionPlanSchema.extend({
  id: z.string().min(1, "ID is required"),
});

// UI form schema — includes optional `id` for editing
export const SubscriptionPlanFormSchema = BaseSubscriptionPlanSchema.extend({
  id: z.string().optional(),
});

// Types
export type CreateSubscriptionPlanSchema = z.infer<
  typeof createSubscriptionPlanSchema
>;

export type UpdateSubscriptionPlanSchema = z.infer<
  typeof updateSubscriptionPlanSchema
>;

// Form data type used for both create/update UI
export type SubscriptionPlanFormData = z.infer<
  typeof SubscriptionPlanFormSchema
>;
