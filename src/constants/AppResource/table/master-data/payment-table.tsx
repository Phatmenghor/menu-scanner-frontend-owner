import { Badge } from "@/components/ui/badge";
import { ActionButton } from "@/components/shared/common/action-button";
import { TableColumn } from "@/components/shared/common/data-table";
import {
  AllPayment,
  PaymentModel,
} from "@/models/dashboard/payment/payment/payment.response.model";
import { PaymentStatusBadge } from "@/components/shared/badge/payment-status-badge";
import { indexDisplay } from "@/utils/common/common";
import { dateTimeFormat } from "@/utils/date/date-time-format";
import { Edit, Eye, Trash, Building2, CreditCard } from "lucide-react";

interface PaymentTableHandlers {
  handleEditPayment: (payment: PaymentModel) => void;
  handleViewPaymentDetail: (payment: PaymentModel) => void;
  handleDelete: (payment: PaymentModel) => void;
}

interface PaymentTableOptions {
  data: AllPayment | null;
  handlers: PaymentTableHandlers;
}

export const createPaymentTableColumns = ({
  data,
  handlers,
}: PaymentTableOptions): TableColumn<PaymentModel>[] => {
  const { handleEditPayment, handleViewPaymentDetail, handleDelete } = handlers;

  return [
    {
      key: "index",
      label: "#",
      className: "w-16 text-center",
      render: (_, index) => (
        <span className="font-medium">
          {indexDisplay(data?.pageNo || 1, data?.pageSize || 10, index)}
        </span>
      ),
    },
    {
      key: "businessName",
      label: "Business",
      className: "max-w-[180px]",
      render: (item) => (
        <div className="flex items-center gap-2">
          <Building2 className="h-4 w-4 text-muted-foreground" />
          <span className="font-medium truncate" title={item.businessName}>
            {item.businessName || "---"}
          </span>
        </div>
      ),
    },
    {
      key: "status",
      label: "Status",
      className: "text-center max-w-[120px]",
      render: (item) => <PaymentStatusBadge status={item.status} />,
    },
    {
      key: "planName",
      label: "Plan",
      className: "max-w-[150px]",
      render: (item) => (
        <span className="truncate" title={item.planName}>
          {item.planName || "---"}
        </span>
      ),
    },
    {
      key: "subscriptionDisplayName",
      label: "Subscription",
      className: "max-w-[180px]",
      render: (item) => (
        <span className="truncate" title={item.subscriptionDisplayName}>
          {item.subscriptionDisplayName || "---"}
        </span>
      ),
    },
    {
      key: "formattedAmount",
      label: "Amount (USD)",
      className: "text-right max-w-[120px]",
      render: (item) => (
        <div className="text-right">
          <span className="font-semibold text-green-700">
            {item.formattedAmount || "$0.00"}
          </span>
        </div>
      ),
    },
    {
      key: "formattedAmountKhr",
      label: "Amount (KHR)",
      className: "text-right max-w-[120px]",
      render: (item) => (
        <div className="text-right">
          <span className="font-medium text-muted-foreground">
            {item.formattedAmountKhr || "0 ៛"}
          </span>
        </div>
      ),
    },
    {
      key: "paymentMethod",
      label: "Payment Method",
      className: "max-w-[140px]",
      render: (item) => (
        <div className="flex items-center gap-2">
          <CreditCard className="h-4 w-4 text-muted-foreground" />
          <Badge variant="outline" className="text-xs">
            {item.paymentMethod || "---"}
          </Badge>
        </div>
      ),
    },
    {
      key: "statusDescription",
      label: "Description",
      className: "max-w-[150px] text-muted-foreground",
      render: (item) => (
        <span className="truncate" title={item.statusDescription}>
          {item.statusDescription || "---"}
        </span>
      ),
    },
    {
      key: "referenceNumber",
      label: "Reference #",
      className: "max-w-[140px]",
      render: (item) => (
        <span
          className="font-mono text-sm truncate"
          title={item.referenceNumber}
        >
          {item.referenceNumber || "---"}
        </span>
      ),
    },
    {
      key: "createdAt",
      label: "Created At",
      className: "text-muted-foreground max-w-[160px]",
      render: (item) => (
        <span className="text-sm">{dateTimeFormat(item.createdAt)}</span>
      ),
    },
    {
      key: "actions",
      label: "Actions",
      className: "w-[160px] text-center",
      render: (item) => (
        <div className="flex items-center justify-center gap-2">
          <ActionButton
            icon={<Eye className="h-4 w-4" />}
            tooltip="View Details"
            onClick={() => handleViewPaymentDetail(item)}
          />
          <ActionButton
            icon={<Edit className="h-4 w-4" />}
            tooltip="Edit Payment"
            onClick={() => handleEditPayment(item)}
          />
          <ActionButton
            icon={<Trash className="h-4 w-4" />}
            tooltip="Delete Payment"
            onClick={() => handleDelete(item)}
            variant="destructive"
          />
        </div>
      ),
    },
  ];
};
