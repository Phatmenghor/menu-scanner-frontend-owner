// user.schema.ts
import { z } from "zod";

/**
 * Create User Schema
 */
export const createUserSchema = z.object({
  userIdentifier: z
    .string()
    .min(1, "User identifier is required")
    .min(3, "User identifier must be at least 3 characters"),
  email: z.string().min(1, "Email is required").email("Invalid email format"),
  password: z
    .string()
    .min(1, "Password is required")
    .min(8, "Password must be at least 8 characters"),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  phoneNumber: z
    .string()
    .regex(/^\+?[\d\s-()]+$/, "Invalid phone number format"),
  profileImageUrl: z.string().url("Invalid URL").optional().or(z.literal("")),
  userType: z.string().min(1, "User type is required"),
  businessId: z.string().optional().or(z.literal("")),
  roles: z.array(z.string()).min(1, "At least one role is required"),
  position: z.string().optional().or(z.literal("")),
  address: z.string().optional().or(z.literal("")),
  notes: z.string().optional().or(z.literal("")),
  accountStatus: z.string().min(1, "Account status is required"),
});

/**
 * Update User Schema
 */
export const updateUserSchema = z.object({
  id: z.string().min(1, "User ID is required"),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  phoneNumber: z
    .string()
    .regex(/^\+?[\d\s-()]+$/, "Invalid phone number format"),
  profileImageUrl: z.string().url("Invalid URL").optional().or(z.literal("")),
  accountStatus: z.string().min(1, "Account status is required"),
  businessId: z.string().optional().or(z.literal("")),
  roles: z.array(z.string()).min(1, "At least one role is required"),
  position: z.string().optional().or(z.literal("")),
  address: z.string().optional().or(z.literal("")),
  notes: z.string().optional().or(z.literal("")),
});

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.newPassword !== data.currentPassword, {
    message: "New password must be different from current password",
    path: ["newPassword"],
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

/**
 * Combined form data type - includes all possible fields
 */
export type UserFormData = {
  id: string;
  userIdentifier?: string;
  email?: string;
  password?: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  profileImageUrl?: string;
  userType?: string;
  businessId?: string;
  roles: string[];
  position?: string;
  address?: string;
  notes?: string;
  accountStatus: string;
};
