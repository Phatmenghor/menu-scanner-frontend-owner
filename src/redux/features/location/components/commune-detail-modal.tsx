"use client";

import { useEffect } from "react";
import { dateTimeFormat } from "@/utils/date/date-time-format";
import { DetailModal } from "@/components/shared/modal/detail-modal";
import {
  DetailRow,
  DetailSection,
} from "@/components/shared/modal/detail-section";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import { fetchCommuneByIdService } from "../store/thunks/commune-thunks";
import {
  selectIsFetchingDetail,
  selectSelectedCommune,
} from "../store/selectors/commune-selector";
import { clearSelectedCommune } from "../store/slice/commune-slice";

interface CommuneDetailModalProps {
  communeId?: string;
  isOpen: boolean;
  onClose: () => void;
}

export function CommuneDetailModal({
  communeId,
  isOpen,
  onClose,
}: CommuneDetailModalProps) {
  const dispatch = useAppDispatch();

  // Use SEPARATE loading state - won't affect main page
  const isFetchingDetail = useAppSelector(selectIsFetchingDetail);

  // Get selected user from Redux
  const communeData = useAppSelector(selectSelectedCommune);

  useEffect(() => {
    const fetctCommuneData = async () => {
      if (!communeId || !isOpen) return;

      try {
        await dispatch(fetchCommuneByIdService(communeId)).unwrap();
      } catch (error: any) {
        console.error("Error fetching commune data:", error);
      }
    };

    fetctCommuneData();
  }, [communeId, isOpen, dispatch]);

  const handleClose = () => {
    dispatch(clearSelectedCommune());
    onClose();
  };

  return (
    <DetailModal
      isOpen={isOpen}
      onClose={handleClose}
      isLoading={isFetchingDetail}
      title={"Commune Details"}
      description={communeData?.communeEn || "Loading communt information..."}
    >
      {communeData ? (
        <div className="space-y-6">
          {/* Personal Information */}
          <DetailSection title="Commune Information">
            <DetailRow
              label="Commune Code"
              value={communeData?.communeCode || "---"}
            />

            <DetailRow
              label="Commune EN"
              value={communeData?.communeEn || "---"}
            />

            <DetailRow
              label="Commune KH"
              value={communeData?.communeKh || "---"}
            />

            <DetailRow
              label="District Code"
              value={communeData?.district?.districtCode || "---"}
            />

            <DetailRow
              label="District EN"
              value={communeData?.district?.districtEn || "---"}
            />

            <DetailRow
              label="District KH"
              value={communeData?.district?.districtKh || "---"}
            />

            <DetailRow
              label="Province Code"
              value={communeData?.district?.province?.provinceCode || "---"}
            />

            <DetailRow
              label="Province EN"
              value={communeData?.district?.province?.provinceEn || "---"}
            />

            <DetailRow
              label="Province KH"
              value={communeData?.district?.province?.provinceKh || "---"}
            />
          </DetailSection>

          {/* System Information */}
          <DetailSection title="System Information">
            <DetailRow
              label="Province ID"
              value={
                <span className="text-xs font-mono bg-muted px-2 py-1 rounded">
                  {communeData?.id}
                </span>
              }
            />
            <DetailRow
              label="Created At"
              value={dateTimeFormat(communeData?.createdAt ?? "")}
            />
            <DetailRow
              label="Created By"
              value={communeData?.createdBy || "---"}
            />
            <DetailRow
              label="Last Updated"
              value={dateTimeFormat(communeData?.updatedAt ?? "")}
            />
            <DetailRow
              label="Updated By"
              value={communeData?.updatedBy || "---"}
              isLast
            />
          </DetailSection>
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No commune data available</p>
        </div>
      )}
    </DetailModal>
  );
}
