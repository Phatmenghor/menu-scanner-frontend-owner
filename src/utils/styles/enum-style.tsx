import { Crown, User, UserCheck, Users } from "lucide-react";
import type React from "react";

export const getStatusColor = (status: string) => {
  switch (status?.toUpperCase()) {
    case "ACTIVE":
      return "bg-green-50 text-green-700 border-green-200";
    case "INACTIVE":
      return "bg-gray-50 text-gray-700 border-gray-200";
    case "LOCKED":
      return "bg-orange-50 text-orange-700 border-orange-200";
    case "SUSPENDED":
      return "bg-red-50 text-red-700 border-red-200";
    default:
      return "bg-gray-50 text-gray-700 border-gray-200";
  }
};

export const getUserTypeColor = (userType: string | null) => {
  switch (userType?.toUpperCase()) {
    case "PLATFORM_USER":
      return "bg-purple-50 text-purple-700 border-purple-200";
    case "BUSINESS_USER":
      return "bg-blue-50 text-blue-700 border-blue-200";
    case "CUSTOMER":
      return "bg-green-50 text-green-700 border-green-200";
    default:
      return "bg-gray-50 text-gray-700 border-gray-200";
  }
};

export const getUserRoleColor = (role: string): string => {
  const roleUpper = role?.toUpperCase();

  // Platform Roles
  if (roleUpper === "PLATFORM_OWNER") {
    return "bg-purple-50 text-purple-700 border-purple-300";
  }
  if (roleUpper === "PLATFORM_ADMIN") {
    return "bg-indigo-50 text-indigo-700 border-indigo-300";
  }
  if (roleUpper === "PLATFORM_MANAGER") {
    return "bg-violet-50 text-violet-700 border-violet-300";
  }
  if (roleUpper === "PLATFORM_SUPPORT") {
    return "bg-blue-50 text-blue-700 border-blue-300";
  }

  // Business Roles
  if (roleUpper === "BUSINESS_OWNER") {
    return "bg-amber-50 text-amber-700 border-amber-300";
  }
  if (roleUpper === "BUSINESS_MANAGER") {
    return "bg-orange-50 text-orange-700 border-orange-300";
  }
  if (roleUpper === "BUSINESS_STAFF") {
    return "bg-yellow-50 text-yellow-700 border-yellow-300";
  }

  // Customer Role
  if (roleUpper === "CUSTOMER") {
    return "bg-green-50 text-green-700 border-green-300";
  }

  // Default
  return "bg-gray-50 text-gray-700 border-gray-300";
};

export const getUserTypeIcon = (
  userType: string | null
): React.ReactElement => {
  switch (userType?.toUpperCase()) {
    case "PLATFORM_USER":
      return <Crown className="h-3.5 w-3.5" />;
    case "BUSINESS_USER":
      return <UserCheck className="h-3.5 w-3.5" />;
    case "CUSTOMER":
      return <Users className="h-3.5 w-3.5" />;
    default:
      return <User className="h-3.5 w-3.5" />;
  }
};

export const formatEnumToDisplay = (value: string): string => {
  if (!value) return "---";
  // Convert PLATFORM_USER to Platform User
  return value
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
};
