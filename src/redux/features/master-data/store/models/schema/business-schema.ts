import { z } from "zod";

/**
 * Create Business Schema
 */
export const createBusinessSchema = z.object({
  name: z.string().min(1, "Business name is required"),
  email: z.string().min(1, "Email is required").email("Invalid email format"),
  phone: z
    .string()
    .min(1, "Phone number is required")
    .regex(/^\+?[\d\s-()]+$/, "Invalid phone number format"),
  status: z.string().min(1, "Status is required"),
  address: z.string().optional().or(z.literal("")),
  description: z.string().optional().or(z.literal("")),
});

/**
 * Update Business Schema
 */
export const updateBusinessSchema = z.object({
  id: z.string().min(1, "Business ID is required"),
  name: z.string().min(1, "Business name is required"),
  email: z.string().min(1, "Email is required").email("Invalid email format"),
  phone: z
    .string()
    .min(1, "Phone number is required")
    .regex(/^\+?[\d\s-()]+$/, "Invalid phone number format"),
  status: z.string().min(1, "Status is required"),
  address: z.string().optional().or(z.literal("")),
  description: z.string().optional().or(z.literal("")),
});

/**
 * Combined form data type - includes all possible fields
 */
export type BusinessFormData = {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: string;
  address?: string;
  description?: string;
};
