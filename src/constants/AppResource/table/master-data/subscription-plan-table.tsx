import {
  AllSubscriptionPlan,
  SubscriptionPlanModel,
} from "@/models/dashboard/master-data/subscription-plan/subscription-plan-response";
import { indexDisplay } from "@/utils/common/common";
import { dateTimeFormat } from "@/utils/date/date-time-format";
import { Edit, Eye, Trash } from "lucide-react";
import { ActionButton } from "@/components/shared/common/action-button";
import { TableColumn } from "@/components/shared/common/data-table";

interface SubscriptionPlanTableHandlers {
  handleEditPlan: (plan: SubscriptionPlanModel) => void;
  handleViewPlanDetail: (plan: SubscriptionPlanModel) => void;
  handleDeletePlan: (plan: SubscriptionPlanModel) => void;
}

interface SubscriptionPlanTableOptions {
  data: AllSubscriptionPlan | null;
  handlers: SubscriptionPlanTableHandlers;
}

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
      render: (_, index) => indexDisplay(data?.pageNo, data?.pageSize, index),
    },
    {
      key: "name",
      label: "Plan Name",
      className: "max-w-[200px]",
      render: (plan) => plan.name,
    },
    {
      key: "price",
      label: "Price",
      className: "max-w-[120px]",
      render: (plan) => (plan.price == 0 ? "FREE" : formatCurrency(plan.price)),
    },
    {
      key: "duration",
      label: "Duration",
      className: "max-w-[100px]",
      render: (plan) =>
        plan.durationDays === 0 ? "Unlimited" : `${plan.durationDays} days`,
    },
    {
      key: "status",
      label: "Status",
      className: "max-w-[120px]",
      render: (plan) => plan.status,
    },
    {
      key: "subscriptions",
      label: "Subscriptions",
      className: "max-w-[120px] ",
      render: (plan) => `${plan.activeSubscriptionsCount || 0} active`,
    },
    {
      key: "createdAt",
      label: "Created At",
      className: "max-w-[150px]",
      render: (plan) => dateTimeFormat(plan.createdAt),
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
