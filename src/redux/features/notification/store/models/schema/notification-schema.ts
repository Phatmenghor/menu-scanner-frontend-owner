import { z } from "zod";

/**
 * Create Notification Schema
 */
export const createNotificationSchema = z.object({
  title: z.string().min(1, "Commune Code is required"),
  message: z.string().min(1, "Commune En is required"),
  messageType: z.string().min(1, "Commune Kh is required"),
  recipientType: z.string().min(1, "District code is required"),
  priority: z.string().optional().or(z.literal("")),
  userId: z.string().optional().or(z.literal("")),
  userName: z.string().optional().or(z.literal("")),
  businessId: z.string().optional().or(z.literal("")),
  sendSystemCopy: z.enum(["true", "false"]),
});

/**
 * Combined form data type - includes all possible fields
 */
export type NotificationFormData = {
  id: string;
  title: string;
  messageType: string;
  recipientType: string;
  priority: string;
  userId: string;
  userName: string;
  businessId: string;
  sendSystemCopy: string;
};
