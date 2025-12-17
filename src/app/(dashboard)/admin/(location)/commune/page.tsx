"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Plus } from "lucide-react";
import { useDebounce } from "@/utils/debounce/debounce";
import { ROUTES } from "@/constants/app-routes/routes";
import { ModalMode } from "@/constants/app-resource/status/status";
import { CardHeaderSection } from "@/components/layout/card-header-section";
import { DeleteConfirmationModal } from "@/components/shared/modal/delete-confirmation-modal";
import { DataTableWithPagination } from "@/components/shared/common/data-table";
import { showToast } from "@/components/shared/common/show-toast";
import { usePagination } from "@/redux/store/use-pagination";
import {
  setPageNo,
  setSearchFilter,
} from "@/redux/features/location/store/slice/province-slice";
import { useCommuneState } from "@/redux/features/location/store/state/commune-state";
import { CommuneResponseModel } from "@/redux/features/location/store/models/response/commune-response";
import {
  deleteCommuneService,
  fetchAllCommuneService,
} from "@/redux/features/location/store/thunks/commune-thunks";
import { communeTableColumns } from "@/redux/features/location/table/commune-table";
import CommuneModal from "@/redux/features/location/components/commune-modal";
import { CommuneDetailModal } from "@/redux/features/location/components/commune-detail-modal";
import { ComboboxSelectProvince } from "@/components/shared/combo-box/combobox-province";
import { DistrictResponseModel } from "@/redux/features/location/store/models/response/district-response";
import { ProvinceResponseModel } from "@/redux/features/location/store/models/response/province-response";
import { ComboboxSelectDistrict } from "@/components/shared/combo-box/combobox-district";

export default function CommunePage() {
  const searchParams = useSearchParams();

  const [selectedProvince, setSelectedProvince] =
    useState<ProvinceResponseModel | null>(null);
  const [selectedDistrict, setSelectedDistrict] =
    useState<DistrictResponseModel | null>(null);

  // Redux state
  const {
    communeState,
    communeData,
    communeContent,
    isLoading,
    filters,
    operations,
    pagination,
    dispatch,
  } = useCommuneState();

  // Local UI state for modals only
  const [modalState, setModalState] = useState({
    isOpen: false,
    mode: ModalMode.CREATE_MODE,
    communeId: "",
  });

  const [detailModalState, setDetailModalState] = useState({
    isOpen: false,
    communeId: "",
  });

  const [deleteState, setDeleteState] = useState({
    isOpen: false,
    commune: null as CommuneResponseModel | null,
  });

  const debouncedSearch = useDebounce(filters.search, 400);

  const { updateUrlWithPage, handlePageChange } = usePagination({
    baseRoute: ROUTES.DASHBOARD.COMMUNE,
    defaultPageSize: 15,
  });

  // Initialize URL and Redux state on mount
  useEffect(() => {
    const pageParam = searchParams.get("pageNo");
    const pageFromUrl = pageParam ? parseInt(pageParam, 10) : 1;

    if (pageFromUrl !== pagination.currentPage) {
      dispatch(setPageNo(pageFromUrl));
    }
  }, [searchParams, filters.pageNo, dispatch]);

  // Fetch commune when filters change
  useEffect(() => {
    dispatch(
      fetchAllCommuneService({
        search: debouncedSearch,
        pageNo: filters.pageNo,
        provinceCode: selectedProvince?.provinceCode,
        districtCode: selectedDistrict?.districtCode,
      })
    );
  }, [
    dispatch,
    debouncedSearch,
    filters.pageNo,
    selectedProvince,
    selectedDistrict,
  ]);

  // Event handlers
  const handleCreateCommune = () => {
    setModalState({
      isOpen: true,
      mode: ModalMode.CREATE_MODE,
      communeId: "",
    });
  };

  const handleEditCommune = (commune: CommuneResponseModel) => {
    setModalState({
      isOpen: true,
      mode: ModalMode.UPDATE_MODE,
      communeId: commune?.id || "",
    });
  };

  const handleCommuneViewDetail = (commune: CommuneResponseModel) => {
    setDetailModalState({
      isOpen: true,
      communeId: commune.id || "",
    });
  };

  const handleDeleteCommune = (commune: CommuneResponseModel) => {
    setDeleteState({
      isOpen: true,
      commune: commune,
    });
  };

  const tableHandlers = useMemo(
    () => ({
      handleEditCommune,
      handleCommuneViewDetail,
      handleDeleteCommune,
    }),
    []
  );

  const columns = useMemo(
    () =>
      communeTableColumns({
        data: communeData,
        handlers: tableHandlers,
      }),
    [communeState, tableHandlers]
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setSearchFilter(e.target.value));
  };

  const handlePageChangeWrapper = (page: number) => {
    handlePageChange(page);
  };

  const handleDelete = async () => {
    if (!deleteState.commune?.id) return;

    try {
      await dispatch(deleteCommuneService(deleteState.commune.id)).unwrap();

      showToast.success(
        `Commune "${deleteState.commune.communeEn ?? ""}" deleted successfully`
      );

      closeDeleteModal();

      // Navigate to previous page if this was the last item
      if (communeContent.length === 1 && pagination.currentPage > 1) {
        const newPage = pagination.currentPage - 1;
        dispatch(setPageNo(newPage));
        updateUrlWithPage(newPage);
      }
    } catch (error: any) {
      showToast.error(error || "Failed to delete commune");
    }
  };

  const closeModal = () => {
    setModalState({
      isOpen: false,
      mode: ModalMode.CREATE_MODE,
      communeId: "",
    });
  };

  const closeDetailModal = () => {
    setDetailModalState({
      isOpen: false,
      communeId: "",
    });
  };

  const closeDeleteModal = () => {
    setDeleteState({
      isOpen: false,
      commune: null,
    });
  };

  const handleProvinceChange = (province: ProvinceResponseModel | null) => {
    setSelectedProvince(province);
  };

  const handleDistrictChange = (district: DistrictResponseModel | null) => {
    setSelectedDistrict(district);
  };

  return (
    <div className="flex flex-1 flex-col gap-4 px-2">
      <div className="space-y-4">
        <CardHeaderSection
          breadcrumbs={[
            { label: "Dashboard", href: ROUTES.DASHBOARD.INDEX },
            { label: "Commune", href: "" },
          ]}
          title="Commune"
          searchValue={filters.search}
          searchPlaceholder="Search commune..."
          buttonTooltip="Create a new commune"
          buttonIcon={<Plus className="w-3 h-3" />}
          buttonText="New"
          onSearchChange={handleSearchChange}
          openModal={handleCreateCommune}
        >
          <div className="flex items-center gap-3">
            <ComboboxSelectDistrict
              dataSelect={selectedDistrict}
              onChangeSelected={handleDistrictChange}
              placeholder="All District"
              showAllOption={true}
              size="md"
            />
            <ComboboxSelectProvince
              dataSelect={selectedProvince}
              onChangeSelected={handleProvinceChange}
              placeholder="All Province"
              showAllOption={true}
              size="md"
            />
          </div>
        </CardHeaderSection>

        {/* Data Table with Your Custom Pagination */}
        <DataTableWithPagination
          data={communeContent}
          columns={columns}
          loading={isLoading}
          emptyMessage="No Commune found"
          getRowKey={(commune) => commune.id}
          currentPage={filters.pageNo}
          totalPages={pagination.totalPages}
          onPageChange={handlePageChangeWrapper}
        />
      </div>

      {/* Modals Add/Edit */}
      <CommuneModal
        isOpen={modalState.isOpen}
        onClose={closeModal}
        communeId={modalState.communeId}
        mode={modalState.mode}
      />

      {/* Modals commune Detail */}
      <CommuneDetailModal
        communeId={detailModalState.communeId}
        isOpen={detailModalState.isOpen}
        onClose={closeDetailModal}
      />

      {/* Modals Delete commune platform */}
      <DeleteConfirmationModal
        isOpen={deleteState.isOpen}
        onClose={closeDeleteModal}
        onDelete={handleDelete}
        title="Delete Commune"
        description={`Are you sure you want to delete this commune ${
          deleteState.commune?.communeEn || deleteState.commune?.communeKh
        }?`}
        itemName={
          deleteState.commune?.communeEn || deleteState.commune?.communeKh
        }
        isSubmitting={operations.isDeleting}
      />
    </div>
  );
}
