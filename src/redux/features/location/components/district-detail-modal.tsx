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
  selectSelectedDistrict,
} from "../store/selectors/district-selector";
import { fetchDistrictByIdService } from "../store/thunks/district-thunks";
import { clearSelectedDistrict } from "../store/slice/district-slice";

interface DistrictDetailModalProps {
  districtId?: string;
  isOpen: boolean;
  onClose: () => void;
}

export function DistrictDetailModal({
  districtId,
  isOpen,
  onClose,
}: DistrictDetailModalProps) {
  const dispatch = useAppDispatch();

  // Use SEPARATE loading state - won't affect main page
  const isFetchingDetail = useAppSelector(selectIsFetchingDetail);

  // Get selected district from Redux
  const districtData = useAppSelector(selectSelectedDistrict);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!districtId || !isOpen) return;

      try {
        await dispatch(fetchDistrictByIdService(districtId)).unwrap();
      } catch (error: any) {
        console.error("Error fetching district data:", error);
      }
    };

    fetchUserData();
  }, [districtId, isOpen, dispatch]);

  const handleClose = () => {
    dispatch(clearSelectedDistrict());
    onClose();
  };

  return (
    <DetailModal
      isOpen={isOpen}
      onClose={handleClose}
      isLoading={isFetchingDetail}
      title={"District Details"}
      description={
        districtData?.districtEn || "Loading district information..."
      }
    >
      {districtData ? (
        <div className="space-y-6">
          {/* Personal Information */}
          <DetailSection title="District Information">
            <DetailRow
              label="District Code"
              value={districtData?.districtCode || "---"}
            />

            <DetailRow
              label="District EN"
              value={districtData?.districtEn || "---"}
            />

            <DetailRow
              label="District KH"
              value={districtData?.districtKh || "---"}
            />

            <DetailRow
              label="Province Code"
              value={districtData?.province?.provinceCode || "---"}
            />
            <DetailRow
              label="Province EN"
              value={districtData?.province?.provinceEn || "---"}
            />

            <DetailRow
              label="Province KH"
              value={districtData?.province?.provinceKh || "---"}
            />
          </DetailSection>

          {/* System Information */}
          <DetailSection title="System Information">
            <DetailRow
              label="District ID"
              value={
                <span className="text-xs font-mono bg-muted px-2 py-1 rounded">
                  {districtData?.id}
                </span>
              }
            />
            <DetailRow
              label="Created At"
              value={dateTimeFormat(districtData?.createdAt ?? "")}
            />
            <DetailRow
              label="Created By"
              value={districtData?.createdBy || "---"}
            />
            <DetailRow
              label="Last Updated"
              value={dateTimeFormat(districtData?.updatedAt ?? "")}
            />
            <DetailRow
              label="Updated By"
              value={districtData?.updatedBy || "---"}
              isLast
            />
          </DetailSection>
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No District data available</p>
        </div>
      )}
    </DetailModal>
  );
}
