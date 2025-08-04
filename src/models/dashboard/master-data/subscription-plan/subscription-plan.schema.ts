import z from "zod";

// Base shared fields
export const SubscriptionPlanSchema = z.object({
  name: z.string().min(1, "Plan name is required"),
  description: z.string().optional(),
  price: z.number().min(0, "Price must be 0 or greater"),
  status: z.string().optional(),
  durationDays: z.number().min(1, "Duration must be at least 1 day"),
});
// Types
export type SubscriptionPlanFormData = z.infer<
  typeof SubscriptionPlanSchema
> & {
  id?: string;
};
