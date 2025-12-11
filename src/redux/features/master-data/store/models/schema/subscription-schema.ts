import { z } from "zod";

/**
 * Create Subscription Schema
 */
export const createSubscriptionSchema = z.object({
  businessId: z.string().min(1, "Business is required"),
  planId: z.string().min(1, "Plan is required"),
  startDate: z.string().min(1, "Start date is required"),
  autoRenew: z.boolean(),
});

/**
 * Update Subscription Schema
 */
export const updateSubscriptionSchema = z.object({
  planId: z.string().min(1, "Plan is required"),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().optional(),
  isActive: z.boolean(),
  autoRenew: z.boolean(),
});

/**
 * Combined form data type - includes all possible fields
 */
export type SubscriptionFormData = {
  businessId?: string;
  planId: string;
  startDate: string;
  endDate?: string;
  isActive?: boolean;
  autoRenew: boolean;
};
