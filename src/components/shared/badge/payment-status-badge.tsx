import React from "react";
import { Badge } from "@/components/ui/badge";
import { Clock, CheckCircle, XCircle, Ban } from "lucide-react";

export const PAYMENT_STATUS_OPTIONS = {
  PENDING: "Pending",
  COMPLETED: "Completed",
  FAILED: "Failed",
  CANCELLED: "Cancelled",
} as const;

export type PaymentStatus = keyof typeof PAYMENT_STATUS_OPTIONS;

interface PaymentStatusBadgeProps {
  status: string;
}

export const PaymentStatusBadge: React.FC<PaymentStatusBadgeProps> = ({
  status,
}) => {
  const getStatusConfig = (status: string) => {
    switch (status?.toUpperCase()) {
      case "PENDING":
        return {
          icon: Clock,
          bg: "bg-yellow-100 dark:bg-yellow-900/30",
          hoverBg: "hover:bg-yellow-200 dark:hover:bg-yellow-800/50",
          text: "text-yellow-700 dark:text-yellow-400",
          hoverText: "hover:text-yellow-900 dark:hover:text-yellow-300",
          border: "border-yellow-200 dark:border-yellow-800",
          hoverBorder: "hover:border-yellow-300 dark:hover:border-yellow-700",
          label: PAYMENT_STATUS_OPTIONS.PENDING,
        };
      case "COMPLETED":
        return {
          icon: CheckCircle,
          bg: "bg-green-100 dark:bg-green-900/30",
          hoverBg: "hover:bg-green-200 dark:hover:bg-green-800/50",
          text: "text-green-700 dark:text-green-400",
          hoverText: "hover:text-green-900 dark:hover:text-green-300",
          border: "border-green-200 dark:border-green-800",
          hoverBorder: "hover:border-green-300 dark:hover:border-green-700",
          label: PAYMENT_STATUS_OPTIONS.COMPLETED,
        };
      case "FAILED":
        return {
          icon: XCircle,
          bg: "bg-red-100 dark:bg-red-900/30",
          hoverBg: "hover:bg-red-200 dark:hover:bg-red-800/50",
          text: "text-red-700 dark:text-red-400",
          hoverText: "hover:text-red-900 dark:hover:text-red-300",
          border: "border-red-200 dark:border-red-800",
          hoverBorder: "hover:border-red-300 dark:hover:border-red-700",
          label: PAYMENT_STATUS_OPTIONS.FAILED,
        };
      case "CANCELLED":
        return {
          icon: Ban,
          bg: "bg-gray-100 dark:bg-gray-800",
          hoverBg: "hover:bg-gray-200 dark:hover:bg-gray-700",
          text: "text-gray-700 dark:text-gray-400",
          hoverText: "hover:text-gray-900 dark:hover:text-gray-300",
          border: "border-gray-200 dark:border-gray-700",
          hoverBorder: "hover:border-gray-300 dark:hover:border-gray-600",
          label: PAYMENT_STATUS_OPTIONS.CANCELLED,
        };
      default:
        return {
          icon: Ban,
          bg: "bg-gray-100 dark:bg-gray-800",
          hoverBg: "hover:bg-gray-200 dark:hover:bg-gray-700",
          text: "text-gray-700 dark:text-gray-400",
          hoverText: "hover:text-gray-900 dark:hover:text-gray-300",
          border: "border-gray-200 dark:border-gray-700",
          hoverBorder: "hover:border-gray-300 dark:hover:border-gray-600",
          label: status,
        };
    }
  };

  const config = getStatusConfig(status);
  const Icon = config.icon;

  return (
    <Badge
      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border transition-colors
        ${config.bg} ${config.text} ${config.border}
        ${config.hoverBg} ${config.hoverText} ${config.hoverBorder}`}
      title={config.label}
    >
      <Icon className="h-3 w-3 mr-1" />
      {config.label}
    </Badge>
  );
};
