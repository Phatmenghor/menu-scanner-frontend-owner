import z from "zod";

// Base business schema for shared fields
const BaseBusinessSchema = z.object({
  name: z.string().min(1, "Business name is required"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().optional(),
  address: z.string().optional(),
  description: z.string().optional(),
});

// Create schema
export const createBusinessSchema = BaseBusinessSchema;

// Update schema
export const updateBusinessSchema = BaseBusinessSchema.partial().extend({
  status: z.string().optional(),
});

// UI form schema — includes `id` for editing
export const BusinessFormSchema = updateBusinessSchema.extend({
  id: z.string().min(1, "Business ID is required").optional(),
});

// Types
export type CreateBusinessSchema = z.infer<typeof createBusinessSchema>;
export type UpdateBusinessSchema = z.infer<typeof updateBusinessSchema>;

// Form data type used for both create/update UI
export type BusinessFormData = z.infer<typeof BusinessFormSchema> & {
  id?: string;
};
