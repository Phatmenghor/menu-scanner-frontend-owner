import { ActionButton } from "@/components/button/action-button";
import { indexDisplay } from "@/utils/common/common";
import { dateTimeFormat } from "@/utils/date/date-time-format";
import { Edit, Eye, Trash } from "lucide-react";
import {
  AllDistrictResponseModel,
  DistrictResponseModel,
} from "../store/models/response/district-response";
import { TableColumn } from "@/components/shared/common/data-table";

interface DistrictTableHandlers {
  handleEditDistrict: (district: DistrictResponseModel) => void;
  handleDistrictViewDetail: (district: DistrictResponseModel) => void;
  handleDeleteDistrict: (district: DistrictResponseModel) => void;
}

interface DistrictTableOptions {
  data: AllDistrictResponseModel | null;
  handlers: DistrictTableHandlers;
}

export const districtTableColumns = ({
  data,
  handlers,
}: DistrictTableOptions): TableColumn<DistrictResponseModel>[] => {
  const { handleEditDistrict, handleDistrictViewDetail, handleDeleteDistrict } =
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
      key: "districtCode",
      label: "District Code",
      minWidth: "10px",
      maxWidth: "400px",
      truncate: true,
      render: (district) => (
        <span className="text-xs text-muted-foreground">
          {district?.districtCode || "---"}
        </span>
      ),
    },
    {
      key: "districtEn",
      label: "District EN",
      minWidth: "10px",
      maxWidth: "400px",
      truncate: true,
      render: (district) => (
        <span className="text-xs text-muted-foreground">
          {district?.districtEn || "---"}
        </span>
      ),
    },

    {
      key: "districtKh",
      label: "District KH",
      minWidth: "10px",
      maxWidth: "400px",
      truncate: true,
      render: (district) => (
        <span className="text-xs text-muted-foreground">
          {district?.districtKh || "---"}
        </span>
      ),
    },

    {
      key: "provinceCode",
      label: "Province Code",
      minWidth: "10px",
      maxWidth: "400px",
      truncate: true,
      render: (district) => (
        <span className="text-xs text-muted-foreground">
          {district?.province?.provinceCode || "---"}
        </span>
      ),
    },

    {
      key: "provinceEn",
      label: "Province EN",
      minWidth: "10px",
      maxWidth: "400px",
      truncate: true,
      render: (district) => (
        <span className="text-xs text-muted-foreground">
          {district?.province?.provinceEn || "---"}
        </span>
      ),
    },

    {
      key: "createdAt",
      label: "Created At",
      minWidth: "10px",
      maxWidth: "400px",
      render: (district) => (
        <span className="text-sm text-muted-foreground">
          {dateTimeFormat(district?.createdAt)}
        </span>
      ),
    },

    {
      key: "actions",
      label: "Actions",
      minWidth: "10px",
      maxWidth: "400px",
      render: (district) => (
        <div className="flex items-center gap-2">
          <ActionButton
            icon={<Eye className="w-4 h-4" />}
            tooltip="View Details"
            onClick={() => handleDistrictViewDetail(district)}
          />
          <ActionButton
            icon={<Edit className="w-4 h-4" />}
            tooltip="Edit District"
            onClick={() => handleEditDistrict(district)}
          />
          <ActionButton
            icon={<Trash className="w-4 h-4" />}
            tooltip="Delete District"
            onClick={() => handleDeleteDistrict(district)}
            variant="destructive"
          />
        </div>
      ),
    },
  ];
};
