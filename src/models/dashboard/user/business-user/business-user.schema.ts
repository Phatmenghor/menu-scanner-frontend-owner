import { z } from "zod";
import { UserFormData } from "../plateform-user/user.schema";
import { BUSINESS_USER_ROLE_OPTIONS } from "@/constants/AppResource/status/status";

export const updateMyBusinessSchema = z.object({
  logoUrl: z.string().url().optional().or(z.literal("")),
  name: z.string().optional(),
  description: z.string().optional(),
  phone: z.string().optional(),
  address: z.string().optional(),
  website: z.string().url().optional().or(z.literal("")),

  businessType: z.string().optional(),
  cuisineType: z.string().optional(),
  operatingHours: z
    .string()
    .regex(
      /^([A-Za-z,-]+):\s*\d{1,2}(AM|PM)-\d{1,2}(AM|PM)$/,
      "Operating hours must be in format like 'Mon-Sun: 6AM-10PM'"
    )
    .optional(),

  facebookUrl: z.string().url().optional().or(z.literal("")),
  instagramUrl: z.string().url().optional().or(z.literal("")),
  telegramContact: z.string().optional(),

  usdToKhrRate: z.coerce
    .number()
    .min(1000, "Exchange rate must be at least 1000 KHR per USD")
    .max(10000, "Exchange rate cannot exceed 10000 KHR per USD")
    .optional(),

  taxRate: z.coerce
    .number()
    .min(0, "Tax rate cannot be negative")
    .max(100, "Tax rate cannot exceed 100%")
    .optional(),

  serviceChargeRate: z.coerce
    .number()
    .min(0, "Service charge cannot be negative")
    .max(100, "Service charge cannot exceed 100%")
    .optional(),

  acceptsOnlinePayment: z.boolean().optional(),
  acceptsCashPayment: z.boolean().optional(),
  acceptsBankTransfer: z.boolean().optional(),
  acceptsMobilePayment: z.boolean().optional(),
});

export const updateMyBusiness = updateMyBusinessSchema.extend({
  id: z.string().min(1, "id is required").optional(),
});

export type MyBusinessFormData = z.infer<typeof updateMyBusiness>;

export const createBusinessUserSchema = z.object({
  ownerUserIdentifier: z.string().min(1, "Owner user identifier is required"),

  businessName: z.string().min(1, "Business name is required"),
  businessEmail: z.string().email("Invalid business email").optional(),
  businessPhone: z.string().optional(),
  businessAddress: z.string().optional(),
  businessDescription: z.string().optional(),

  preferredSubdomain: z.string().min(1, "Preferred subdomain is required"),

  ownerEmail: z.string().email("Invalid owner email").optional(),
  ownerPassword: z.string().min(6, "Password must be at least 6 characters"),
  ownerFirstName: z.string().min(1, "Owner first name is required"),
  ownerLastName: z.string().min(1, "Owner last name is required"),
  ownerPhone: z.string().optional(),
  ownerAddress: z.string().optional(),
});

export const updateBusinessUserSchema = z.object({
  id: z.string().min(1),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  phoneNumber: z.string().optional(),
  profileImageUrl: z.string().url().optional(),
  accountStatus: z.enum(["ACTIVE", "INACTIVE"]).optional(),
  businessId: z.string().uuid().optional(),
  roles: z.array(z.string()).optional(),
  position: z.string().optional(),
  address: z.string().optional(),
  notes: z.string().optional(),
});

export type CreateBusinessUserFormData = z.infer<
  typeof createBusinessUserSchema
>;
export type UpdateBusinessUserFormData = z.infer<
  typeof updateBusinessUserSchema
>;

export type BusinessUserFormData =
  | CreateBusinessUserFormData
  | UpdateBusinessUserFormData;

export function getDefaultFormData(
  formData?: CreateBusinessUserFormData | UpdateBusinessUserFormData
): UserFormData {
  const data = formData as UpdateBusinessUserFormData;
  return {
    id: data?.id?.trim() ?? "",
    firstName: data?.firstName?.trim() ?? "",
    lastName: data?.lastName?.trim() ?? "",
    phoneNumber: data?.phoneNumber?.trim() ?? "",
    profileImageUrl: data?.profileImageUrl?.trim() ?? "",
    businessId: data?.businessId?.trim() ?? "",
    roles: data?.roles ?? [BUSINESS_USER_ROLE_OPTIONS[0]?.value],
    position: data?.position?.trim() ?? "",
    address: data?.address?.trim() ?? "",
    notes: data?.notes?.trim() ?? "",
    password: "",

    // Only add these if it's a CreateBusinessUserFormData
    ...(isCreateBusinessUser(data) && {
      businessName: data.businessName?.trim() ?? "",
      preferredSubdomain: data.preferredSubdomain?.trim() ?? "",
      ownerUserIdentifier: data.ownerUserIdentifier?.trim() ?? "",
      ownerPassword: data.ownerPassword?.trim() ?? "",
      ownerFirstName: data.ownerFirstName?.trim() ?? "",
      ownerLastName: data.ownerLastName?.trim() ?? "",
      businessEmail: data.businessEmail?.trim(),
      businessPhone: data.businessPhone?.trim(),
      businessAddress: data.businessAddress?.trim(),
      businessDescription: data.businessDescription?.trim(),
      ownerEmail: data.ownerEmail?.trim(),
      ownerPhone: data.ownerPhone?.trim(),
      ownerAddress: data.ownerAddress?.trim(),
    }),
  };
}

function isCreateBusinessUser(data: any): data is CreateBusinessUserFormData {
  return (
    data &&
    "ownerUserIdentifier" in data &&
    "preferredSubdomain" in data &&
    "ownerPassword" in data
  );
}
