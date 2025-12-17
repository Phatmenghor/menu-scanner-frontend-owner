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
import { useProvinceState } from "@/redux/features/location/store/state/province-state";
import { ProvinceResponseModel } from "@/redux/features/location/store/models/response/province-response";
import {
  deleteProvinceService,
  fetchAllProvinceService,
} from "@/redux/features/location/store/thunks/province-thunks";
import { provinceTableColumns } from "@/redux/features/location/table/province-table";
import {
  setPageNo,
  setSearchFilter,
} from "@/redux/features/location/store/slice/province-slice";
import ProvinceModal from "@/redux/features/location/components/province-modal";
import { ProvinceDetailModal } from "@/redux/features/location/components/province-detail-modal";

export default function ProvincePage() {
  const searchParams = useSearchParams();

  // Redux state
  const {
    provinceState,
    provinceData,
    provinceContent,
    isLoading,
    filters,
    operations,
    pagination,
    dispatch,
  } = useProvinceState();

  // Local UI state for modals only
  const [modalState, setModalState] = useState({
    isOpen: false,
    mode: ModalMode.CREATE_MODE,
    provinceId: "",
  });

  const [detailModalState, setDetailModalState] = useState({
    isOpen: false,
    provinceId: "",
  });

  const [deleteState, setDeleteState] = useState({
    isOpen: false,
    province: null as ProvinceResponseModel | null,
  });

  const debouncedSearch = useDebounce(filters.search, 400);

  const { updateUrlWithPage, handlePageChange } = usePagination({
    baseRoute: ROUTES.DASHBOARD.PROVINCE,
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

  // Fetch province when filters change
  useEffect(() => {
    dispatch(
      fetchAllProvinceService({
        search: debouncedSearch,
        pageNo: filters.pageNo,
      })
    );
  }, [dispatch, debouncedSearch, filters.pageNo]);

  // Event handlers
  const handleCreateProvince = () => {
    setModalState({
      isOpen: true,
      mode: ModalMode.CREATE_MODE,
      provinceId: "",
    });
  };

  const handleEditProvince = (province: ProvinceResponseModel) => {
    setModalState({
      isOpen: true,
      mode: ModalMode.UPDATE_MODE,
      provinceId: province?.id || "",
    });
  };

  const handleProvinceViewDetail = (province: ProvinceResponseModel) => {
    setDetailModalState({
      isOpen: true,
      provinceId: province.id || "",
    });
  };

  const handleDeleteProvince = (province: ProvinceResponseModel) => {
    setDeleteState({
      isOpen: true,
      province: province,
    });
  };

  const tableHandlers = useMemo(
    () => ({
      handleEditProvince,
      handleProvinceViewDetail,
      handleDeleteProvince,
    }),
    []
  );

  const columns = useMemo(
    () =>
      provinceTableColumns({
        data: provinceData,
        handlers: tableHandlers,
      }),
    [provinceState, tableHandlers]
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setSearchFilter(e.target.value));
  };

  const handlePageChangeWrapper = (page: number) => {
    handlePageChange(page);
  };

  const handleDelete = async () => {
    if (!deleteState.province?.id) return;

    try {
      await dispatch(deleteProvinceService(deleteState.province.id)).unwrap();

      showToast.success(
        `Province "${
          deleteState.province.provinceEn ?? ""
        }" deleted successfully`
      );

      closeDeleteModal();

      // Navigate to previous page if this was the last item
      if (provinceContent.length === 1 && pagination.currentPage > 1) {
        const newPage = pagination.currentPage - 1;
        dispatch(setPageNo(newPage));
        updateUrlWithPage(newPage);
      }
    } catch (error: any) {
      showToast.error(error || "Failed to delete province");
    }
  };

  const closeModal = () => {
    setModalState({
      isOpen: false,
      mode: ModalMode.CREATE_MODE,
      provinceId: "",
    });
  };

  const closeDetailModal = () => {
    setDetailModalState({
      isOpen: false,
      provinceId: "",
    });
  };

  const closeDeleteModal = () => {
    setDeleteState({
      isOpen: false,
      province: null,
    });
  };

  return (
    <div className="flex flex-1 flex-col gap-4 px-2">
      <div className="space-y-4">
        <CardHeaderSection
          breadcrumbs={[
            { label: "Dashboard", href: ROUTES.DASHBOARD.INDEX },
            { label: "Province", href: "" },
          ]}
          title="Province"
          searchValue={filters.search}
          searchPlaceholder="Search province..."
          buttonTooltip="Create a new province"
          buttonIcon={<Plus className="w-3 h-3" />}
          buttonText="New"
          onSearchChange={handleSearchChange}
          openModal={handleCreateProvince}
        ></CardHeaderSection>

        {/* Data Table with Your Custom Pagination */}
        <DataTableWithPagination
          data={provinceContent}
          columns={columns}
          loading={isLoading}
          emptyMessage="No Province found"
          getRowKey={(province) => province.id}
          currentPage={filters.pageNo}
          totalPages={pagination.totalPages}
          onPageChange={handlePageChangeWrapper}
        />
      </div>

      {/* Modals Add/Edit */}
      <ProvinceModal
        isOpen={modalState.isOpen}
        onClose={closeModal}
        provinceId={modalState.provinceId}
        mode={modalState.mode}
      />

      {/* Modals Province platform Detail */}
      <ProvinceDetailModal
        provinceId={detailModalState.provinceId}
        isOpen={detailModalState.isOpen}
        onClose={closeDetailModal}
      />

      {/* Modals Delete Province platform */}
      <DeleteConfirmationModal
        isOpen={deleteState.isOpen}
        onClose={closeDeleteModal}
        onDelete={handleDelete}
        title="Delete Province"
        description={`Are you sure you want to delete this province ${
          deleteState.province?.provinceEn || deleteState.province?.provinceKh
        }?`}
        itemName={
          deleteState.province?.provinceEn || deleteState.province?.provinceKh
        }
        isSubmitting={operations.isDeleting}
      />
    </div>
  );
}
