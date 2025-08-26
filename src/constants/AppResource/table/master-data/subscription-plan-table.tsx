import { TableColumn } from "@/components/shared/table/table";
import {
  AllSubscriptionPlan,
  SubscriptionPlanModel,
} from "@/models/dashboard/master-data/subscription-plan/subscription-plan-response";
import { indexDisplay } from "@/utils/common/common";
import { dateTimeFormat } from "@/utils/date/date-time-format";
import { Edit, Eye, Trash, Crown, Gift, Globe, Lock } from "lucide-react";
import { ActionButton } from "@/components/shared/common/action-button";
import { Badge } from "@/components/ui/badge";

export const SubscriptionPlanTableHeaders = [
  { label: "#", className: "max-w-[80px]" },
  { label: "Plan Name", className: "max-w-[200px]" },
  { label: "Price", className: "max-w-[120px]" },
  { label: "Duration", className: "max-w-[100px]" },
  { label: "Status", className: "max-w-[120px]" },
  { label: "Subscriptions", className: "max-w-[120px]" },
  { label: "Visibility", className: "max-w-[100px]" },
  { label: "Created At", className: "max-w-[150px]" },
  { label: "Actions", className: "w-[160px]" },
];

interface SubscriptionPlanTableHandlers {
  handleEditPlan: (plan: SubscriptionPlanModel) => void;
  handleViewPlanDetail: (plan: SubscriptionPlanModel) => void;
  handleDeletePlan: (plan: SubscriptionPlanModel) => void;
}

interface SubscriptionPlanTableOptions {
  data: AllSubscriptionPlan | null;
  handlers: SubscriptionPlanTableHandlers;
}

const getStatusColor = (status: string) => {
  switch (status?.toLowerCase()) {
    case "active":
      return "bg-green-100 text-green-800 border-green-200";
    case "pending":
      return "bg-yellow-100 text-yellow-800 border-yellow-200";
    case "inactive":
      return "bg-red-100 text-red-800 border-red-200";
    case "draft":
      return "bg-gray-100 text-gray-800 border-gray-200";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200";
  }
};

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
};

export const createSubscriptionPlanTableColumns = ({
  data,
  handlers,
}: SubscriptionPlanTableOptions): TableColumn<SubscriptionPlanModel>[] => {
  const { handleEditPlan, handleViewPlanDetail, handleDeletePlan } = handlers;

  return [
    {
      key: "index",
      label: "#",
      className: "max-w-[80px]",
      render: (_, index) => (
        <span className="font-medium">
          {indexDisplay(data?.pageNo || 1, data?.pageSize || 10, index)}
        </span>
      ),
    },
    {
      key: "name",
      label: "Plan Name",
      className: "max-w-[200px]",
      render: (plan) => plan.name || "---",
    },
    {
      key: "price",
      label: "Price",
      className: "max-w-[120px]",
      render: (plan) =>
        plan.isFree ? (
          <span className="text-green-600 font-semibold">FREE</span>
        ) : (
          <span>{formatCurrency(plan.price)}</span>
        ),
    },
    {
      key: "duration",
      label: "Duration",
      className: "max-w-[100px]",
      render: (plan) => (
        <span className="text-sm">
          {plan.durationDays === 0 ? "Unlimited" : `${plan.durationDays} days`}
        </span>
      ),
    },
    {
      key: "status",
      label: "Status",
      className: "max-w-[120px]",
      render: (plan) => plan.status || "---",
    },
    {
      key: "subscriptions",
      label: "Subscriptions",
      className: "max-w-[120px]",
      render: (plan) => `${plan.activeSubscriptionsCount || 0} active`,
    },
    {
      key: "createdAt",
      label: "Created At",
      className: "max-w-[150px]",
      render: (plan) => (
        <span className="text-muted-foreground text-sm">
          {dateTimeFormat(plan.createdAt)}
        </span>
      ),
    },
    {
      key: "actions",
      label: "Actions",
      className: "w-[160px]",
      render: (plan) => (
        <div className="flex items-center gap-2">
          <ActionButton
            icon={<Edit className="h-4 w-4" />}
            tooltip="Edit Plan"
            onClick={() => handleEditPlan(plan)}
          />
          <ActionButton
            icon={<Eye className="w-4 h-4" />}
            tooltip="View Details"
            onClick={() => handleViewPlanDetail(plan)}
          />
          <ActionButton
            icon={<Trash className="w-3 h-3" />}
            tooltip="Delete Plan"
            onClick={() => handleDeletePlan(plan)}
            variant="destructive"
          />
        </div>
      ),
    },
  ];
};
