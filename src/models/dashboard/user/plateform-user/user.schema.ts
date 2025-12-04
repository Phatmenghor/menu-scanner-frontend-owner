import { z } from "zod";

// Common fields used in both create and update
const commonFields = {
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  phoneNumber: z.string().min(1, "Phone number is required"),
  position: z.string().optional(),
  address: z.string().optional(),
  accountStatus: z.string().min(1, "Account status is required"),
  roles: z.array(z.string()).min(1, "At least one role is required"),
  notes: z.string().optional(),
};

// Create user schema - requires additional fields
export const createUserSchema = z.object({
  ...commonFields,
  userIdentifier: z.string().min(1, "User identifier is required"),
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  userType: z.string().min(1, "User type is required"),
});

// Update user schema - only editable fields
export const updateUserSchema = z.object({
  ...commonFields,
  id: z.string().min(1, "User ID is required"),
});

// Type exports
export type CreateUserPayload = z.infer<typeof createUserSchema>;
export type UpdateUserPayload = z.infer<typeof updateUserSchema>;

// Combined form data type (union of both with all fields optional for flexibility)
export type UserFormData = {
  id?: string;
  userIdentifier?: string;
  email?: string;
  password?: string;
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  userType?: string;
  accountStatus?: string;
  roles?: string[];
  position?: string;
  address?: string;
  notes?: string;
};
