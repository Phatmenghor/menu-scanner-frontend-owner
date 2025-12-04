import { AccountStatus, Status, UserRole } from "./status";

export const USER_PLATFORM_ROLE_FILTER = [
  { value: UserRole.ALL, label: "All Roles" },

  { value: UserRole.PLATFORM_OWNER, label: "Platform Owner" },
  { value: UserRole.PLATFORM_ADMIN, label: "Platform Admin" },
  { value: UserRole.PLATFORM_MANAGER, label: "Platform Manager" },
  { value: UserRole.PLATFORM_SUPPORT, label: "Platform Support" },
];

export const USER_BUSINESS_ROLE_FILTER = [
  { value: UserRole.ALL, label: "All Roles" },

  { value: UserRole.BUSINESS_OWNER, label: "Platform Owner" },
  { value: UserRole.BUSINESS_MANAGER, label: "Platform Admin" },
  { value: UserRole.BUSINESS_STAFF, label: "Platform Manager" },
];

// Auto renew filter options
export const AUTO_RENEW_FILTER = [
  { value: Status.ALL, label: "All Status" },
  { value: Status.ACTIVE, label: "Auto Renew" },
  { value: Status.INACTIVE, label: "Manual Renew" },
];

export const STATUS_FILTER = [
  { value: Status.ALL, label: "All Status" },
  { value: Status.ACTIVE, label: "Active" },
  { value: Status.INACTIVE, label: "Inactive" },
];

export const SUBSCRIPT_STATUS_FILTER = [
  { value: Status.ALL, label: "All Status" },
  { value: Status.ACTIVE, label: "Active" },
  { value: Status.INACTIVE, label: "Expried" },
];

export const ACCOUNT_STATUS_FILTER = [
  { value: AccountStatus.ALL, label: "All Status" },
  { value: AccountStatus.ACTIVE, label: "Active" },
  { value: AccountStatus.INACTIVE, label: "Inactive" },
  { value: AccountStatus.LOCKED, label: "Locked" },
  { value: AccountStatus.SUSPENDED, label: "Suspended" },
];
