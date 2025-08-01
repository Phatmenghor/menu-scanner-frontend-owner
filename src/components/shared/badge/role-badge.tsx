import { Badge } from "@/components/ui/badge";
import { UserRole } from "@/constants/AppResource/status/status";
import {
  Crown,
  Shield,
  User,
  Briefcase,
  Users,
  Headphones,
  Store,
} from "lucide-react";

interface RoleBadgeProps {
  role: string;
}

export const RoleBadge: React.FC<RoleBadgeProps> = ({ role }) => {
  const getRoleConfig = (role: string) => {
    switch (role?.toUpperCase()) {
      // 🌐 Platform Roles
      case UserRole.PLATFORM_OWNER:
        return {
          icon: Crown,
          bg: "bg-purple-100 dark:bg-purple-900/30",
          hoverBg: "hover:bg-purple-200 dark:hover:bg-purple-800/50",
          text: "text-purple-700 dark:text-purple-400",
          hoverText: "hover:text-purple-900 dark:hover:text-purple-300",
          border: "border-purple-200 dark:border-purple-800",
          hoverBorder: "hover:border-purple-300 dark:hover:border-purple-700",
        };
      case UserRole.PLATFORM_ADMIN:
        return {
          icon: Shield,
          bg: "bg-orange-100 dark:bg-orange-900/30",
          hoverBg: "hover:bg-orange-200 dark:hover:bg-orange-800/50",
          text: "text-orange-700 dark:text-orange-400",
          hoverText: "hover:text-orange-900 dark:hover:text-orange-300",
          border: "border-orange-200 dark:border-orange-800",
          hoverBorder: "hover:border-orange-300 dark:hover:border-orange-700",
        };
      case UserRole.PLATFORM_MANAGER:
        return {
          icon: Users,
          bg: "bg-blue-100 dark:bg-blue-900/30",
          hoverBg: "hover:bg-blue-200 dark:hover:bg-blue-800/50",
          text: "text-blue-700 dark:text-blue-400",
          hoverText: "hover:text-blue-900 dark:hover:text-blue-300",
          border: "border-blue-200 dark:border-blue-800",
          hoverBorder: "hover:border-blue-300 dark:hover:border-blue-700",
        };
      case UserRole.PLATFORM_SUPPORT:
        return {
          icon: Headphones,
          bg: "bg-teal-100 dark:bg-teal-900/30",
          hoverBg: "hover:bg-teal-200 dark:hover:bg-teal-800/50",
          text: "text-teal-700 dark:text-teal-400",
          hoverText: "hover:text-teal-900 dark:hover:text-teal-300",
          border: "border-teal-200 dark:border-teal-800",
          hoverBorder: "hover:border-teal-300 dark:hover:border-teal-700",
        };

      // 🏢 Business Roles
      case UserRole.BUSINESS_OWNER:
        return {
          icon: Briefcase,
          bg: "bg-green-100 dark:bg-green-900/30",
          hoverBg: "hover:bg-green-200 dark:hover:bg-green-800/50",
          text: "text-green-700 dark:text-green-400",
          hoverText: "hover:text-green-900 dark:hover:text-green-300",
          border: "border-green-200 dark:border-green-800",
          hoverBorder: "hover:border-green-300 dark:hover:border-green-700",
        };
      case UserRole.BUSINESS_MANAGER:
        return {
          icon: Store,
          bg: "bg-cyan-100 dark:bg-cyan-900/30",
          hoverBg: "hover:bg-cyan-200 dark:hover:bg-cyan-800/50",
          text: "text-cyan-700 dark:text-cyan-400",
          hoverText: "hover:text-cyan-900 dark:hover:text-cyan-300",
          border: "border-cyan-200 dark:border-cyan-800",
          hoverBorder: "hover:border-cyan-300 dark:hover:border-cyan-700",
        };
      case UserRole.BUSINESS_STAFF:
        return {
          icon: User,
          bg: "bg-sky-100 dark:bg-sky-900/30",
          hoverBg: "hover:bg-sky-200 dark:hover:bg-sky-800/50",
          text: "text-sky-700 dark:text-sky-400",
          hoverText: "hover:text-sky-900 dark:hover:text-sky-300",
          border: "border-sky-200 dark:border-sky-800",
          hoverBorder: "hover:border-sky-300 dark:hover:border-sky-700",
        };

      // 👤 Customer
      case UserRole.CUSTOMER:
        return {
          icon: User,
          bg: "bg-gray-100 dark:bg-gray-800",
          hoverBg: "hover:bg-gray-200 dark:hover:bg-gray-700",
          text: "text-gray-700 dark:text-gray-400",
          hoverText: "hover:text-gray-900 dark:hover:text-gray-300",
          border: "border-gray-200 dark:border-gray-700",
          hoverBorder: "hover:border-gray-300 dark:hover:border-gray-600",
        };

      // Default fallback
      default:
        return {
          icon: User,
          bg: "bg-zinc-100 dark:bg-zinc-800",
          hoverBg: "hover:bg-zinc-200 dark:hover:bg-zinc-700",
          text: "text-zinc-700 dark:text-zinc-400",
          hoverText: "hover:text-zinc-900 dark:hover:text-zinc-300",
          border: "border-zinc-200 dark:border-zinc-700",
          hoverBorder: "hover:border-zinc-300 dark:hover:border-zinc-600",
        };
    }
  };

  const config = getRoleConfig(role);
  const Icon = config.icon;

  return (
    <Badge
      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border transition-colors
        ${config.bg} ${config.text} ${config.border}
        ${config.hoverBg} ${config.hoverText} ${config.hoverBorder}`}
    >
      {role.replaceAll("_", " ")}
    </Badge>
  );
};
