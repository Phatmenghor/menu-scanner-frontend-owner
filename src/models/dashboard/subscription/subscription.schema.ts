import { z } from "zod";

// Base schema with common fields
const BaseSubscriptionSchema = z.object({
  planId: z.string().min(1, "Plan is required"),
  startDate: z.string().min(1, "Start date is required"),
  autoRenew: z.boolean().optional(),
  notes: z.string().optional(),
});
const createSubscriptionSchema = BaseSubscriptionSchema.extend({
  businessId: z.string().min(1, "Business ID is required"),
});

const updateSubscriptionSchema = BaseSubscriptionSchema.extend({
  endDate: z.string().min(1, "End date is required").optional(),
  isActive: z.boolean().optional(),
});

const SubscriptionFormSchema = BaseSubscriptionSchema.extend({
  businessId: z.string().optional(),
  endDate: z.string().optional(),
  isActive: z.boolean().optional(),
});

export const CreateSubscriptionSchema = createSubscriptionSchema;
export const UpdateSubscriptionSchema = updateSubscriptionSchema;

export type SubscriptionFormData = z.infer<typeof SubscriptionFormSchema> & {
  id?: string;
};
