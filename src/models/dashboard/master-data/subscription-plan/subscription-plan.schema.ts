import z from "zod";

// Base business schema for shared fields
const BaseSubscriptionPlanSchema = z.object({
  name: z.string().min(1, "Business name is required"),
  description: z.string("Description is required"),
  price: z.number(),
  durationDays: z.number(),
  status: z.string(),
});

// Create schema
export const createSubscriptionPlanSchema = BaseSubscriptionPlanSchema;

// Update schema
export const updateSubscriptionPlanSchema = BaseSubscriptionPlanSchema;

// UI form schema — includes `id` for editing
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
