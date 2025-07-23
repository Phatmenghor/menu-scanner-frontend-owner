import { BusinessStatus } from "@/constants/AppResource/status/status";

interface StatusBadgeProps {
  status: string;
  isSubscriptionActive?: boolean;
  isExpiringSoon?: boolean;
}

export const BusinessStatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  isSubscriptionActive,
  isExpiringSoon,
}) => {
  const getStatusConfig = (status: string) => {
    switch (status) {
      case BusinessStatus.ACTIVE:
        if (isExpiringSoon) {
          return {
            className:
              "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
            label: "Expiring Soon",
          };
        }
        return {
          className:
            "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
          label: "Active",
        };
      case BusinessStatus.INACTIVE:
        return {
          className:
            "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200",
          label: "Inactive",
        };
      case BusinessStatus.SUSPENDED:
        return {
          className:
            "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
          label: "Suspended",
        };
      case BusinessStatus.PENDING:
        return {
          className:
            "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
          label: "Pending Approval",
        };
      default:
        return {
          className:
            "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200",
          label: "Unknown",
        };
    }
  };

  const statusConfig = getStatusConfig(status);

  return (
    <span
      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${statusConfig.className}`}
    >
      {statusConfig.label}
    </span>
  );
};
