import { z } from "zod";

/**
 * Create Payment Schema
 */
export const createPaymentSchema = z.object({
  imageUrl: z.string().url("Invalid image URL").optional().or(z.literal("")),
  subscriptionId: z.string().optional().or(z.literal("")),
  businessId: z.string().optional().or(z.literal("")),
  amount: z.coerce.number().min(0, "Amount must be greater than or equal 0"),
  paymentType: z.string().min(1, "Payment type is required"),
  status: z.string().min(1, "Payment status is required"),
  referenceNumber: z.string().optional().or(z.literal("")),
  notes: z.string().optional().or(z.literal("")),
});

/**
 * Update Payment Schema
 */
export const updatePaymentSchema = z.object({
  id: z.string().min(1, "Payment ID is required"),
  imageUrl: z.string().url("Invalid image URL").optional().or(z.literal("")),
  subscriptionId: z.string().optional().or(z.literal("")),
  businessId: z.string().optional().or(z.literal("")),
  amount: z.coerce.number().min(0, "Amount must be greater than or equal 0"),
  paymentType: z.string().min(1, "Payment type is required"),
  status: z.string().min(1, "Payment status is required"),
  referenceNumber: z.string().optional().or(z.literal("")),
  notes: z.string().optional().or(z.literal("")),
});

/**
 * Combined form data type - includes all possible fields
 */
export type PaymentFormData = {
  id: string;
  imageUrl?: string;
  subscriptionId?: string;
  businessId?: string;
  amount: number;
  paymentType: string;
  status: string;
  referenceNumber?: string;
  notes?: string;
};
