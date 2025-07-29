import z from "zod";

// Base schema for shared fields
const BaseSubscriptionPlanSchema = z.object({
  name: z.string().min(1, "Plan name is required"),
  description: z.string().optional(),
  price: z.preprocess(
    (val) => Number(val),
    z.number().min(0, "Price must be 0 or greater")
  ),
  durationDays: z.preprocess(
    (val) => Number(val),
    z.number().min(1, "Duration must be at least 1 day")
  ),
});

// Create schema
export const createSubscriptionPlanSchema = BaseSubscriptionPlanSchema;

// Update schema
export const updateSubscriptionPlanSchema =
  BaseSubscriptionPlanSchema.partial().extend({
    id: z.string().min(1, "Subscription Plan ID is required"),
    status: z.string().optional(),
  });

// UI form schema — includes optional `id` for editing
export const SubscriptionPlanFormSchema = updateSubscriptionPlanSchema.extend({
  id: z.string().min(1, "Subscription Plan ID is required").optional(),
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
> & {
  id?: string;
};
