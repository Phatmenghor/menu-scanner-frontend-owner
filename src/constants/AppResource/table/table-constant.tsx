import { BusinessStatusBadge } from "@/components/shared/badge/business-status-badge";
import { CustomAvatar } from "@/components/shared/common/custom-avator";
import { TableColumn } from "@/components/shared/table/table";
import { Button } from "@/components/ui/button";
import {
  BusinessModel,
  AllBusinessResponse,
} from "@/models/dashboard/master-data/business/business.response.model";
import { indexDisplay } from "@/utils/common/common";
import { DateTimeFormat } from "@/utils/date/date-time-format";
import { Edit, Eye, Trash } from "lucide-react";

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
      className: "w-[60px]",
      render: (_, index) => (
        <span className="font-medium">
          {indexDisplay(data?.pageNo || 1, data?.pageSize || 10, index)}
        </span>
      ),
    },
    {
      key: "avatar",
      label: "Logo",
      className: "w-[80px]",
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
      render: (business) => (
        <span className="font-medium">{business.name || "---"}</span>
      ),
    },
    {
      key: "businessType",
      label: "Business Type",
      render: (business) => business.businessType || "---",
    },
    {
      key: "email",
      label: "Email",
      render: (business) => (
        <span className="font-medium">{business.email || "---"}</span>
      ),
    },
    {
      key: "phone",
      label: "Phone",
      render: (business) => business.phone || "---",
    },
    {
      key: "subscription",
      label: "Subscription Plan",
      render: (business) => business.currentSubscriptionPlan || "No Plan",
    },
    {
      key: "daysRemaining",
      label: "Days Remaining",
      render: (business) =>
        business.daysRemaining ? (
          <span
            className={
              business.isExpiringSoon ? "text-warning" : "text-muted-foreground"
            }
          >
            {business.daysRemaining} days left
          </span>
        ) : (
          "---"
        ),
    },
    {
      key: "status",
      label: "Status",
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
      render: (business) => (
        <span className="text-muted-foreground">
          {DateTimeFormat(business.createdAt)}
        </span>
      ),
    },
    {
      key: "actions",
      label: "Actions",
      className: "w-[160px]",
      render: (business) => (
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleEditBusiness(business)}
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleViewBusinessDetail(business)}
          >
            <Eye className="w-4 h-4" />
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => handleDelete(business)}
          >
            <Trash className="w-3 h-3" />
          </Button>
        </div>
      ),
    },
  ];
};
