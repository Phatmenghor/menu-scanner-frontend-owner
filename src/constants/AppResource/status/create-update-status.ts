import {
  AccountStatus,
  PaymentMethod,
  PaymentStatus,
  Status,
  UserRole,
} from "./status";

export const USER_PLATFORM_ROLE_CREATE_UPDATE = [
  { value: UserRole.PLATFORM_OWNER, label: "Platform Owner" },
  { value: UserRole.PLATFORM_ADMIN, label: "Platform Admin" },
  { value: UserRole.PLATFORM_MANAGER, label: "Platform Manager" },
  { value: UserRole.PLATFORM_SUPPORT, label: "Platform Support" },
];

export const USER_BUSINESS_ROLE_CREATE_UPDATE = [
  { value: UserRole.BUSINESS_OWNER, label: "Business Owner" },
  { value: UserRole.BUSINESS_MANAGER, label: "Business Manager" },
  { value: UserRole.BUSINESS_STAFF, label: "Business Staff" },
];

export const ACCOUNT_STATUS_CREATE_UPDATE = [
  { value: AccountStatus.ACTIVE, label: "Active" },
  { value: AccountStatus.INACTIVE, label: "Inactive" },
  { value: AccountStatus.LOCKED, label: "Locked" },
  { value: AccountStatus.SUSPENDED, label: "Suspended" },
];

export const PAYMENT_STATUS_CREATE_UPDATE = [
  { value: PaymentStatus.PENDING, label: "Pending" },
  { value: PaymentStatus.COMPLETED, label: "Completed" },
  { value: PaymentStatus.FAILED, label: "Failed" },
  { value: PaymentStatus.CANCELLED, label: "Cancelled" },
];

export const PAYMENT_METHODS_CREATE_UPDATE = [
  { value: PaymentMethod.BANK_TRANSFER, label: "Bank Transfer" },
  { value: PaymentMethod.CASH, label: "Cash" },
  {
    value: PaymentMethod.MOBILE_PAYMENT,
    label: "Mobile Payment",
  },
  { value: PaymentMethod.ONLINE, label: "Online Payment" },
];

export const CANCELLATION_REASONS_CREATE_UPDATE = [
  { value: "too-expensive", label: "Too expensive" },
  { value: "not-using", label: "Not using enough" },
  { value: "missing-features", label: "Missing features" },
  { value: "found-alternative", label: "Found alternative" },
  { value: "technical-issues", label: "Technical issues" },
  { value: "business-closed", label: "Business closed" },
  { value: "other", label: "Other" },
];
