import { z } from "zod";

/**
 * Create Subscription Schema
 */
export const createSubscriptionSchema = z.object({
  businessId: z.string().min(1, "Business is required"),
  planId: z.string().min(1, "Plan is required"),
  startDate: z.string().min(1, "Start date is required"),
  autoRenew: z.enum(["true", "false"]),
});

/**
 * Update Subscription Schema
 */
export const updateSubscriptionSchema = z.object({
  id: z.string().optional(),
  planId: z.string().min(1, "Plan is required"),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().optional(),
  autoRenew: z.enum(["true", "false"]),
});

/**
 * Combined form data type
 */
export type SubscriptionFormData = {
  id?: string;
  businessId: string;
  planId: string;
  startDate: string;
  endDate: string;
  autoRenew: string;
};
