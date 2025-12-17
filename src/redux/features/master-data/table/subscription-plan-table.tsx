import { ActionButton } from "@/components/button/action-button";
import { indexDisplay } from "@/utils/common/common";
import { dateTimeFormat } from "@/utils/date/date-time-format";
import { Edit, Eye, Trash } from "lucide-react";
import { TableColumn } from "@/components/shared/common/data-table";
import {
  AllSubscriptionPlanResponseModel,
  SubscriptionPlanResponseModel,
} from "../store/models/response/subscription-plan-response";

interface SubscriptionPlanTableHandlers {
  handleEditPlan: (plan: SubscriptionPlanResponseModel) => void;
  handlePlanViewDetail: (plan: SubscriptionPlanResponseModel) => void;
  handleDeletePlan: (plan: SubscriptionPlanResponseModel) => void;
}

interface SubscriptionPlanTableOptions {
  data: AllSubscriptionPlanResponseModel | null;
  handlers: SubscriptionPlanTableHandlers;
}

export const subscriptionPlanTableColumns = ({
  data,
  handlers,
}: SubscriptionPlanTableOptions): TableColumn<SubscriptionPlanResponseModel>[] => {
  const { handleEditPlan, handlePlanViewDetail, handleDeletePlan } = handlers;

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
      key: "name",
      label: "Name",
      minWidth: "10px",
      maxWidth: "400px",
      truncate: true,
      render: (plan) => (
        <span className="text-xs text-muted-foreground">
          {plan?.name || "---"}
        </span>
      ),
    },
    {
      key: "price",
      label: "Price",
      minWidth: "10px",
      maxWidth: "400px",
      truncate: true,
      render: (plan) => (
        <span className="text-xs text-muted-foreground">
          {plan?.price || "---"}
        </span>
      ),
    },
    {
      key: "durationDays",
      label: "Duration Days",
      minWidth: "10px",
      maxWidth: "400px",
      truncate: true,
      render: (plan) => (
        <span className="text-xs text-muted-foreground">
          {plan?.durationDays || "---"}
        </span>
      ),
    },

    {
      key: "status",
      label: "Plan Status",
      minWidth: "10px",
      maxWidth: "400px",
      truncate: true,
      render: (plan) => (
        <span className="text-xs text-muted-foreground">
          {plan?.status || "---"}
        </span>
      ),
    },
    {
      key: "createdAt",
      label: "Created At",
      minWidth: "10px",
      maxWidth: "400px",
      render: (plan) => (
        <span className="text-sm text-muted-foreground">
          {dateTimeFormat(plan?.createdAt)}
        </span>
      ),
    },
    {
      key: "actions",
      label: "Actions",
      minWidth: "10px",
      maxWidth: "400px",
      render: (plan) => (
        <div className="flex items-center gap-2">
          <ActionButton
            icon={<Eye className="w-4 h-4" />}
            tooltip="View Details"
            onClick={() => handlePlanViewDetail(plan)}
          />
          <ActionButton
            icon={<Edit className="w-4 h-4" />}
            tooltip="Edit Plan"
            onClick={() => handleEditPlan(plan)}
          />
          <ActionButton
            icon={<Trash className="w-4 h-4" />}
            tooltip="Delete Plan"
            onClick={() => handleDeletePlan(plan)}
            variant="destructive"
          />
        </div>
      ),
    },
  ];
};
