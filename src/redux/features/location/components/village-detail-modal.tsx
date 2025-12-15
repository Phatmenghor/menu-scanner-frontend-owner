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
  selectSelectedVillage,
} from "../store/selectors/vaillage-selector";
import { fetchVillageByIdService } from "../store/thunks/village-thunks";
import { clearSelectedVillage } from "../store/slice/village-slice";

interface VillageDetailModalProps {
  villageId?: string;
  isOpen: boolean;
  onClose: () => void;
}

export function VillageDetailModal({
  villageId,
  isOpen,
  onClose,
}: VillageDetailModalProps) {
  const dispatch = useAppDispatch();

  // Use SEPARATE loading state - won't affect main page
  const isFetchingDetail = useAppSelector(selectIsFetchingDetail);

  // Get selected user from Redux
  const villageData = useAppSelector(selectSelectedVillage);

  useEffect(() => {
    const fetctVillageData = async () => {
      if (!villageId || !isOpen) return;

      try {
        await dispatch(fetchVillageByIdService(villageId)).unwrap();
      } catch (error: any) {
        console.error("Error fetching village data:", error);
      }
    };

    fetctVillageData();
  }, [villageId, isOpen, dispatch]);

  const handleClose = () => {
    dispatch(clearSelectedVillage());
    onClose();
  };

  return (
    <DetailModal
      isOpen={isOpen}
      onClose={handleClose}
      isLoading={isFetchingDetail}
      title={"Village Details"}
      description={villageData?.villageEn || "Loading village information..."}
    >
      {villageData ? (
        <div className="space-y-6">
          {/* Personal Information */}
          <DetailSection title="Village Information">
            <DetailRow
              label="Village Code"
              value={villageData?.villageCode || "---"}
            />

            <DetailRow
              label="Village EN"
              value={villageData?.villageEn || "---"}
            />

            <DetailRow
              label="Village KH"
              value={villageData?.villageKh || "---"}
            />

            <DetailRow
              label="Commune Code"
              value={villageData?.commune?.communeCode || "---"}
            />

            <DetailRow
              label="Commune EN"
              value={villageData?.commune?.communeEn || "---"}
            />

            <DetailRow
              label="Commune KH"
              value={villageData?.commune?.communeKh || "---"}
            />

            <DetailRow
              label="District Code"
              value={villageData?.commune?.district?.districtCode || "---"}
            />

            <DetailRow
              label="District EN"
              value={villageData?.commune?.district?.districtEn || "---"}
            />

            <DetailRow
              label="District KH"
              value={villageData?.commune?.district?.districtKh || "---"}
            />

            <DetailRow
              label="Province Code"
              value={
                villageData?.commune?.district?.province?.provinceCode || "---"
              }
            />

            <DetailRow
              label="Province EN"
              value={
                villageData?.commune?.district?.province?.provinceEn || "---"
              }
            />

            <DetailRow
              label="Province KH"
              value={
                villageData?.commune?.district?.province?.provinceKh || "---"
              }
            />
          </DetailSection>

          {/* System Information */}
          <DetailSection title="System Information">
            <DetailRow
              label="Village ID"
              value={
                <span className="text-xs font-mono bg-muted px-2 py-1 rounded">
                  {villageData?.id}
                </span>
              }
            />
            <DetailRow
              label="Created At"
              value={dateTimeFormat(villageData?.createdAt ?? "")}
            />
            <DetailRow
              label="Created By"
              value={villageData?.createdBy || "---"}
            />
            <DetailRow
              label="Last Updated"
              value={dateTimeFormat(villageData?.updatedAt ?? "")}
            />
            <DetailRow
              label="Updated By"
              value={villageData?.updatedBy || "---"}
              isLast
            />
          </DetailSection>
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No village data available</p>
        </div>
      )}
    </DetailModal>
  );
}
