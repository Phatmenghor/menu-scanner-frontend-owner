import {
  Calendar,
  Mail,
  Settings,
  Shield,
  User2,
  UserCheck,
} from "lucide-react";

export const UserTableHeaders = [
  { label: "#", className: "" },
  { label: "Email", className: "", icon: Mail },
  { label: "FullName", className: "", icon: User2 },
  { label: "UserType", className: "", icon: Shield },
  { label: "Status", className: "", icon: UserCheck },
  { label: "Created At", className: "", icon: Calendar },
  { label: "Actions", className: "", icon: Settings },
];

export function getUserTableHeaders(t: (key: string) => string) {
  return [
    { label: "#", className: "" },
    { label: t("table-header.email"), className: "", icon: Mail },
    { label: t("table-header.fullname"), className: "", icon: User2 },
    { label: t("table-header.userType"), className: "", icon: Shield },
    { label: t("table-header.status"), className: "", icon: UserCheck },
    { label: t("table-header.createdAt"), className: "", icon: Calendar },
    {
      label: t("table-header.actions"),
      className: "justify-center",
      icon: Settings,
    },
  ];
}

export const BusinessTableHeaders = [
  { label: "#", className: "" },
  { label: "Business", className: "" },
  { label: "Type", className: "" },
  { label: "Contact", className: "" },
  { label: "Subscription", className: "" },
  { label: "Status", className: "" },
  { label: "Created", className: "" },
  { label: "Actions", className: "" },
];
