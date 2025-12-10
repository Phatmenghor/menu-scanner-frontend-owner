import { z } from "zod";

/**
 * Create Payment Schema
 */
export const createPaymentSchema = z.object({
  imageUrl: z.string().optional(),
  subscriptionId: z.string().optional(),
  businessId: z.string().optional(),
  amount: z.number().min(1, "amount is required").optional(),
  paymentType: z.string().min(1, "paymentType is required").optional(),
  status: z.string().min(1, "status is required").optional(),
  referenceNumber: z.string().optional(),
  notes: z.string().optional(),
});

/**
 * Update Payment Schema
 */
export const updatePaymentSchema = z.object({
  imageUrl: z.string().optional(),
  subscriptionId: z.string().optional(),
  businessId: z.string().optional(),
  amount: z.string().min(1, "amount is required").optional(),
  paymentType: z.string().min(1, "paymentType is required").optional(),
  status: z.string().min(1, "status is required").optional(),
  referenceNumber: z.string().optional(),
  notes: z.string().optional(),
});

/**
 * Business Form Data Type
 */
export type PaymentFormData = z.infer<typeof createPaymentSchema> & {
  id?: string;
};
