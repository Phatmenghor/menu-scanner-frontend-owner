export enum Status {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
}

export const STATUS_FILTER = [
  { value: "ALL", label: "All Status" },
  { value: Status.ACTIVE, label: "Active" },
  { value: Status.INACTIVE, label: "Inactive" },
];

export const STATUS_USER_OPTIONS = [
  { value: Status.ACTIVE, label: "Active" },
  { value: Status.INACTIVE, label: "Inactive" },
];

export const DATA_ROLE_OPTIONS = [
  { value: "ADMIN", label: "Admin" },
  { value: "USER", label: "User" },
];

// Types
export enum ModalMode {
  CREATE_MODE = "create",
  UPDATE_MODE = "update",
}

export enum UserRole {
  PLATFORM_OWNER = "PLATFORM_OWNER",
  PLATFORM_ADMIN = "PLATFORM_ADMIN",
  PLATFORM_MANAGER = "PLATFORM_MANAGER",
  PLATFORM_SUPPORT = "PLATFORM_SUPPORT",

  BUSINESS_OWNER = "BUSINESS_OWNER",
  BUSINESS_MANAGER = "BUSINESS_MANAGER",
  BUSINESS_STAFF = "BUSINESS_STAFF",

  CUSTOMER = "CUSTOMER",
}

export enum BusinessUserRole {
  BUSINESS_OWNER = "BUSINESS_OWNER",
  BUSINESS_MANAGER = "BUSINESS_MANAGER",
  BUSINESS_STAFF = "BUSINESS_STAFF",

  CUSTOMER = "CUSTOMER",
}

export enum SubscriptionPlanStatus {
  PUBLIC = "PUBLIC",
  PRIVATE = "PRIVATE",
}

export const SUBSCRIPTION_PLAN_OPTIONS = [
  { value: SubscriptionPlanStatus.PUBLIC, label: "Public" },
  { value: SubscriptionPlanStatus.PRIVATE, label: "Private" },
];

export const USER_ROLE_OPTIONS = [
  // Platform Roles
  { value: UserRole.PLATFORM_OWNER, label: "Platform Owner" },
  { value: UserRole.PLATFORM_ADMIN, label: "Platform Admin" },
  { value: UserRole.PLATFORM_MANAGER, label: "Platform Manager" },
  { value: UserRole.PLATFORM_SUPPORT, label: "Platform Support" },

  // Business Roles
  { value: UserRole.BUSINESS_OWNER, label: "Business Owner" },
  { value: UserRole.BUSINESS_MANAGER, label: "Business Manager" },
  { value: UserRole.BUSINESS_STAFF, label: "Business Staff" },

  // Customer Role
  { value: UserRole.CUSTOMER, label: "Customer" },
];

export const BUSINESS_USER_ROLE_OPTIONS = [
  { value: BusinessUserRole.BUSINESS_MANAGER, label: "Manager" },
  { value: BusinessUserRole.BUSINESS_STAFF, label: "Staff" },
];

export enum UserType {
  PLATFORM_USER = "PLATFORM_USER",
  BUSINESS_USER = "BUSINESS_USER",
  CUSTOMER = "CUSTOMER",
}

export enum BusinessUserType {
  BUSINESS_USER = "BUSINESS_USER",
  CUSTOMER = "CUSTOMER",
}

export const BUSINESS_USER_TYPE_OPTIONS = [
  { value: BusinessUserType.BUSINESS_USER, label: "Business User" },
  { value: BusinessUserType.CUSTOMER, label: "Customer" },
];

export const USER_TYPE_OPTIONS = [
  { value: UserType.PLATFORM_USER, label: "Platform User" },
  { value: UserType.BUSINESS_USER, label: "Business User" },
  { value: UserType.CUSTOMER, label: "Customer" },
];

export enum BusinessStatus {
  All = "All",
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
  SUSPENDED = "SUSPENDED",
  PENDING = "PENDING",
}

export const BUSINESS_STATUS_OPTIONS = [
  { value: undefined, label: "All" },
  { value: BusinessStatus.ACTIVE, label: "Active" },
  { value: BusinessStatus.INACTIVE, label: "Inactive" },
  { value: BusinessStatus.SUSPENDED, label: "Suspended" },
  { value: BusinessStatus.PENDING, label: "Pending Approval" },
];

export const PAYMENT_STATUS_OPTIONS = [
  { value: "PENDING", label: "Pending" },
  { value: "COMPLETED", label: "Completed" },
  { value: "FAILED", label: "Failed" },
  { value: "CANCELLED", label: "Cancelled" },
];

export const SUBDOMAIN_STATUS_OPTIONS = {
  ACTIVE: "Active - Domain is live and accessible",
  SUSPENDED: "Suspended - Domain is temporarily disabled",
  EXPIRED: "Expired - Subscription has expired",
} as const;
