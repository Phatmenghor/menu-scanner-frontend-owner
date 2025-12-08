import { z } from "zod";

/**
 * Create Business Schema
 */
export const createBusinessSchema = z.object({
  name: z.string().min(1, "First name is required").optional(),
  email: z.string().min(1, "email is required").optional(),
  phone: z.string().min(1, "phone number is required").optional(),
  status: z.string().min(1, "status is required").optional(),
  address: z.string().optional().nullable(),
  description: z.string().optional(),
});

/**
 * Update Business Schema
 */
export const updateBusinessSchema = z.object({
  name: z.string().min(1, "First name is required").optional(),
  email: z.string().min(1, "email is required").optional(),
  phone: z.string().min(1, "phone number is required").optional(),
  status: z.string().min(1, "status is required").optional(),
  address: z.string().optional().nullable(),
  description: z.string().optional(),
});

/**
 * Business Form Data Type
 */
export type BusinessFormData = z.infer<typeof createBusinessSchema> & {
  id?: string;
};
