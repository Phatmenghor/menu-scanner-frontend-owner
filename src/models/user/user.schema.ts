import z from "zod";
import { UserModel } from "./user.response";

// Base schema with common fields
const BaseStaffSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  roles: z.array(z.string()).optional(),
  phoneNumber: z.string().optional(),
  profileImageUrl: z.string().optional(),
  accountStatus: z.string().optional(),
  userType: z.string().min(1, "User type is required"),
  businessId: z.string().optional(),
  position: z.string().optional(),
  address: z.string().optional(),
  notes: z.string().optional(),
});

// Base user schema tailored to full user form
const BaseUserSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  phoneNumber: z.string().optional(),
  profileImageUrl: z.string().optional(),
  accountStatus: z.string().optional(),
  businessId: z.string().optional(),
  roles: z.array(z.string()).optional(),
  position: z.string().optional(),
  address: z.string().optional(),
  notes: z.string().optional(),
});

// Schema for creating a user (email, userType, username, password required)
export const createUserSchema = BaseUserSchema.extend({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  userType: z.string().min(1, "User type is required"),
  username: z.string().min(1, "Username is required"),
});

// Schema for updating a user (only editable fields, no password, email, or userType)
export const updateUserSchema = BaseUserSchema.extend({
  id: z.string().min(1, "UserId is required").optional(),
});

// Combined form schema (same as update, but allows password optionally for UI)
export const UserFormSchema = BaseUserSchema.extend({
  email: z.string().email("Please enter a valid email address").optional(),
  username: z.string().min(1, "Username is required").optional(),
  userType: z.string().min(1, "User type is required").optional(),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .optional(),
});

// Type definitions
export type CreateUserSchema = z.infer<typeof createUserSchema>;
export type UpdateUserSchema = z.infer<typeof updateUserSchema>;

// Form data type including optional id and selected user for editing contexts
export type UserFormData = z.infer<typeof UserFormSchema> & {
  id?: string;
  selectedUser?: UserModel; // Replace with your UserRespondModel type
};

// Additional interfaces for backward compatibility
export interface CreateUsers extends CreateUserSchema {}
export interface UpdateUsers extends UpdateUserSchema {}
