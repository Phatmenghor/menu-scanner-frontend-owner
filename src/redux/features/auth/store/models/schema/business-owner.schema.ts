// subscription.schema.ts
import { z } from "zod";

/**
 * Create Subscription Schema
 */
export const createBusinessOwnerSchema = z.object({
  ownerUserIdentifier: z
    .string()
    .min(1, "Owner identifier is required")
    .min(3, "Owner identifier must be at least 3 characters"),
  ownerEmail: z
    .string()
    .min(1, "Owner email is required")
    .email("Invalid email format"),
  ownerPassword: z
    .string()
    .min(1, "Owner password is required")
    .min(6, "Password must be at least 6 characters"),
  ownerFullName: z.string().min(1, "Owner full name is required"),
  ownerPhone: z
    .string()
    .regex(/^\+?[\d\s-()]+$/, "Invalid phone number format"),
  businessName: z.string().min(1, "Business name is required"),
  businessEmail: z
    .string()
    .min(1, "Business email is required")
    .email("Invalid email format"),
  businessPhone: z
    .string()
    .regex(/^\+?[\d\s-()]+$/, "Invalid phone number format"),
  businessAddress: z.string().min(1, "Business address is required"),
  planId: z.string().uuid("Invalid plan ID format"),
  customDurationDays: z.number().int().min(0, "Duration must be non-negative"),
  paymentAmount: z.number().min(0, "Payment amount must be non-negative"),
  paymentMethod: z.string().min(1, "Payment method is required"),
  paymentReference: z.string().optional().or(z.literal("")),
  paymentNotes: z.string().optional().or(z.literal("")),
  paymentInfoComplete: z.boolean(),
});

/**
 * Update/Renew Subscription Schema (no ID - comes from URL params)
 */
export const renewSubscriptionSchema = z.object({
  newPlanId: z.string().uuid("Invalid plan ID format"),
  customDurationDays: z.number().int().min(0, "Duration must be non-negative"),
  paymentAmount: z.number().min(0, "Payment amount must be non-negative"),
  paymentMethod: z.string().min(1, "Payment method is required"),
  paymentReference: z.string().optional().or(z.literal("")),
  paymentNotes: z.string().optional().or(z.literal("")),
  paymentInfoComplete: z.boolean(),
});

/**
 * Cancel Subscription Schema (no ID - comes from URL params)
 */
export const cancelSubscriptionSchema = z.object({
  reason: z.string().min(1, "Cancellation reason is required"),
  notes: z.string().optional().or(z.literal("")),
  refundAmount: z.number().min(0, "Refund amount must be non-negative"),
  refundMethod: z.string().optional().or(z.literal("")),
  refundReference: z.string().optional().or(z.literal("")),
});

/**
 * Change Plan Schema (no ID - comes from URL params)
 */
export const changePlanSchema = z.object({
  newPlanId: z.string().uuid("Invalid plan ID format"),
  keepCurrentEndDate: z.boolean(),
  paymentAmount: z.number().min(0, "Payment amount must be non-negative"),
  paymentMethod: z.string().min(1, "Payment method is required"),
  paymentReference: z.string().optional().or(z.literal("")),
  paymentNotes: z.string().optional().or(z.literal("")),
  paymentInfoComplete: z.boolean(),
});

/**
 * Type definitions
 */
export type CreateBusinessOwnerData = z.infer<typeof createBusinessOwnerSchema>;
export type RenewSubscriptionData = z.infer<typeof renewSubscriptionSchema>;
export type CancelSubscriptionData = z.infer<typeof cancelSubscriptionSchema>;
export type ChangePlanData = z.infer<typeof changePlanSchema>;
