import { ActionButton } from "@/components/button/action-button";
import { indexDisplay } from "@/utils/common/common";
import { dateTimeFormat } from "@/utils/date/date-time-format";
import { Edit, Eye, Trash } from "lucide-react";
import { TableColumn } from "@/components/shared/common/data-table";
import {
  AllCommuneResponseModel,
  CommuneResponseModel,
} from "../store/models/response/commune-response";

interface CommuneTableHandlers {
  handleEditCommune: (commune: CommuneResponseModel) => void;
  handleCommuneViewDetail: (commune: CommuneResponseModel) => void;
  handleDeleteCommune: (commune: CommuneResponseModel) => void;
}

interface CommuneTableOptions {
  data: AllCommuneResponseModel | null;
  handlers: CommuneTableHandlers;
}

export const communeTableColumns = ({
  data,
  handlers,
}: CommuneTableOptions): TableColumn<CommuneResponseModel>[] => {
  const { handleEditCommune, handleCommuneViewDetail, handleDeleteCommune } =
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
      key: "communeCode",
      label: "Commune Code",
      minWidth: "10px",
      maxWidth: "400px",
      truncate: true,
      render: (commune) => (
        <span className="text-xs text-muted-foreground">
          {commune?.communeCode || "---"}
        </span>
      ),
    },
    {
      key: "communeEn",
      label: "Commune EN",
      minWidth: "10px",
      maxWidth: "400px",
      truncate: true,
      render: (commune) => (
        <span className="text-xs text-muted-foreground">
          {commune?.communeEn || "---"}
        </span>
      ),
    },

    {
      key: "communeKh",
      label: "Commune KH",
      minWidth: "10px",
      maxWidth: "400px",
      truncate: true,
      render: (commune) => (
        <span className="text-xs text-muted-foreground">
          {commune?.communeKh || "---"}
        </span>
      ),
    },

    {
      key: "districtCode",
      label: "District Code",
      minWidth: "10px",
      maxWidth: "400px",
      truncate: true,
      render: (commune) => (
        <span className="text-xs text-muted-foreground">
          {commune?.district?.districtCode || "---"}
        </span>
      ),
    },

    {
      key: "districtEn",
      label: "District EN",
      minWidth: "10px",
      maxWidth: "400px",
      truncate: true,
      render: (commune) => (
        <span className="text-xs text-muted-foreground">
          {commune?.district?.districtEn || "---"}
        </span>
      ),
    },

    {
      key: "provinceCode",
      label: "Province Code",
      minWidth: "10px",
      maxWidth: "400px",
      truncate: true,
      render: (commune) => (
        <span className="text-xs text-muted-foreground">
          {commune?.district?.province?.provinceCode || "---"}
        </span>
      ),
    },

    {
      key: "provinceEn",
      label: "Province EN",
      minWidth: "10px",
      maxWidth: "400px",
      truncate: true,
      render: (commune) => (
        <span className="text-xs text-muted-foreground">
          {commune?.district?.province?.provinceEn || "---"}
        </span>
      ),
    },

    {
      key: "createdAt",
      label: "Created At",
      minWidth: "10px",
      maxWidth: "400px",
      render: (commune) => (
        <span className="text-sm text-muted-foreground">
          {dateTimeFormat(commune?.createdAt)}
        </span>
      ),
    },

    {
      key: "actions",
      label: "Actions",
      minWidth: "10px",
      maxWidth: "400px",
      render: (commune) => (
        <div className="flex items-center gap-2">
          <ActionButton
            icon={<Eye className="w-4 h-4" />}
            tooltip="View Details"
            onClick={() => handleCommuneViewDetail(commune)}
          />
          <ActionButton
            icon={<Edit className="w-4 h-4" />}
            tooltip="Edit Commune"
            onClick={() => handleEditCommune(commune)}
          />
          <ActionButton
            icon={<Trash className="w-4 h-4" />}
            tooltip="Delete Commune"
            onClick={() => handleDeleteCommune(commune)}
            variant="destructive"
          />
        </div>
      ),
    },
  ];
};
