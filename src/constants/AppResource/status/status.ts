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
