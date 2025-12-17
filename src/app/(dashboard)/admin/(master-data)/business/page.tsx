"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Plus } from "lucide-react";
import { useDebounce } from "@/utils/debounce/debounce";
import { ROUTES } from "@/constants/app-routes/routes";
import {
  AccountStatus,
  ModalMode,
  BusinessStatus,
  SubscriptionStatus,
} from "@/constants/app-resource/status/status";
import { CardHeaderSection } from "@/components/layout/card-header-section";
import { CustomSelect } from "@/components/shared/common/custom-select";
import { DeleteConfirmationModal } from "@/components/shared/modal/delete-confirmation-modal";
import {
  ACCOUNT_STATUS_FILTER,
  HAS_SUBSCRIPTION_FILTER,
} from "@/constants/app-resource/status/filter-status";
import { DataTableWithPagination } from "@/components/shared/common/data-table";
import { showToast } from "@/components/shared/common/show-toast";
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
import { BusinessDetailModal } from "@/redux/features/master-data/components/business-detail-modal";
import BusinessModal from "@/redux/features/master-data/components/business-modal";

export default function BusinessPage() {
  const searchParams = useSearchParams();

  // Redux state
  const {
    businessState,
    businessData,
    businessContent,
    isLoading,
    filters,
    operations,
    pagination,
    dispatch,
  } = useBusinessState();

  // Local UI state for modals only
  const [modalState, setModalState] = useState({
    isOpen: false,
    mode: ModalMode.CREATE_MODE,
    businessId: "",
  });

  const [detailModalState, setDetailModalState] = useState({
    isOpen: false,
    businessId: "",
  });

  const [deleteState, setDeleteState] = useState({
    isOpen: false,
    business: null as BusinessResponseModel | null,
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
  }, [searchParams, filters.pageNo, dispatch]);

  // Fetch business when filters change
  useEffect(() => {
    dispatch(
      fetchAllBusinessService({
        search: debouncedSearch,
        pageNo: filters.pageNo,
        hasActiveSubscription:
          filters.hasActiveSubscription === SubscriptionStatus.ALL
            ? undefined
            : filters.hasActiveSubscription == SubscriptionStatus.SUBSCRIBED
            ? true
            : false,
        status:
          filters.businessStatus === AccountStatus.ALL
            ? []
            : [filters.businessStatus],
      })
    );
  }, [
    dispatch,
    debouncedSearch,
    filters.businessStatus,
    filters.hasActiveSubscription,
    filters.pageNo,
  ]);

  // Event handlers
  const handleCreateUser = () => {
    setModalState({
      isOpen: true,
      mode: ModalMode.CREATE_MODE,
      businessId: "",
    });
  };

  const handleEditBusiness = (business: BusinessResponseModel) => {
    setModalState({
      isOpen: true,
      mode: ModalMode.UPDATE_MODE,
      businessId: business?.id || "",
    });
  };

  const handleBusinessViewDetail = (business: BusinessResponseModel) => {
    setDetailModalState({
      isOpen: true,
      businessId: business.id || "",
    });
  };

  const handleDeleteBusiness = (business: BusinessResponseModel) => {
    setDeleteState({
      isOpen: true,
      business: business,
    });
  };

  const tableHandlers = useMemo(
    () => ({
      handleEditBusiness,
      handleBusinessViewDetail,
      handleDeleteBusiness,
    }),
    []
  );

  const columns = useMemo(
    () =>
      businessTableColumns({
        data: businessData,
        handlers: tableHandlers,
      }),
    [businessState, tableHandlers]
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setSearchFilter(e.target.value));
  };

  const handleStatusChange = (status: BusinessStatus) => {
    dispatch(setBusinessStatusFilter(status));
  };

  const handleSubscriptionChange = (subscription: SubscriptionStatus) => {
    dispatch(setHasSubscriptionFilter(subscription));
  };

  const handlePageChangeWrapper = (page: number) => {
    dispatch(setPageNo(page));
    handlePageChange(page);
  };

  const handleDelete = async () => {
    if (!deleteState.business?.id) return;

    try {
      await dispatch(deleteBusinessService(deleteState.business.id)).unwrap();

      showToast.success(
        `Business "${deleteState.business.name ?? ""}" deleted successfully`
      );

      closeDeleteModal();

      // Navigate to previous page if this was the last item
      if (businessContent.length === 1 && pagination.currentPage > 1) {
        const newPage = pagination.currentPage - 1;
        dispatch(setPageNo(newPage));
        updateUrlWithPage(newPage);
      }
    } catch (error: any) {
      showToast.error(error || "Failed to delete business");
    }
  };

  const closeModal = () => {
    setModalState({
      isOpen: false,
      mode: ModalMode.CREATE_MODE,
      businessId: "",
    });
  };

  const closeDetailModal = () => {
    setDetailModalState({
      isOpen: false,
      businessId: "",
    });
  };

  const closeDeleteModal = () => {
    setDeleteState({
      isOpen: false,
      business: null,
    });
  };

  return (
    <div className="flex flex-1 flex-col gap-4 px-2">
      <div className="space-y-4">
        <CardHeaderSection
          breadcrumbs={[
            { label: "Dashboard", href: ROUTES.DASHBOARD.INDEX },
            { label: "Business", href: "" },
          ]}
          title="Business"
          buttonTooltip="Create a new Business"
          searchValue={filters.search}
          searchPlaceholder="Search business..."
          buttonIcon={<Plus className="w-3 h-3" />}
          buttonText="New"
          onSearchChange={handleSearchChange}
          openModal={handleCreateUser}
        >
          <div className="flex items-center gap-3">
            <CustomSelect
              options={ACCOUNT_STATUS_FILTER}
              value={filters.businessStatus}
              placeholder="All Status"
              onValueChange={(value) =>
                handleStatusChange(value as BusinessStatus)
              }
              label="Account Status"
            />
            <CustomSelect
              options={HAS_SUBSCRIPTION_FILTER}
              value={filters.hasActiveSubscription}
              placeholder="All Subscription"
              onValueChange={(value) =>
                handleSubscriptionChange(value as SubscriptionStatus)
              }
              label="Subscription Status"
            />
          </div>
        </CardHeaderSection>

        {/* Data Table with Pagination */}
        <DataTableWithPagination
          data={businessContent}
          columns={columns}
          loading={isLoading}
          emptyMessage="No business found"
          getRowKey={(business) => business.id}
          currentPage={filters.pageNo}
          totalPages={pagination.totalPages}
          onPageChange={handlePageChangeWrapper}
        />
      </div>

      {/* Modals Add/Edit */}
      <BusinessModal
        isOpen={modalState.isOpen}
        onClose={closeModal}
        businessId={modalState.businessId}
        mode={modalState.mode}
      />

      {/* Modals business platform Detail */}
      <BusinessDetailModal
        businessId={detailModalState.businessId}
        isOpen={detailModalState.isOpen}
        onClose={closeDetailModal}
      />

      {/* Modals Delete name platform */}
      <DeleteConfirmationModal
        isOpen={deleteState.isOpen}
        onClose={closeDeleteModal}
        onDelete={handleDelete}
        title="Delete Business"
        description={`Are you sure you want to delete this business ${
          deleteState.business?.name || deleteState.business?.email
        }?`}
        itemName={deleteState.business?.name || deleteState.business?.email}
        isSubmitting={operations.isDeleting}
      />
    </div>
  );
}
