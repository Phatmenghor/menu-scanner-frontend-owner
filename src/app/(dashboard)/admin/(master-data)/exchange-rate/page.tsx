"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Plus } from "lucide-react";
import { useDebounce } from "@/utils/debounce/debounce";
import { ROUTES } from "@/constants/app-routes/routes";
import {
  ModalMode,
  ExchangeRateStatus,
} from "@/constants/app-resource/status/status";
import { CardHeaderSection } from "@/components/layout/card-header-section";
import { CustomSelect } from "@/components/shared/common/custom-select";
import { DeleteConfirmationModal } from "@/components/shared/modal/delete-confirmation-modal";
import { EXCHAGE_RATE_FILTER } from "@/constants/app-resource/status/filter-status";
import { DataTableWithPagination } from "@/components/shared/common/data-table";
import { showToast } from "@/components/shared/common/show-toast";
import { usePagination } from "@/redux/store/use-pagination";
import {
  setPageNo,
  setSearchFilter,
} from "@/redux/features/auth/store/slice/users-slice";

import { deleteBusinessService } from "@/redux/features/master-data/store/thunks/business-thunks";
import { useExchangeRateState } from "@/redux/features/master-data/store/state/exchange-rate-state";
import { fetchAllExchangeRateService } from "@/redux/features/master-data/store/thunks/exchange-rate-thunks";
import { exchangeRateTableColumns } from "@/redux/features/master-data/table/exchange-rate-table";
import { ExchangeRateResponseModel } from "@/redux/features/master-data/store/models/response/exchange-rate-response";
import { setExchangeRateStatusFilter } from "@/redux/features/master-data/store/slice/exchage-rate-slice";
import ExchangeRateModal from "@/redux/features/master-data/components/exchange-rate-modal";
import { ExchangeRateDetailModal } from "@/redux/features/master-data/components/exchange-rate-detail-modal";

export default function ExchangeRatePage() {
  const searchParams = useSearchParams();

  // Redux state
  const {
    exchangeRateState,
    exchangeRateData,
    exchangeRateContent,
    isLoading,
    filters,
    operations,
    pagination,
    dispatch,
  } = useExchangeRateState();

  // Local UI state for modals only
  const [modalState, setModalState] = useState({
    isOpen: false,
    mode: ModalMode.CREATE_MODE,
    exchangeRateId: "",
  });

  const [detailModalState, setDetailModalState] = useState({
    isOpen: false,
    exchangeRateId: "",
  });

  const [deleteState, setDeleteState] = useState({
    isOpen: false,
    exchage: null as ExchangeRateResponseModel | null,
  });

  const debouncedSearch = useDebounce(filters.search, 400);

  const { updateUrlWithPage, handlePageChange } = usePagination({
    baseRoute: ROUTES.DASHBOARD.EXCHANGE_RATE,
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

  // Fetch exchage rate when filters change
  useEffect(() => {
    dispatch(
      fetchAllExchangeRateService({
        search: debouncedSearch,
        pageNo: filters.pageNo,
        isActive:
          filters.isActive === ExchangeRateStatus.ALL
            ? undefined
            : filters.isActive == ExchangeRateStatus.ACTIVE
            ? true
            : false,
      })
    );
  }, [dispatch, debouncedSearch, filters.isActive, filters.pageNo]);

  // Event handlers
  const handleCreateUser = () => {
    setModalState({
      isOpen: true,
      mode: ModalMode.CREATE_MODE,
      exchangeRateId: "",
    });
  };

  const handleEditExchangeRate = (exchage: ExchangeRateResponseModel) => {
    setModalState({
      isOpen: true,
      mode: ModalMode.UPDATE_MODE,
      exchangeRateId: exchage?.id || "",
    });
  };

  const handleExchangeRateViewDetail = (exchage: ExchangeRateResponseModel) => {
    setDetailModalState({
      isOpen: true,
      exchangeRateId: exchage.id || "",
    });
  };

  const handleDeleteExchangeRate = (exchage: ExchangeRateResponseModel) => {
    setDeleteState({
      isOpen: true,
      exchage: exchage,
    });
  };

  const tableHandlers = useMemo(
    () => ({
      handleEditExchangeRate,
      handleExchangeRateViewDetail,
      handleDeleteExchangeRate,
    }),
    []
  );

  const columns = useMemo(
    () =>
      exchangeRateTableColumns({
        data: exchangeRateData,
        handlers: tableHandlers,
      }),
    [exchangeRateState, tableHandlers]
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setSearchFilter(e.target.value));
  };

  const handleStatusChange = (status: ExchangeRateStatus) => {
    dispatch(setExchangeRateStatusFilter(status));
  };

  const handlePageChangeWrapper = (page: number) => {
    dispatch(setPageNo(page));
    handlePageChange(page);
  };

  const handleDelete = async () => {
    if (!deleteState.exchage?.id) return;

    try {
      await dispatch(deleteBusinessService(deleteState.exchage.id)).unwrap();

      showToast.success(
        `Exchange Rate "${
          deleteState.exchage.usdToKhrRate ?? ""
        }" deleted successfully`
      );

      closeDeleteModal();

      // Navigate to previous page if this was the last item
      if (exchangeRateContent.length === 1 && pagination.currentPage > 1) {
        const newPage = pagination.currentPage - 1;
        dispatch(setPageNo(newPage));
        updateUrlWithPage(newPage);
      }
    } catch (error: any) {
      showToast.error(error || "Failed to delete Exchange Rate");
    }
  };

  const closeModal = () => {
    setModalState({
      isOpen: false,
      mode: ModalMode.CREATE_MODE,
      exchangeRateId: "",
    });
  };

  const closeDetailModal = () => {
    setDetailModalState({
      isOpen: false,
      exchangeRateId: "",
    });
  };

  const closeDeleteModal = () => {
    setDeleteState({
      isOpen: false,
      exchage: null,
    });
  };

  return (
    <div className="flex flex-1 flex-col gap-4 px-2">
      <div className="space-y-4">
        <CardHeaderSection
          breadcrumbs={[
            { label: "Dashboard", href: ROUTES.DASHBOARD.INDEX },
            { label: "Exchange Rate", href: "" },
          ]}
          title="Exchange Rate"
          buttonTooltip="Create a new exchange rate"
          searchValue={filters.search}
          searchPlaceholder="Search exchange rate..."
          buttonIcon={<Plus className="w-3 h-3" />}
          buttonText="New"
          onSearchChange={handleSearchChange}
          openModal={handleCreateUser}
        >
          <div className="flex items-center gap-3">
            <CustomSelect
              options={EXCHAGE_RATE_FILTER}
              value={filters.isActive}
              placeholder="All Status"
              onValueChange={(value) =>
                handleStatusChange(value as ExchangeRateStatus)
              }
              label="Account Status"
            />
          </div>
        </CardHeaderSection>

        {/* Data Table with Pagination */}
        <DataTableWithPagination
          data={exchangeRateContent}
          columns={columns}
          loading={isLoading}
          emptyMessage="No Exchange Rate found"
          getRowKey={(exchange) => exchange.id}
          currentPage={filters.pageNo}
          totalPages={pagination.totalPages}
          onPageChange={handlePageChangeWrapper}
        />
      </div>

      {/* Modals Add/Edit */}
      <ExchangeRateModal
        isOpen={modalState.isOpen}
        onClose={closeModal}
        exchangeId={modalState.exchangeRateId}
        mode={modalState.mode}
      />

      {/* Modals exchange rate platform Detail */}
      <ExchangeRateDetailModal
        exchangeId={detailModalState.exchangeRateId}
        isOpen={detailModalState.isOpen}
        onClose={closeDetailModal}
      />

      {/* Modals Delete name platform */}
      <DeleteConfirmationModal
        isOpen={deleteState.isOpen}
        onClose={closeDeleteModal}
        onDelete={handleDelete}
        title="Delete Exchage Rate"
        description={`Are you sure you want to delete this Exchage Rate ${
          deleteState.exchage?.usdToKhrRate || deleteState.exchage?.notes
        }?`}
        itemName={
          deleteState.exchage?.usdToKhrRate.toString() ||
          deleteState.exchage?.notes
        }
        isSubmitting={operations.isDeleting}
      />
    </div>
  );
}
