import { z } from "zod";

/**
 * Create User Schema
 */
export const createUserSchema = z.object({
  userIdentifier: z
    .string()
    .min(1, "User identifier is required")
    .min(3, "User identifier must be at least 3 characters"),
  email: z.string().email("Invalid email format").optional(),
  password: z
    .string()
    .min(1, "Password is required")
    .min(8, "Password must be at least 8 characters")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      "Password must contain uppercase, lowercase, and number"
    ),
  firstName: z.string().min(1, "First name is required").optional(),
  lastName: z.string().min(1, "Last name is required").optional(),
  phoneNumber: z
    .string()
    .regex(/^\+?[\d\s-()]+$/, "Invalid phone number format")
    .optional(),
  profileImageUrl: z.string().url("Invalid URL").optional().nullable(),
  userType: z.string().min(1, "User type is required"),
  businessId: z.string().optional().nullable(),
  roles: z.array(z.string()).min(1, "At least one role is required"),
  position: z.string().optional().nullable(),
  address: z.string().optional().nullable(),
  notes: z.string().optional().nullable(),
  accountStatus: z.string().optional(),
});

/**
 * Update User Schema
 */
export const updateUserSchema = z.object({
  id: z.string().min(1, "User ID is required"),
  firstName: z.string().min(1, "First name is required").optional(),
  lastName: z.string().min(1, "Last name is required").optional(),
  phoneNumber: z
    .string()
    .regex(/^\+?[\d\s-()]+$/, "Invalid phone number format")
    .optional(),
  profileImageUrl: z.string().url("Invalid URL").optional().nullable(),
  accountStatus: z.string().optional(),
  businessId: z.string().optional().nullable(),
  roles: z.array(z.string()).min(1, "At least one role is required").optional(),
  position: z.string().optional().nullable(),
  address: z.string().optional().nullable(),
  notes: z.string().optional().nullable(),
});

/**
 * User Form Data Type
 */
export type UserFormData = z.infer<typeof createUserSchema> & {
  id?: string;
};
