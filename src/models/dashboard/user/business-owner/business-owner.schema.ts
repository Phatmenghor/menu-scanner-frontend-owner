import z from "zod";

export const BusinessOwnerCreateRequestSchema = z.object({
  // ✅ OWNER INFO
  ownerUserIdentifier: z.string().min(1, "Owner user identifier is required"),
  ownerEmail: z.string().email().optional(),
  ownerPassword: z
    .string()
    .min(4)
    .max(100, "Owner password must be between 4 and 100 characters"),
  ownerFirstName: z.string().min(1).max(50),
  ownerLastName: z.string().min(1).max(50),
  ownerPhone: z
    .string()
    .regex(/^(\\+855|0)?[1-9][0-9]{7,8}$/, {
      message: "Invalid phone number format for Cambodia",
    })
    .optional(),
  ownerAddress: z.string().optional(),

  // ✅ BUSINESS INFO
  businessName: z.string().min(1, "Business name is required"),
  businessEmail: z.string().email().optional(),
  businessPhone: z
    .string()
    .regex(/^(\\+855|0)?[1-9][0-9]{7,8}$/, {
      message: "Invalid phone number format for Cambodia",
    })
    .optional(),
  businessAddress: z.string().optional(),
  businessDescription: z.string().optional(),

  // ✅ SUBDOMAIN INFO
  preferredSubdomain: z
    .string()
    .min(3)
    .max(63)
    .regex(/^[a-z0-9][a-z0-9-]*[a-z0-9]$/, {
      message:
        "Subdomain can only contain lowercase letters, numbers, and hyphens. Cannot start or end with hyphen",
    }),
  subscriptionPlanId: z.string().uuid({ message: "Invalid UUID" }).optional(),
  subscriptionStartDate: z.string().optional(), // or z.coerce.date().optional()
  autoRenew: z.boolean().default(false).optional(),

  // ✅ PAYMENT INFO
  paymentImageUrl: z.string().url().optional(),
  paymentAmount: z.number().positive().optional(),
  paymentMethod: z.string().optional(), // Can also be z.nativeEnum(PaymentMethod)
  paymentStatus: z.string().optional(), // Can also be z.nativeEnum(PaymentStatus).default("PENDING")
  paymentReferenceNumber: z.string().optional(),
  paymentNotes: z.string().optional(),
});

export type BusinessOwnerFormData = z.infer<
  typeof BusinessOwnerCreateRequestSchema
>;
