import {
  Calendar,
  Mail,
  Paperclip,
  Settings,
  Shield,
  User2,
  UserCheck,
} from "lucide-react";

export const UserTableHeaders = [
  { label: "#", className: "max-w-[20%]" },
  { label: "Profile", className: "max-w-[20%]", icon: Mail },
  { label: "User Identifier", className: "max-w-[20%]", icon: Paperclip },
  { label: "Email", className: "max-w-[20%]", icon: Mail },
  { label: "FullName", className: "max-w-[20%]", icon: User2 },
  { label: "Roles", className: "max-w-[20%]", icon: Shield },
  { label: "Status", className: "max-w-[20%]", icon: UserCheck },
  { label: "Created At", className: "max-w-[20%]", icon: Calendar },
  { label: "Actions", className: "max-w-[20%]", icon: Settings },
];

export function getUserTableHeaders(t: (key: string) => string) {
  return [
    { label: "#", className: "" },
    { label: t("table-header.email"), className: "max-w-[20%]", icon: Mail },
    {
      label: t("table-header.fullname"),
      className: "max-w-[20%]",
      icon: User2,
    },
    {
      label: t("table-header.userType"),
      className: "max-w-[20%]",
      icon: Shield,
    },
    {
      label: t("table-header.status"),
      className: "max-w-[20%]",
      icon: UserCheck,
    },
    {
      label: t("table-header.createdAt"),
      className: "max-w-[20%]",
      icon: Calendar,
    },
    {
      label: t("table-header.actions"),
      className: "justify-center max-w-[20%]",
      icon: Settings,
    },
  ];
}
