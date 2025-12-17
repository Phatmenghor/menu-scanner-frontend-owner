import { ActionButton } from "@/components/button/action-button";
import { indexDisplay } from "@/utils/common/common";
import { dateTimeFormat } from "@/utils/date/date-time-format";
import { Edit, Eye, Trash } from "lucide-react";
import { TableColumn } from "@/components/shared/common/data-table";
import {
  AllVillageResponseModel,
  VillageResponseModel,
} from "../store/models/response/village-response";

interface VillageTableHandlers {
  handleEditVillage: (commune: VillageResponseModel) => void;
  handleVillageViewDetail: (commune: VillageResponseModel) => void;
  handleDeleteVillage: (commune: VillageResponseModel) => void;
}

interface VillageTableOptions {
  data: AllVillageResponseModel | null;
  handlers: VillageTableHandlers;
}

export const villageTableColumns = ({
  data,
  handlers,
}: VillageTableOptions): TableColumn<VillageResponseModel>[] => {
  const { handleEditVillage, handleVillageViewDetail, handleDeleteVillage } =
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
      key: "villageCode",
      label: "Village Code",
      minWidth: "10px",
      maxWidth: "400px",
      truncate: true,
      render: (village) => (
        <span className="text-xs text-muted-foreground">
          {village?.villageCode || "---"}
        </span>
      ),
    },
    {
      key: "villageEn",
      label: "Village EN",
      minWidth: "10px",
      maxWidth: "400px",
      truncate: true,
      render: (village) => (
        <span className="text-xs text-muted-foreground">
          {village?.villageEn || "---"}
        </span>
      ),
    },

    {
      key: "villageKh",
      label: "Village KH",
      minWidth: "10px",
      maxWidth: "400px",
      truncate: true,
      render: (village) => (
        <span className="text-xs text-muted-foreground">
          {village?.villageKh || "---"}
        </span>
      ),
    },

    {
      key: "communeCode",
      label: "Commune Code",
      minWidth: "10px",
      maxWidth: "400px",
      truncate: true,
      render: (village) => (
        <span className="text-xs text-muted-foreground">
          {village?.commune?.communeCode || "---"}
        </span>
      ),
    },

    {
      key: "communeEn",
      label: "Commune EN",
      minWidth: "10px",
      maxWidth: "400px",
      truncate: true,
      render: (village) => (
        <span className="text-xs text-muted-foreground">
          {village?.commune?.communeEn || "---"}
        </span>
      ),
    },

    {
      key: "districtCode",
      label: "District Code",
      minWidth: "10px",
      maxWidth: "400px",
      truncate: true,
      render: (village) => (
        <span className="text-xs text-muted-foreground">
          {village?.commune?.district?.districtCode || "---"}
        </span>
      ),
    },

    {
      key: "districtEn",
      label: "District EN",
      minWidth: "10px",
      maxWidth: "400px",
      truncate: true,
      render: (village) => (
        <span className="text-xs text-muted-foreground">
          {village?.commune?.district?.districtEn || "---"}
        </span>
      ),
    },

    {
      key: "provinceCode",
      label: "Province EN",
      minWidth: "10px",
      maxWidth: "400px",
      truncate: true,
      render: (village) => (
        <span className="text-xs text-muted-foreground">
          {village?.commune?.district?.province?.provinceCode || "---"}
        </span>
      ),
    },

    {
      key: "provinceEn",
      label: "Province EN",
      minWidth: "10px",
      maxWidth: "400px",
      truncate: true,
      render: (village) => (
        <span className="text-xs text-muted-foreground">
          {village?.commune?.district?.province?.provinceEn || "---"}
        </span>
      ),
    },

    {
      key: "createdAt",
      label: "Created At",
      minWidth: "10px",
      maxWidth: "400px",
      render: (village) => (
        <span className="text-sm text-muted-foreground">
          {dateTimeFormat(village?.createdAt)}
        </span>
      ),
    },

    {
      key: "actions",
      label: "Actions",
      minWidth: "10px",
      maxWidth: "400px",
      render: (village) => (
        <div className="flex items-center gap-2">
          <ActionButton
            icon={<Eye className="w-4 h-4" />}
            tooltip="View Details"
            onClick={() => handleVillageViewDetail(village)}
          />
          <ActionButton
            icon={<Edit className="w-4 h-4" />}
            tooltip="Edit Village"
            onClick={() => handleEditVillage(village)}
          />
          <ActionButton
            icon={<Trash className="w-4 h-4" />}
            tooltip="Delete Village"
            onClick={() => handleDeleteVillage(village)}
            variant="destructive"
          />
        </div>
      ),
    },
  ];
};
