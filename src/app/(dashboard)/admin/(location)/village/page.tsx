"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Plus } from "lucide-react";
import { useDebounce } from "@/utils/debounce/debounce";
import { ROUTES } from "@/constants/AppRoutes/routes";
import { ModalMode } from "@/constants/AppResource/status/status";
import { CardHeaderSection } from "@/components/layout/card-header-section";
import { DeleteConfirmationModal } from "@/components/shared/modal/delete-confirmation-modal";
import { DataTableWithPagination } from "@/components/shared/common/data-table";
import { showToast } from "@/components/shared/common/show-toast";
import { usePagination } from "@/redux/store/use-pagination";
import { useVillageState } from "@/redux/features/location/store/state/village-state";
import { VillageResponseModel } from "@/redux/features/location/store/models/response/village-response";
import {
  deleteVillageService,
  fetchAllVillageService,
} from "@/redux/features/location/store/thunks/village-thunks";
import {
  setPageNo,
  setSearchFilter,
} from "@/redux/features/location/store/slice/village-slice";
import { villageTableColumns } from "@/redux/features/location/table/village-table";
import VillageModal from "@/redux/features/location/components/village-modal";
import { VillageDetailModal } from "@/redux/features/location/components/village-detail-modal";

export default function VillagePage() {
  const searchParams = useSearchParams();

  // Redux state
  const {
    villageState,
    villageData,
    villageContent,
    isLoading,
    filters,
    operations,
    pagination,
    dispatch,
  } = useVillageState();

  // Local UI state for modals only
  const [modalState, setModalState] = useState({
    isOpen: false,
    mode: ModalMode.CREATE_MODE,
    villageId: "",
  });

  const [detailModalState, setDetailModalState] = useState({
    isOpen: false,
    villageId: "",
  });

  const [deleteState, setDeleteState] = useState({
    isOpen: false,
    village: null as VillageResponseModel | null,
  });

  const debouncedSearch = useDebounce(filters.search, 400);

  const { updateUrlWithPage, handlePageChange } = usePagination({
    baseRoute: ROUTES.DASHBOARD.VILLAGE,
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
      fetchAllVillageService({
        search: debouncedSearch,
        pageNo: filters.pageNo,
      })
    );
  }, [dispatch, debouncedSearch, filters.pageNo]);

  // Event handlers
  const handleCreateVillage = () => {
    setModalState({
      isOpen: true,
      mode: ModalMode.CREATE_MODE,
      villageId: "",
    });
  };

  const handleEditVillage = (village: VillageResponseModel) => {
    setModalState({
      isOpen: true,
      mode: ModalMode.UPDATE_MODE,
      villageId: village?.id || "",
    });
  };

  const handleVillageViewDetail = (village: VillageResponseModel) => {
    setDetailModalState({
      isOpen: true,
      villageId: village.id || "",
    });
  };

  const handleDeleteVillage = (village: VillageResponseModel) => {
    setDeleteState({
      isOpen: true,
      village: village,
    });
  };

  const tableHandlers = useMemo(
    () => ({
      handleEditVillage,
      handleVillageViewDetail,
      handleDeleteVillage,
    }),
    []
  );

  const columns = useMemo(
    () =>
      villageTableColumns({
        data: villageData,
        handlers: tableHandlers,
      }),
    [villageState, tableHandlers]
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setSearchFilter(e.target.value));
  };

  const handlePageChangeWrapper = (page: number) => {
    handlePageChange(page);
  };

  const handleDelete = async () => {
    if (!deleteState.village?.id) return;

    try {
      await dispatch(deleteVillageService(deleteState.village.id)).unwrap();

      showToast.success(
        `Village "${deleteState.village.villageEn ?? ""}" deleted successfully`
      );

      closeDeleteModal();

      // Navigate to previous page if this was the last item
      if (villageContent.length === 1 && pagination.currentPage > 1) {
        const newPage = pagination.currentPage - 1;
        dispatch(setPageNo(newPage));
        updateUrlWithPage(newPage);
      }
    } catch (error: any) {
      showToast.error(error || "Failed to delete village");
    }
  };

  const closeModal = () => {
    setModalState({
      isOpen: false,
      mode: ModalMode.CREATE_MODE,
      villageId: "",
    });
  };

  const closeDetailModal = () => {
    setDetailModalState({
      isOpen: false,
      villageId: "",
    });
  };

  const closeDeleteModal = () => {
    setDeleteState({
      isOpen: false,
      village: null,
    });
  };

  return (
    <div className="flex flex-1 flex-col gap-4 px-2">
      <div className="space-y-4">
        <CardHeaderSection
          breadcrumbs={[
            { label: "Dashboard", href: ROUTES.DASHBOARD.INDEX },
            { label: "Village", href: "" },
          ]}
          title="Village"
          searchValue={filters.search}
          searchPlaceholder="Search village..."
          buttonTooltip="Create a new village"
          buttonIcon={<Plus className="w-3 h-3" />}
          buttonText="New"
          onSearchChange={handleSearchChange}
          openModal={handleCreateVillage}
        ></CardHeaderSection>

        {/* Data Table with Your Custom Pagination */}
        <DataTableWithPagination
          data={villageContent}
          columns={columns}
          loading={isLoading}
          emptyMessage="No Village found"
          getRowKey={(village) => village.id}
          currentPage={filters.pageNo}
          totalPages={pagination.totalPages}
          onPageChange={handlePageChangeWrapper}
        />
      </div>

      {/* Modals Add/Edit */}
      <VillageModal
        isOpen={modalState.isOpen}
        onClose={closeModal}
        villageId={modalState.villageId}
        mode={modalState.mode}
      />

      {/* Modals commune Detail */}
      <VillageDetailModal
        villageId={detailModalState.villageId}
        isOpen={detailModalState.isOpen}
        onClose={closeDetailModal}
      />

      {/* Modals Delete village platform */}
      <DeleteConfirmationModal
        isOpen={deleteState.isOpen}
        onClose={closeDeleteModal}
        onDelete={handleDelete}
        title="Delete Village"
        description={`Are you sure you want to delete this village ${
          deleteState.village?.villageEn || deleteState.village?.villageKh
        }?`}
        itemName={
          deleteState.village?.villageEn || deleteState.village?.villageKh
        }
        isSubmitting={operations.isDeleting}
      />
    </div>
  );
}
