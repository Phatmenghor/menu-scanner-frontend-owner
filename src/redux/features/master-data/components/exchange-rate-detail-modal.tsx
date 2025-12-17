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
import { clearSelectedBusiness } from "../store/slice/business-slice";
import { fetchExchangeRateByIdService } from "../store/thunks/exchange-rate-thunks";
import {
  selectIsFetchingDetail,
  selectSelectedExchangeRate,
} from "../store/selectors/exchange-rate-selector";
import { Status } from "@/constants/app-resource/status/status";

interface ExchangeRateDetailModalProps {
  exchangeId?: string;
  isOpen: boolean;
  onClose: () => void;
}

export function ExchangeRateDetailModal({
  exchangeId,
  isOpen,
  onClose,
}: ExchangeRateDetailModalProps) {
  const dispatch = useAppDispatch();

  // Use SEPARATE loading state - won't affect main page
  const isFetchingDetail = useAppSelector(selectIsFetchingDetail);

  // Get selected user from Redux
  const exchangeData = useAppSelector(selectSelectedExchangeRate);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!exchangeId || !isOpen) return;

      try {
        await dispatch(fetchExchangeRateByIdService(exchangeId)).unwrap();
      } catch (error: any) {
        console.error("Error fetching exchange data:", error);
      }
    };

    fetchUserData();
  }, [exchangeId, isOpen, dispatch]);

  const handleClose = () => {
    dispatch(clearSelectedBusiness());
    onClose();
  };

  return (
    <DetailModal
      isOpen={isOpen}
      onClose={handleClose}
      isLoading={isFetchingDetail}
      title={"Exchange Rate Details"}
      description={
        exchangeData?.usdToKhrRate.toString() ||
        "Loading exchange-rate information..."
      }
      badges={
        exchangeData && (
          <>
            <Badge
              variant="outline"
              className={getStatusColor(
                exchangeData?.isActive == true ? Status.ACTIVE : Status.INACTIVE
              )}
            >
              <span className="ml-1.5">
                {formatEnumToDisplay(
                  exchangeData?.isActive == true
                    ? Status.ACTIVE
                    : Status.INACTIVE
                )}
              </span>
            </Badge>
          </>
        )
      }
    >
      {exchangeData ? (
        <div className="space-y-6">
          {/* Personal Information */}
          <DetailSection title="Personal Information">
            <DetailRow
              label="USD to KHR Rate"
              value={exchangeData?.usdToKhrRate || "---"}
            />

            <DetailRow
              label="Status"
              value={
                <Badge
                  variant="outline"
                  className={getStatusColor(
                    exchangeData?.isActive == true
                      ? Status.ACTIVE
                      : Status.INACTIVE
                  )}
                >
                  <span className="ml-1.5">
                    {formatEnumToDisplay(
                      exchangeData?.isActive == true
                        ? Status.ACTIVE
                        : Status.INACTIVE
                    )}
                  </span>
                </Badge>
              }
            />

            <DetailRow label="Noted" value={exchangeData?.notes || "---"} />
          </DetailSection>

          {/* System Information */}
          <DetailSection title="System Information">
            <DetailRow
              label="Exchange Rate ID"
              value={
                <span className="text-xs font-mono bg-muted px-2 py-1 rounded">
                  {exchangeData?.id}
                </span>
              }
            />
            <DetailRow
              label="Created At"
              value={dateTimeFormat(exchangeData?.createdAt ?? "")}
            />
            <DetailRow
              label="Created By"
              value={exchangeData?.createdBy || "---"}
            />
            <DetailRow
              label="Last Updated"
              value={dateTimeFormat(exchangeData?.updatedAt ?? "")}
            />
            <DetailRow
              label="Updated By"
              value={exchangeData?.updatedBy || "---"}
              isLast
            />
          </DetailSection>
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No user data available</p>
        </div>
      )}
    </DetailModal>
  );
}
