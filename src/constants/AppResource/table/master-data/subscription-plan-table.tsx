import { TableColumn } from "@/components/shared/table/table";
import {
  AllSubscriptionPlan,
  SubscriptionPlanModel,
} from "@/models/dashboard/master-data/subscription-plan/subscription-plan-response";
import { indexDisplay } from "@/utils/common/common";
import { DateTimeFormat } from "@/utils/date/date-time-format";
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
      render: (plan) => (
        <div className="flex items-center gap-2">
          {plan.isFree ? (
            <Gift className="h-4 w-4 text-green-600" />
          ) : (
            <Crown className="h-4 w-4 text-purple-600" />
          )}
          <span className="font-medium truncate" title={plan.name}>
            {plan.name || "---"}
          </span>
        </div>
      ),
    },
    {
      key: "price",
      label: "Price",
      className: "max-w-[120px]",
      render: (plan) => (
        <div className="font-medium">
          {plan.isFree ? (
            <span className="text-green-600 font-semibold">FREE</span>
          ) : (
            <span>{plan.pricingDisplay || formatCurrency(plan.price)}</span>
          )}
        </div>
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
      render: (plan) => (
        <Badge variant="outline" className={getStatusColor(plan.status)}>
          {plan.status}
        </Badge>
      ),
    },
    {
      key: "subscriptions",
      label: "Subscriptions",
      className: "max-w-[120px]",
      render: (plan) => (
        <div className="flex items-center gap-1">
          <span
            className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
              plan.activeSubscriptionsCount > 0
                ? "bg-blue-100 text-blue-800"
                : "bg-gray-100 text-gray-600"
            }`}
          >
            {plan.activeSubscriptionsCount || 0}
          </span>
        </div>
      ),
    },
    {
      key: "visibility",
      label: "Visibility",
      className: "max-w-[100px]",
      render: (plan) => (
        <div className="flex items-center gap-1">
          {plan.isPublic && (
            <div className="flex items-center gap-1 text-blue-600">
              <Globe className="h-3 w-3" />
              <span className="text-xs">Public</span>
            </div>
          )}
          {plan.isPrivate && (
            <div className="flex items-center gap-1 text-orange-600">
              <Lock className="h-3 w-3" />
              <span className="text-xs">Private</span>
            </div>
          )}
          {!plan.isPublic && !plan.isPrivate && (
            <span className="text-xs text-gray-500">---</span>
          )}
        </div>
      ),
    },
    {
      key: "createdAt",
      label: "Created At",
      className: "max-w-[150px]",
      render: (plan) => (
        <span className="text-muted-foreground text-sm">
          {DateTimeFormat(plan.createdAt)}
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
