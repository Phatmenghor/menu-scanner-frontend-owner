"use client";

import { useEffect } from "react";
import { dateTimeFormat } from "@/utils/date/date-time-format";
import { DetailModal } from "@/components/shared/modal/detail-modal";
import {
  DetailRow,
  DetailSection,
} from "@/components/shared/modal/detail-section";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import {
  selectIsFetchingDetail,
  selectSelectedProvince,
} from "../store/selectors/province-selector";
import { fetchProvinceByIdService } from "../store/thunks/province-thunks";
import { clearSelectedProvince } from "../store/slice/province-slice";

interface ProvinceDetailModalProps {
  provinceId?: string;
  isOpen: boolean;
  onClose: () => void;
}

export function ProvinceDetailModal({
  provinceId,
  isOpen,
  onClose,
}: ProvinceDetailModalProps) {
  const dispatch = useAppDispatch();

  // Use SEPARATE loading state - won't affect main page
  const isFetchingDetail = useAppSelector(selectIsFetchingDetail);

  // Get selected user from Redux
  const provinceData = useAppSelector(selectSelectedProvince);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!provinceId || !isOpen) return;

      try {
        await dispatch(fetchProvinceByIdService(provinceId)).unwrap();
      } catch (error: any) {
        console.error("Error fetching province data:", error);
      }
    };

    fetchUserData();
  }, [provinceId, isOpen, dispatch]);

  const handleClose = () => {
    dispatch(clearSelectedProvince());
    onClose();
  };

  return (
    <DetailModal
      isOpen={isOpen}
      onClose={handleClose}
      isLoading={isFetchingDetail}
      title={"Province Details"}
      description={
        provinceData?.provinceEn || "Loading province information..."
      }
    >
      {provinceData ? (
        <div className="space-y-6">
          {/* Personal Information */}
          <DetailSection title="Personal Information">
            <DetailRow
              label="Province Code"
              value={provinceData?.provinceCode || "---"}
            />

            <DetailRow
              label="Province EN"
              value={provinceData?.provinceEn || "---"}
            />

            <DetailRow
              label="Province KH"
              value={provinceData?.provinceKh || "---"}
            />
          </DetailSection>

          {/* System Information */}
          <DetailSection title="System Information">
            <DetailRow
              label="Province ID"
              value={
                <span className="text-xs font-mono bg-muted px-2 py-1 rounded">
                  {provinceData?.id}
                </span>
              }
            />
            <DetailRow
              label="Created At"
              value={dateTimeFormat(provinceData?.createdAt ?? "")}
            />
            <DetailRow
              label="Created By"
              value={provinceData?.createdBy || "---"}
            />
            <DetailRow
              label="Last Updated"
              value={dateTimeFormat(provinceData?.updatedAt ?? "")}
            />
            <DetailRow
              label="Updated By"
              value={provinceData?.updatedBy || "---"}
              isLast
            />
          </DetailSection>
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No province data available</p>
        </div>
      )}
    </DetailModal>
  );
}
