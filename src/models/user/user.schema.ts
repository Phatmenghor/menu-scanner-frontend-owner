import z from "zod";
import { UserModel } from "./user.response";

// Base schema with common fields (you would define this based on your BaseStaffSchema)
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

// Base user schema picking specific fields from BaseStaffSchema
const BaseUserSchema = BaseStaffSchema.pick({
  email: true,
  profileImageUrl: true,
  accountStatus: true,
  roles: true,
  phoneNumber: true,
  userType: true,
  businessId: true,
  position: true,
  address: true,
  notes: true,
}).extend({
  username: z.string().min(1, "Username is required"),
  first_name: z.string().min(1, "First name is required"),
  last_name: z.string().min(1, "Last name is required"),
});

// Schema for creating a user with password validation
export const createUserSchema = BaseUserSchema.extend({
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z
    .string()
    .min(8, "Confirm Password must be at least 8 characters"),
}).refine(
  (data) => {
    return data.password === data.confirmPassword;
  },
  {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  }
);

// Schema for updating a user (password fields are optional)
export const updateUserSchema = BaseUserSchema.extend({
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .optional(),
  confirmPassword: z
    .string()
    .min(8, "Confirm Password must be at least 8 characters")
    .optional(),
}).refine(
  (data) => {
    // If password or confirmPassword is provided, ensure both match
    if (data.password || data.confirmPassword) {
      return data.password === data.confirmPassword;
    }
    // Otherwise, skip validation
    return true;
  },
  {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  }
);

// Combined form schema for both create and update modes
export const UserFormSchema = BaseUserSchema.extend({
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .optional(),
  confirmPassword: z
    .string()
    .min(8, "Confirm Password must be at least 8 characters")
    .optional(),
}).refine(
  (data) => {
    // If password or confirmPassword is provided, ensure both match
    if (data.password || data.confirmPassword) {
      return data.password === data.confirmPassword;
    }
    // Otherwise, skip validation
    return true;
  },
  {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  }
);

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
