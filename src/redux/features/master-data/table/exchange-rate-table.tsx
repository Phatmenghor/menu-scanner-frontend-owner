import { ActionButton } from "@/components/button/action-button";
import { indexDisplay } from "@/utils/common/common";
import { dateTimeFormat } from "@/utils/date/date-time-format";
import { Edit, Eye, Trash } from "lucide-react";
import { TableColumn } from "@/components/shared/common/data-table";
import {
  AllExchangeRateResponseModel,
  ExchangeRateResponseModel,
} from "../store/models/response/exchange-rate-response";

interface ExchangeRateTableHandlers {
  handleEditExchangeRate: (exchnage: ExchangeRateResponseModel) => void;
  handleExchangeRateViewDetail: (exchnage: ExchangeRateResponseModel) => void;
  handleDeleteExchangeRate: (exchnage: ExchangeRateResponseModel) => void;
}

interface ExchangeRateTableOptions {
  data: AllExchangeRateResponseModel | null;
  handlers: ExchangeRateTableHandlers;
}

export const exchangeRateTableColumns = ({
  data,
  handlers,
}: ExchangeRateTableOptions): TableColumn<ExchangeRateResponseModel>[] => {
  const {
    handleEditExchangeRate,
    handleExchangeRateViewDetail,
    handleDeleteExchangeRate,
  } = handlers;

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
      key: "usdToKhrRate",
      label: "USD to KHR Rate",
      minWidth: "10px",
      maxWidth: "400px",
      truncate: true,
      render: (exchange) => (
        <span className="text-xs text-muted-foreground">
          {exchange?.usdToKhrRate || "---"}
        </span>
      ),
    },
    {
      key: "notes",
      label: "Noted",
      minWidth: "10px",
      maxWidth: "400px",
      truncate: true,
      render: (exchange) => (
        <span className="text-xs text-muted-foreground">
          {exchange?.notes || "---"}
        </span>
      ),
    },

    {
      key: "createdAt",
      label: "Created At",
      minWidth: "10px",
      maxWidth: "400px",
      render: (exchange) => (
        <span className="text-sm text-muted-foreground">
          {dateTimeFormat(exchange?.createdAt)}
        </span>
      ),
    },

    {
      key: "createdBy",
      label: "Created By",
      minWidth: "10px",
      maxWidth: "400px",
      truncate: true,
      render: (exchange) => (
        <span className="text-xs text-muted-foreground">
          {exchange?.createdBy || "---"}
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
            onClick={() => handleExchangeRateViewDetail(business)}
          />
          <ActionButton
            icon={<Edit className="w-4 h-4" />}
            tooltip="Edit Exchange Rate"
            onClick={() => handleEditExchangeRate(business)}
          />
          <ActionButton
            icon={<Trash className="w-4 h-4" />}
            tooltip="Delete Exchange Rate"
            onClick={() => handleDeleteExchangeRate(business)}
            variant="destructive"
          />
        </div>
      ),
    },
  ];
};
