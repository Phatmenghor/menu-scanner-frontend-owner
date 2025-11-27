import { ActionButton } from "@/components/shared/common/action-button";
import { TableColumn } from "@/components/shared/common/data-table";
import {
  AllPayment,
  PaymentModel,
} from "@/models/dashboard/payment/payment/payment.response.model";
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
      className: "w-16",
      render: (_, index) => indexDisplay(data?.pageNo, data?.pageSize, index),
    },
    {
      key: "businessName",
      label: "Business",
      className: "max-w-[180px]",
      render: (item) => item.businessName,
    },
    {
      key: "status",
      label: "Status",
      className: "max-w-[120px]",
      render: (item) => item.status,
    },
    {
      key: "planName",
      label: "Plan",
      className: "max-w-[150px]",
      render: (item) => item.planName,
    },
    {
      key: "subscriptionDisplayName",
      label: "Subscription",
      className: "max-w-[180px]",
      render: (item) => item.subscriptionDisplayName,
    },
    {
      key: "formattedAmount",
      label: "Amount (USD)",
      className: "max-w-[120px]",
      render: (item) => item.formattedAmount || "$0.00",
    },
    {
      key: "formattedAmountKhr",
      label: "Amount (KHR)",
      className: "max-w-[120px]",
      render: (item) => item.formattedAmountKhr || "0 ៛",
    },
    {
      key: "paymentMethod",
      label: "Payment Method",
      className: "max-w-[140px]",
      render: (item) => item.paymentMethod,
    },
    {
      key: "statusDescription",
      label: "Description",
      className: "max-w-[150px]",
      render: (item) => item.statusDescription,
    },
    {
      key: "referenceNumber",
      label: "Reference #",
      className: "max-w-[140px]",
      render: (item) => item.referenceNumber,
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
