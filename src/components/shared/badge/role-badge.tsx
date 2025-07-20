import { Badge } from "@/components/ui/badge";
import { Crown, Shield, User } from "lucide-react";

interface RoleBadgeProps {
  role: string;
}

export const RoleBadge: React.FC<RoleBadgeProps> = ({ role }) => {
  const getRoleConfig = (role: string) => {
    switch (role?.toUpperCase()) {
      case "DEVELOPER":
        return {
          icon: Crown,
          bg: "bg-red-100 dark:bg-red-900/30",
          hoverBg: "hover:bg-red-200 dark:hover:bg-red-800/50",
          text: "text-red-700 dark:text-red-400",
          hoverText: "hover:text-red-900 dark:hover:text-red-300",
          border: "border-red-200 dark:border-red-800",
          hoverBorder: "hover:border-red-300 dark:hover:border-red-700",
        };
      case "ADMIN":
        return {
          icon: Shield,
          bg: "bg-orange-100 dark:bg-orange-900/30",
          hoverBg: "hover:bg-orange-200 dark:hover:bg-orange-800/50",
          text: "text-orange-700 dark:text-orange-400",
          hoverText: "hover:text-orange-900 dark:hover:text-orange-300",
          border: "border-orange-200 dark:border-orange-800",
          hoverBorder: "hover:border-orange-300 dark:hover:border-orange-700",
        };
      case "USER":
        return {
          icon: User,
          bg: "bg-green-100 dark:bg-green-900/30",
          hoverBg: "hover:bg-green-200 dark:hover:bg-green-800/50",
          text: "text-green-700 dark:text-green-400",
          hoverText: "hover:text-green-900 dark:hover:text-green-300",
          border: "border-green-200 dark:border-green-800",
          hoverBorder: "hover:border-green-300 dark:hover:border-green-700",
        };
      default:
        return {
          icon: User,
          bg: "bg-gray-100 dark:bg-gray-800",
          hoverBg: "hover:bg-gray-200 dark:hover:bg-gray-700",
          text: "text-gray-700 dark:text-gray-400",
          hoverText: "hover:text-gray-900 dark:hover:text-gray-300",
          border: "border-gray-200 dark:border-gray-700",
          hoverBorder: "hover:border-gray-300 dark:hover:border-gray-600",
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
      <Icon className="h-3 w-3 mr-1" />
      {role}
    </Badge>
  );
};
