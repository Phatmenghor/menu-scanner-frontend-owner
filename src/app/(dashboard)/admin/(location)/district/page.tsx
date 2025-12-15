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
import {
  setPageNo,
  setSearchFilter,
} from "@/redux/features/location/store/slice/province-slice";
import ProvinceModal from "@/redux/features/location/components/province-modal";
import { ProvinceDetailModal } from "@/redux/features/location/components/province-detail-modal";
import { useDistrictState } from "@/redux/features/location/store/state/district-state";
import { DistrictResponseModel } from "@/redux/features/location/store/models/response/district-response";
import {
  deleteDistrictService,
  fetchAllDistrictService,
} from "@/redux/features/location/store/thunks/district-thunks";
import { districtTableColumns } from "@/redux/features/location/table/district-table";
import DistrictModal from "@/redux/features/location/components/district-modal";
import { DistrictDetailModal } from "@/redux/features/location/components/district-detail-modal";

export default function DistrictPage() {
  const searchParams = useSearchParams();

  // Redux state
  const {
    districtState,
    districtData,
    districtContent,
    isLoading,
    filters,
    operations,
    pagination,
    dispatch,
  } = useDistrictState();

  // Local UI state for modals only
  const [modalState, setModalState] = useState({
    isOpen: false,
    mode: ModalMode.CREATE_MODE,
    districtId: "",
  });

  const [detailModalState, setDetailModalState] = useState({
    isOpen: false,
    districtId: "",
  });

  const [deleteState, setDeleteState] = useState({
    isOpen: false,
    district: null as DistrictResponseModel | null,
  });

  const debouncedSearch = useDebounce(filters.search, 400);

  const { updateUrlWithPage, handlePageChange } = usePagination({
    baseRoute: ROUTES.DASHBOARD.DISTRICT,
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
      fetchAllDistrictService({
        search: debouncedSearch,
        pageNo: filters.pageNo,
      })
    );
  }, [dispatch, debouncedSearch, filters.pageNo]);

  // Event handlers
  const handleCreateDistrict = () => {
    setModalState({
      isOpen: true,
      mode: ModalMode.CREATE_MODE,
      districtId: "",
    });
  };

  const handleEditDistrict = (province: DistrictResponseModel) => {
    setModalState({
      isOpen: true,
      mode: ModalMode.UPDATE_MODE,
      districtId: province?.id || "",
    });
  };

  const handleDistrictViewDetail = (province: DistrictResponseModel) => {
    setDetailModalState({
      isOpen: true,
      districtId: province.id || "",
    });
  };

  const handleDeleteDistrict = (province: DistrictResponseModel) => {
    setDeleteState({
      isOpen: true,
      district: province,
    });
  };

  const tableHandlers = useMemo(
    () => ({
      handleEditDistrict,
      handleDistrictViewDetail,
      handleDeleteDistrict,
    }),
    []
  );

  const columns = useMemo(
    () =>
      districtTableColumns({
        data: districtData,
        handlers: tableHandlers,
      }),
    [districtState, tableHandlers]
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setSearchFilter(e.target.value));
  };

  const handlePageChangeWrapper = (page: number) => {
    handlePageChange(page);
  };

  const handleDelete = async () => {
    if (!deleteState.district?.id) return;

    try {
      await dispatch(deleteDistrictService(deleteState.district.id)).unwrap();

      showToast.success(
        `District "${
          deleteState.district.districtEn ?? ""
        }" deleted successfully`
      );

      closeDeleteModal();

      // Navigate to previous page if this was the last item
      if (districtContent.length === 1 && pagination.currentPage > 1) {
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
      districtId: "",
    });
  };

  const closeDetailModal = () => {
    setDetailModalState({
      isOpen: false,
      districtId: "",
    });
  };

  const closeDeleteModal = () => {
    setDeleteState({
      isOpen: false,
      district: null,
    });
  };

  return (
    <div className="flex flex-1 flex-col gap-4 px-2">
      <div className="space-y-4">
        <CardHeaderSection
          breadcrumbs={[
            { label: "Dashboard", href: ROUTES.DASHBOARD.INDEX },
            { label: "District", href: "" },
          ]}
          title="District"
          searchValue={filters.search}
          searchPlaceholder="Search sistrict..."
          buttonTooltip="Create a new district"
          buttonIcon={<Plus className="w-3 h-3" />}
          buttonText="New"
          onSearchChange={handleSearchChange}
          openModal={handleCreateDistrict}
        ></CardHeaderSection>

        {/* Data Table with Your Custom Pagination */}
        <DataTableWithPagination
          data={districtContent}
          columns={columns}
          loading={isLoading}
          emptyMessage="No District found"
          getRowKey={(district) => district.id}
          currentPage={filters.pageNo}
          totalPages={pagination.totalPages}
          onPageChange={handlePageChangeWrapper}
        />
      </div>

      {/* Modals Add/Edit */}
      <DistrictModal
        isOpen={modalState.isOpen}
        onClose={closeModal}
        districtId={modalState.districtId}
        mode={modalState.mode}
      />

      {/* Modals district Detail */}
      <DistrictDetailModal
        districtId={detailModalState.districtId}
        isOpen={detailModalState.isOpen}
        onClose={closeDetailModal}
      />

      {/* Modals Delete district platform */}
      <DeleteConfirmationModal
        isOpen={deleteState.isOpen}
        onClose={closeDeleteModal}
        onDelete={handleDelete}
        title="Delete District"
        description={`Are you sure you want to delete this district ${
          deleteState.district?.districtEn || deleteState.district?.districtKh
        }?`}
        itemName={
          deleteState.district?.districtEn || deleteState.district?.districtKh
        }
        isSubmitting={operations.isDeleting}
      />
    </div>
  );
}
