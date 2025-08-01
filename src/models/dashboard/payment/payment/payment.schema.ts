import { z } from "zod";

export const CreatePaymentSchema = z.object({
  imageUrl: z.string().optional(),
  subscriptionId: z.string(),
  status: z.string().optional(),
  amount: z.number(),
  paymentMethod: z.string(),
  referenceNumber: z.string().optional(),
  notes: z.string().optional(),
});

export type CreatePaymentFormData = z.infer<typeof CreatePaymentSchema>;

export const UpdatePaymentSchema = z.object({
  id: z.string().optional(),
  imageUrl: z.string().optional(),
  amount: z.number().optional(),
  paymentMethod: z.string().optional(),
  status: z.string().optional(),
  referenceNumber: z.string().optional(),
  notes: z.string().optional(),
});

export type UpdatePaymentFormData = z.infer<typeof UpdatePaymentSchema>;
