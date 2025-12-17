import { ActionButton } from "@/components/button/action-button";
import { indexDisplay } from "@/utils/common/common";
import { dateTimeFormat } from "@/utils/date/date-time-format";
import { Edit, Eye, RotateCw, Trash } from "lucide-react";
import { TableColumn } from "@/components/shared/common/data-table";
import {
  AllBusinessResponseModel,
  BusinessResponseModel,
} from "../store/models/response/business-response";

interface BusinessTableHandlers {
  handleEditBusiness: (business: BusinessResponseModel) => void;
  handleBusinessViewDetail: (business: BusinessResponseModel) => void;
  handleDeleteBusiness: (business: BusinessResponseModel) => void;
}

interface BusinessTableOptions {
  data: AllBusinessResponseModel | null;
  handlers: BusinessTableHandlers;
}

export const businessTableColumns = ({
  data,
  handlers,
}: BusinessTableOptions): TableColumn<BusinessResponseModel>[] => {
  const { handleEditBusiness, handleBusinessViewDetail, handleDeleteBusiness } =
    handlers;

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
      render: (business) => (
        <span className="text-xs text-muted-foreground">
          {business?.name || "---"}
        </span>
      ),
    },
    {
      key: "email",
      label: "Email",
      minWidth: "10px",
      maxWidth: "400px",
      truncate: true,
      render: (business) => (
        <span className="text-xs text-muted-foreground">
          {business?.email || "---"}
        </span>
      ),
    },
    {
      key: "phone",
      label: "Phone Number",
      minWidth: "10px",
      maxWidth: "400px",
      truncate: true,
      render: (business) => (
        <span className="text-xs text-muted-foreground">
          {business?.phone || "---"}
        </span>
      ),
    },

    {
      key: "businessStatus",
      label: "Business Status",
      minWidth: "10px",
      maxWidth: "400px",
      truncate: true,
      render: (business) => (
        <span className="text-xs text-muted-foreground">
          {business?.status || "---"}
        </span>
      ),
    },
    {
      key: "createdAt",
      label: "Created At",
      minWidth: "10px",
      maxWidth: "400px",
      render: (business) => (
        <span className="text-sm text-muted-foreground">
          {dateTimeFormat(business?.createdAt)}
        </span>
      ),
    },
    {
      key: "actions",
      label: "Actions",
      minWidth: "10px",
      maxWidth: "400px",
      render: (business) => (
        <div className="flex items-center gap-2">
          <ActionButton
            icon={<Eye className="w-4 h-4" />}
            tooltip="View Details"
            onClick={() => handleBusinessViewDetail(business)}
          />
          <ActionButton
            icon={<Edit className="w-4 h-4" />}
            tooltip="Edit Business"
            onClick={() => handleEditBusiness(business)}
          />
          <ActionButton
            icon={<Trash className="w-4 h-4" />}
            tooltip="Delete Business"
            onClick={() => handleDeleteBusiness(business)}
            variant="destructive"
          />
        </div>
      ),
    },
  ];
};
