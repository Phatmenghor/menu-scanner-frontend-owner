"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Plus } from "lucide-react";
import { useDebounce } from "@/utils/debounce/debounce";
import { ROUTES } from "@/constants/AppRoutes/routes";
import {
  AccountStatus,
  ModalMode,
  BusinessStatus,
  SubscriptionStatus,
  ExchangeRateStatus,
} from "@/constants/AppResource/status/status";
import { CardHeaderSection } from "@/components/layout/card-header-section";
import { CustomSelect } from "@/components/shared/common/custom-select";
import { DeleteConfirmationModal } from "@/components/shared/modal/delete-confirmation-modal";
import {
  ACCOUNT_STATUS_FILTER,
  EXCHAGE_RATE_FILTER,
  HAS_SUBSCRIPTION_FILTER,
} from "@/constants/AppResource/status/filter-status";
import { DataTableWithPagination } from "@/components/shared/common/data-table";
import { showToast } from "@/components/shared/common/app-toast";
import { usePagination } from "@/redux/store/use-pagination";
import {
  setPageNo,
  setSearchFilter,
} from "@/redux/features/auth/store/slice/users-slice";
import { useBusinessState } from "@/redux/features/master-data/store/state/business-state";
import { BusinessResponseModel } from "@/redux/features/master-data/store/models/response/business-response";
import {
  deleteBusinessService,
  fetchAllBusinessService,
} from "@/redux/features/master-data/store/thunks/business-thunks";
import { businessTableColumns } from "@/redux/features/master-data/table/business-table";
import {
  setBusinessStatusFilter,
  setHasSubscriptionFilter,
} from "@/redux/features/master-data/store/slice/business-slice";
import { fi } from "date-fns/locale";
import { BusinessDetailModal } from "@/redux/features/master-data/components/business-detail-modal";
import BusinessModal from "@/redux/features/master-data/components/business-modal";
import { useExchangeRateState } from "@/redux/features/master-data/store/state/exchange-rate-state";
import { fetchAllExchangeRateService } from "@/redux/features/master-data/store/thunks/exchange-rate-thunks";
import { exchangeRateTableColumns } from "@/redux/features/master-data/table/exchange-rate-table";
import { ExchangeRateResponseModel } from "@/redux/features/master-data/store/models/response/exchange-rate-response";
import { setExchangeRateStatusFilter } from "@/redux/features/master-data/store/slice/exchage-rate-slice";

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
    baseRoute: ROUTES.DASHBOARD.BUSINESS,
    defaultPageSize: 15,
  });

  // Initialize URL and Redux state on mount
  useEffect(() => {
    const pageParam = searchParams.get("pageNo");
    const pageFromUrl = pageParam ? parseInt(pageParam, 10) : 1;

    if (pageFromUrl !== pagination.currentPage) {
      dispatch(setPageNo(pageFromUrl));
    }
  }, [searchParams, pagination.currentPage, dispatch]);

  // Fetch exchage rate when filters change
  useEffect(() => {
    dispatch(
      fetchAllExchangeRateService({
        search: debouncedSearch,
        pageNo: pagination.currentPage,
        isActive:
          filters.isActive === ExchangeRateStatus.ALL
            ? undefined
            : filters.isActive == ExchangeRateStatus.ACTIVE
            ? true
            : false,
      })
    );
  }, [dispatch, debouncedSearch, filters.isActive, pagination.currentPage]);

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

  const handleSubscriptionChange = (subscription: SubscriptionStatus) => {
    dispatch(setHasSubscriptionFilter(subscription));
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
          searchValue={filters.search}
          searchPlaceholder="Search exchange rate..."
          buttonIcon={<Plus className="w-3 h-3" />}
          buttonText="New Exchange Rate"
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
          getRowKey={(exchange) => exchange.id || exchange.usdToKhrRate}
          currentPage={pagination.currentPage}
          totalPages={pagination.totalPages}
          onPageChange={handlePageChangeWrapper}
        />
      </div>

      {/* Modals Add/Edit */}
      <BusinessModal
        isOpen={modalState.isOpen}
        onClose={closeModal}
        businessId={modalState.exchangeRateId}
        mode={modalState.mode}
      />

      {/* Modals business platform Detail */}
      <BusinessDetailModal
        businessId={detailModalState.exchangeRateId}
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
