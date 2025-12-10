"use client";

import { useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { getStatusColor, formatEnumToDisplay } from "@/utils/styles/enum-style";
import { dateTimeFormat } from "@/utils/date/date-time-format";
import { DetailModal } from "@/components/shared/modal/detail-modal";
import {
  DetailRow,
  DetailSection,
} from "@/components/shared/modal/detail-section";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import {
  selectIsFetchingDetail,
  selectSelectedPayment,
} from "../store/selectors/payment-selector";
import { fetchPaymentByIdService } from "../store/thunks/payment-thunks";
import { clearSelectedPayment } from "../store/slice/payment-slice";

interface PaymentDetailModalProps {
  paymentId?: string;
  isOpen: boolean;
  onClose: () => void;
}

export function PaymentDetailModal({
  paymentId,
  isOpen,
  onClose,
}: PaymentDetailModalProps) {
  const dispatch = useAppDispatch();

  // Use SEPARATE loading state - won't affect main page
  const isFetchingDetail = useAppSelector(selectIsFetchingDetail);

  // Get selected user from Redux
  const paymentData = useAppSelector(selectSelectedPayment);

  useEffect(() => {
    const fetchPaymentData = async () => {
      if (!paymentId || !isOpen) return;

      try {
        await dispatch(fetchPaymentByIdService(paymentId)).unwrap();
      } catch (error: any) {
        console.error("Error fetching payment data:", error);
      }
    };

    fetchPaymentData();
  }, [paymentId, isOpen, dispatch]);

  const handleClose = () => {
    dispatch(clearSelectedPayment());
    onClose();
  };

  return (
    <DetailModal
      isOpen={isOpen}
      onClose={handleClose}
      isLoading={isFetchingDetail}
      title={"Payment Details"}
      description={
        paymentData?.amount.toString() || "Loading payment information..."
      }
      avatarUrl={paymentData?.imageUrl}
      avatarName={paymentData?.amount.toString()}
      badges={
        paymentData && (
          <>
            <Badge
              variant="outline"
              className={getStatusColor(paymentData?.status ?? null)}
            >
              <span className="ml-1.5">
                {formatEnumToDisplay(paymentData?.status ?? "")}
              </span>
            </Badge>
          </>
        )
      }
    >
      {paymentData ? (
        <div className="space-y-6">
          {/* Personal Information */}
          <DetailSection title="Payment Information">
            <DetailRow
              label="Amount Dollat"
              value={paymentData?.formattedAmount || "---"}
            />
            <DetailRow
              label="amount"
              value={paymentData?.formattedAmountKhr || "---"}
            />
            <DetailRow
              label="Payment Method"
              value={paymentData?.paymentMethod || "---"}
            />
            <DetailRow label="Status" value={paymentData?.status || "---"} />
            <DetailRow
              label="Reference Number"
              value={paymentData?.referenceNumber || "---"}
            />
            <DetailRow
              label="Bisiness Name"
              value={paymentData?.businessName || "---"}
            />
            <DetailRow
              label="Plan Name"
              value={paymentData?.planName || "---"}
            />
            <DetailRow
              label="Subscription Display Name"
              value={paymentData?.subscriptionDisplayName || "---"}
            />
            <DetailRow label="Remark" value={paymentData?.notes || "---"} />
          </DetailSection>

          {/* System Information */}
          <DetailSection title="System Information">
            <DetailRow
              label="Payment ID"
              value={
                <span className="text-xs font-mono bg-muted px-2 py-1 rounded">
                  {paymentData?.id}
                </span>
              }
            />
            <DetailRow
              label="Created At"
              value={dateTimeFormat(paymentData?.createdAt ?? "")}
            />
            <DetailRow
              label="Created By"
              value={paymentData?.createdBy || "---"}
            />
            <DetailRow
              label="Last Updated"
              value={dateTimeFormat(paymentData?.updatedAt ?? "")}
            />
            <DetailRow
              label="Updated By"
              value={paymentData?.updatedBy || "---"}
              isLast
            />
          </DetailSection>
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No payment data available</p>
        </div>
      )}
    </DetailModal>
  );
}
