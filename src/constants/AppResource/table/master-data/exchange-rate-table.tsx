import { ActionButton } from "@/components/shared/common/action-button";
import { TableColumn } from "@/components/shared/common/data-table";
import {
  AllExchangeRate,
  ExchangeRateModel,
} from "@/models/dashboard/payment/exchange-rate/exchange-rate.response.model";
import { indexDisplay } from "@/utils/common/common";
import { dateTimeFormat } from "@/utils/date/date-time-format";
import { Edit, Eye, Trash } from "lucide-react";

interface ExchangeRateTableHandlers {
  handleEditExchangeRate: (exchangeRate: ExchangeRateModel) => void;
  handleViewExchangeRateDetail: (exchangeRate: ExchangeRateModel) => void;
  handleDelete: (exchangeRate: ExchangeRateModel) => void;
}

interface ExchangeRateTableOptions {
  data: AllExchangeRate | null;
  handlers: ExchangeRateTableHandlers;
}

export const createExchangeRateTableColumns = ({
  data,
  handlers,
}: ExchangeRateTableOptions): TableColumn<ExchangeRateModel>[] => {
  const { handleEditExchangeRate, handleViewExchangeRateDetail, handleDelete } =
    handlers;

  return [
    {
      key: "index",
      label: "#",
      className: "max-w-16",
      render: (_, index) => (
        <span className="font-medium">
          {indexDisplay(data?.pageNo || 1, data?.pageSize || 10, index)}
        </span>
      ),
    },
    {
      key: "usdToKhrRate",
      label: "USD to KHR Rate",
      className: "max-w-[150px]",
      render: (item) => item.usdToKhrRate || "---",
    },
    {
      key: "isActive",
      label: "Status",
      className: "max-w-[100px]",
      render: (item) => (item.isActive ? "Active" : "Inactive"),
    },
    {
      key: "notes",
      label: "Notes",
      className: "max-w-[250px]",
      render: (item) => (
        <span title={item.notes || "No notes"}>{item.notes || "---"}</span>
      ),
    },
    {
      key: "createdAt",
      label: "Created At",
      className: "max-w-[160px]",
      render: (item) => dateTimeFormat(item.createdAt),
    },
    {
      key: "actions",
      label: "Actions",
      className: "w-[160px]",
      render: (item) => (
        <div className="flex items-center gap-2">
          <ActionButton
            icon={<Eye className="h-4 w-4" />}
            tooltip="View Details"
            onClick={() => handleViewExchangeRateDetail(item)}
          />
          <ActionButton
            icon={<Edit className="h-4 w-4" />}
            tooltip="Edit Exchange Rate"
            onClick={() => handleEditExchangeRate(item)}
          />
          <ActionButton
            icon={<Trash className="h-4 w-4" />}
            tooltip="Delete Exchange Rate"
            onClick={() => handleDelete(item)}
            variant="destructive"
          />
        </div>
      ),
    },
  ];
};
