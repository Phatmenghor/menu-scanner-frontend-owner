import { BusinessStatusBadge } from "@/components/shared/badge/business-status-badge";
import { CustomAvatar } from "@/components/shared/common/custom-avator";
import {
  BusinessModel,
  AllBusinessResponse,
} from "@/models/dashboard/master-data/business/business-response-model";
import { indexDisplay } from "@/utils/common/common";
import { dateTimeFormat } from "@/utils/date/date-time-format";
import { Edit, Eye, Trash } from "lucide-react";
import { ActionButton } from "@/components/shared/common/action-button";
import { TableColumn } from "@/components/shared/common/data-table";

interface BusinessTableHandlers {
  handleEditBusiness: (business: BusinessModel) => void;
  handleViewBusinessDetail: (business: BusinessModel) => void;
  handleDelete: (business: BusinessModel) => void;
}

interface BusinessTableOptions {
  data: AllBusinessResponse | null;
  handlers: BusinessTableHandlers;
}

export const createBusinessTableColumns = ({
  data,
  handlers,
}: BusinessTableOptions): TableColumn<BusinessModel>[] => {
  const { handleEditBusiness, handleViewBusinessDetail, handleDelete } =
    handlers;

  return [
    {
      key: "index",
      label: "#",
      className: "max-w-[120px]",
      render: (_, index) => (
        <span className="font-medium">
          {indexDisplay(data?.pageNo || 1, data?.pageSize || 10, index)}
        </span>
      ),
    },
    {
      key: "avatar",
      label: "Logo",
      className: "max-w-[80px]",
      render: (business) => (
        <CustomAvatar
          imageUrl={business.imageUrl}
          name={business.name}
          size="md"
        />
      ),
    },
    {
      key: "name",
      label: "Business Name",
      className: "max-w-[200px]",
      render: (business) => (
        <span className="font-medium" title={business.name}>
          {business.name || "---"}
        </span>
      ),
    },
    {
      key: "businessType",
      label: "Business Type",
      className: "max-w-[120px]",
      render: (business) => (
        <span title={business.businessType}>
          {business.businessType || "---"}
        </span>
      ),
    },
    {
      key: "email",
      label: "Email",
      className: "max-w-[250px]",
      render: (business) => business.email || "---",
    },
    {
      key: "phone",
      label: "Phone",
      className: "max-w-[150px]",
      render: (business) => (
        <span title={business.phone}>{business.phone || "---"}</span>
      ),
    },
    {
      key: "subscription",
      label: "Subscription Plan",
      className: "max-w-[200px]",
      render: (business) => (
        <span title={business.currentSubscriptionPlan}>
          {business.currentSubscriptionPlan || "No Plan"}
        </span>
      ),
    },
    {
      key: "daysRemaining",
      label: "Days Remaining",
      className: "max-w-[150px]",
      render: (business) => (
        <span
          className={
            business.isExpiringSoon ? "text-warning" : "text-muted-foreground"
          }
        >
          {`${business.daysRemaining} days` || "---"}
        </span>
      ),
    },
    {
      key: "status",
      label: "Status",
      className: "max-w-[150px]",
      render: (business) => (
        <BusinessStatusBadge
          status={business.status}
          isSubscriptionActive={business.isSubscriptionActive}
          isExpiringSoon={business.isExpiringSoon}
        />
      ),
    },
    {
      key: "createdAt",
      label: "Created At",
      className: "max-w-[180px]",
      render: (business) => (
        <span className="text-muted-foreground">
          {dateTimeFormat(business.createdAt)}
        </span>
      ),
    },
    {
      key: "actions",
      label: "Actions",
      className: "w-[160px]",
      render: (business) => (
        <div className="flex items-center gap-2">
          <ActionButton
            icon={<Edit className="h-4 w-4" />}
            tooltip="Edit Business"
            onClick={() => handleEditBusiness(business)}
          />
          <ActionButton
            icon={<Eye className="w-4 h-4" />}
            tooltip="View Details"
            onClick={() => handleViewBusinessDetail(business)}
          />
          <ActionButton
            icon={<Trash className="w-3 h-3" />}
            tooltip="Delete Business"
            onClick={() => handleDelete(business)}
            variant="destructive"
          />
        </div>
      ),
    },
  ];
};
