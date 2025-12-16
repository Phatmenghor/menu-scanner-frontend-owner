import { z } from "zod";

/**
 * Create Payment Schema
 */
export const createPaymentSchema = z.object({
  imageUrl: z.string().optional(),
  subscriptionId: z.string().optional(),
  businessId: z.string().optional(),
  amount: z.coerce.number().min(0, "Amount must be greater than or equal to 0"),
  paymentMethod: z.string().min(1, "Payment method is required"),
  paymentType: z.string().min(1, "Payment type is required"),
  status: z.string().min(1, "Payment status is required"),
  referenceNumber: z.string().optional(),
  notes: z.string().optional(),
});

/**
 * Update Payment Schema
 */
export const updatePaymentSchema = z.object({
  id: z.string().optional(),
  imageUrl: z.string().optional(),
  subscriptionId: z.string().optional(),
  businessId: z.string().optional(),
  amount: z.coerce.number().min(0, "Amount must be greater than or equal to 0"),
  paymentMethod: z.string().min(1, "Payment method is required"),
  paymentType: z.string().min(1, "Payment type is required"),
  status: z.string().min(1, "Payment status is required"),
  referenceNumber: z.string().optional(),
  notes: z.string().optional(),
});

/**
 * Combined form data type - includes all possible fields
 */
export type PaymentFormData = {
  id?: string;
  imageUrl?: string;
  subscriptionId?: string;
  businessId?: string;
  amount: number;
  paymentMethod: string;
  paymentType: string;
  status: string;
  referenceNumber?: string;
  notes?: string;
};
