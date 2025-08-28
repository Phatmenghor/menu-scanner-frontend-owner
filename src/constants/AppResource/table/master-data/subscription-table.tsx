import {
  SubscriptionModel,
  AllSubscriptionResponse,
} from "@/models/dashboard/master-data/subscription/subscription.response.model";
import { indexDisplay } from "@/utils/common/common";
import { dateTimeFormat, formatDate } from "@/utils/date/date-time-format";
import { Edit, Eye, Trash, RotateCcw, X } from "lucide-react";
import { ActionButton } from "@/components/shared/common/action-button";
import { TableColumn } from "@/components/shared/common/data-table";

interface SubscriptionTableHandlers {
  handleEditSubscription: (subscription: SubscriptionModel) => void;
  handleViewSubscriptionDetail: (subscription: SubscriptionModel) => void;
  handleDelete: (subscription: SubscriptionModel) => void;
  handleRenewSubscription: (subscription: SubscriptionModel) => void;
  handleCancelSubscription: (subscription: SubscriptionModel) => void;
}

interface SubscriptionTableOptions {
  data: AllSubscriptionResponse | null;
  handlers: SubscriptionTableHandlers;
}

export const createSubscriptionTableColumns = ({
  data,
  handlers,
}: SubscriptionTableOptions): TableColumn<SubscriptionModel>[] => {
  const {
    handleEditSubscription,
    handleViewSubscriptionDetail,
    handleDelete,
    handleRenewSubscription,
    handleCancelSubscription,
  } = handlers;

  return [
    {
      key: "index",
      label: "#",
      className: "max-w-[60px]",
      render: (_, index) => (
        <span className="font-medium">
          {indexDisplay(data?.pageNo || 1, data?.pageSize || 10, index)}
        </span>
      ),
    },
    {
      key: "businessName",
      label: "Business",
      className: "max-w-[150px]",
      render: (subscription) => (
        <span className="font-medium" title={subscription.businessName}>
          {subscription.businessName || "---"}
        </span>
      ),
    },
    {
      key: "planName",
      label: "Plan",
      className: "max-w-[120px]",
      render: (subscription) => (
        <span title={subscription.planName}>
          {subscription.planName || "---"}
        </span>
      ),
    },
    {
      key: "planPrice",
      label: "Price",
      className: "max-w-[80px]",
      render: (subscription) => (
        <span className="font-medium">${subscription.planPrice || 0}</span>
      ),
    },
    {
      key: "planDurationDays",
      label: "Duration",
      className: "max-w-[80px]",
      render: (subscription) => (
        <span>{subscription.planDurationDays} days</span>
      ),
    },
    {
      key: "startDate",
      label: "Start Date",
      className: "max-w-[100px]",
      render: (subscription) => (
        <span className="text-muted-foreground">
          {formatDate(subscription.startDate) || "---"}
        </span>
      ),
    },
    {
      key: "endDate",
      label: "End Date",
      className: "max-w-[100px]",
      render: (subscription) => (
        <span className="text-muted-foreground">
          {formatDate(subscription.endDate) || "---"}
        </span>
      ),
    },
    {
      key: "daysRemaining",
      label: "Days Left",
      className: "max-w-[80px]",
      render: (subscription) => {
        const isExpired = subscription.daysRemaining <= 0;
        const isExpiringSoon =
          subscription.daysRemaining > 0 && subscription.daysRemaining <= 7;

        return (
          <span
            className={
              isExpired
                ? "text-red-600 font-medium"
                : isExpiringSoon
                ? "text-yellow-600 font-medium"
                : "text-muted-foreground"
            }
          >
            {subscription.daysRemaining || 0}
          </span>
        );
      },
    },
    {
      key: "status",
      label: "Status",
      className: "max-w-[100px]",
      render: (subscription) => {
        const isExpired = subscription.daysRemaining <= 0;
        const isExpiringSoon =
          subscription.daysRemaining > 0 && subscription.daysRemaining <= 7;

        if (isExpired) {
          return (
            <span className="px-2 py-1 rounded-full text-xs font-medium text-red-700 bg-red-100">
              Expired
            </span>
          );
        } else if (isExpiringSoon) {
          return (
            <span className="px-2 py-1 rounded-full text-xs font-medium text-yellow-800 bg-yellow-100">
              Expiring Soon
            </span>
          );
        } else {
          return (
            <span className="px-2 py-1 rounded-full text-xs font-medium text-green-700 bg-green-100">
              Active
            </span>
          );
        }
      },
    },
    {
      key: "autoRenew",
      label: "Auto Renew",
      className: "max-w-[80px]",
      render: (subscription) => (
        <span
          className={`px-2 py-1 text-xs font-medium rounded-full ${
            subscription.autoRenew
              ? "text-green-700 bg-green-100"
              : "text-red-700 bg-red-100"
          }`}
        >
          {subscription.autoRenew ? "Yes" : "No"}
        </span>
      ),
    },
    {
      key: "createdAt",
      label: "Created At",
      className: "max-w-[150px]",
      render: (subscription) => (
        <span className="text-muted-foreground">
          {dateTimeFormat(subscription.createdAt)}
        </span>
      ),
    },
    {
      key: "actions",
      label: "Actions",
      className: "w-[200px]",
      render: (subscription) => (
        <div className="flex items-center gap-2">
          <ActionButton
            icon={<Eye className="h-4 w-4" />}
            tooltip="View Details"
            onClick={() => handleViewSubscriptionDetail(subscription)}
          />
          <ActionButton
            icon={<Edit className="h-4 w-4" />}
            tooltip="Edit Subscription"
            onClick={() => handleEditSubscription(subscription)}
          />
          <ActionButton
            icon={<RotateCcw className="h-4 w-4" />}
            tooltip="Renew Subscription"
            onClick={() => handleRenewSubscription(subscription)}
          />
          <ActionButton
            icon={<X className="h-4 w-4" />}
            tooltip="Cancel Subscription"
            onClick={() => handleCancelSubscription(subscription)}
          />
          <ActionButton
            icon={<Trash className="w-4 h-4" />}
            tooltip="Delete Subscription"
            onClick={() => handleDelete(subscription)}
            variant="destructive"
          />
        </div>
      ),
    },
  ];
};
