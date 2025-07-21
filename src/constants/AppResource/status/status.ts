import { locales } from "@/i18n";
import { AppLanguage } from "../language/language";

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

export enum UserType {
  PLATFORM_USER = "PLATFORM_USER",
  BUSINESS_USER = "BUSINESS_USER",
  CUSTOMER = "CUSTOMER",
}

export const USER_TYPE_OPTIONS = [
  { value: UserType.PLATFORM_USER, label: "Platform User" },
  { value: UserType.BUSINESS_USER, label: "Business User" },
  { value: UserType.CUSTOMER, label: "Customer" },
];

// Define locale display names and flags
export const localeConfig = {
  en: {
    name: "English",
    nativeName: "English",
    flag: AppLanguage.en,
    code: "EN",
  },
  kh: {
    name: "Khmer",
    nativeName: "ខ្មែរ",
    flag: AppLanguage.kh,
    code: "KH",
  },
  "zh-CN": {
    name: "Chinese",
    nativeName: "简体中文",
    flag: AppLanguage["zh-CN"],
    code: "ZH",
  },
} as const;
