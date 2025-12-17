import { ActionButton } from "@/components/button/action-button";
import { indexDisplay } from "@/utils/common/common";
import { dateTimeFormat } from "@/utils/date/date-time-format";
import { Edit, Eye, Trash } from "lucide-react";
import { TableColumn } from "@/components/shared/common/data-table";
import {
  AllSubscriptionResponseModel,
  SubscriptionResponseModel,
} from "../store/models/response/subscription-response";

interface SubscriptionTableHandlers {
  handleEditSubscription: (subscription: SubscriptionResponseModel) => void;
  handleSubscriptionViewDetail: (
    subscription: SubscriptionResponseModel
  ) => void;
  handleDeleteSubscription: (subscription: SubscriptionResponseModel) => void;
}

interface SubscriptionTableOptions {
  data: AllSubscriptionResponseModel | null;
  handlers: SubscriptionTableHandlers;
}

export const subscriptionTableColumns = ({
  data,
  handlers,
}: SubscriptionTableOptions): TableColumn<SubscriptionResponseModel>[] => {
  const {
    handleEditSubscription,
    handleSubscriptionViewDetail,
    handleDeleteSubscription,
  } = handlers;

  return [
    {
      key: "index",
      label: "#",
      minWidth: "10px",
      maxWidth: "400px",
      render: (_, index) => (
        <span className="font-medium">
          {indexDisplay(data?.pageNo || 1, data?.pageSize || 10, index + 1)}
        </span>
      ),
    },
    {
      key: "businessName",
      label: "Business Name",
      minWidth: "10px",
      maxWidth: "400px",
      truncate: true,
      render: (subscription) => (
        <span className="text-xs text-muted-foreground">
          {subscription?.businessName || "---"}
        </span>
      ),
    },

    {
      key: "planName",
      label: "Plan Name",
      minWidth: "10px",
      maxWidth: "400px",
      truncate: true,
      render: (subscription) => (
        <span className="text-xs text-muted-foreground">
          {subscription?.planName || "---"}
        </span>
      ),
    },

    {
      key: "planPrice",
      label: "Plan Price",
      minWidth: "10px",
      maxWidth: "400px",
      truncate: true,
      render: (subscription) => (
        <span className="text-xs text-muted-foreground">
          {subscription?.planPrice || "---"}
        </span>
      ),
    },

    {
      key: "planDurationDays",
      label: "Plan DurationDays",
      minWidth: "10px",
      maxWidth: "400px",
      truncate: true,
      render: (subscription) => (
        <span className="text-xs text-muted-foreground">
          {subscription?.planDurationDays || "---"}
        </span>
      ),
    },

    {
      key: "daysRemaining",
      label: "Days Remaining",
      minWidth: "10px",
      maxWidth: "400px",
      truncate: true,
      render: (subscription) => (
        <span className="text-xs text-muted-foreground">
          {subscription?.daysRemaining || "---"}
        </span>
      ),
    },

    {
      key: "status",
      label: "Status",
      minWidth: "10px",
      maxWidth: "400px",
      truncate: true,
      render: (subscription) => (
        <span className="text-xs text-muted-foreground">
          {subscription?.status || "---"}
        </span>
      ),
    },

    {
      key: "createdAt",
      label: "Created At",
      minWidth: "10px",
      maxWidth: "400px",
      render: (payment) => (
        <span className="text-sm text-muted-foreground">
          {dateTimeFormat(payment?.createdAt)}
        </span>
      ),
    },
    {
      key: "actions",
      label: "Actions",
      minWidth: "10px",
      maxWidth: "400px",
      render: (subscription) => (
        <div className="flex items-center gap-2">
          <ActionButton
            icon={<Eye className="w-4 h-4" />}
            tooltip="View Details"
            onClick={() => handleSubscriptionViewDetail(subscription)}
          />
          <ActionButton
            icon={<Edit className="w-4 h-4" />}
            tooltip="Edit Subscription"
            onClick={() => handleEditSubscription(subscription)}
          />
          <ActionButton
            icon={<Trash className="w-4 h-4" />}
            tooltip="Delete Subscription"
            onClick={() => handleDeleteSubscription(subscription)}
            variant="destructive"
          />
        </div>
      ),
    },
  ];
};
