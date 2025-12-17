"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Plus } from "lucide-react";
import { useDebounce } from "@/utils/debounce/debounce";
import { ROUTES } from "@/constants/app-routes/routes";
import {
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
import { useSubscriptionState } from "@/redux/features/master-data/store/state/subscription-state";
import { SubscriptionResponseModel } from "@/redux/features/master-data/store/models/response/subscription-response";
import {
  setPageNo,
  setSearchFilter,
} from "@/redux/features/master-data/store/slice/subscription-slice";
import {
  deleteSubscriptionService,
  fetchAllSubscriptionService,
} from "@/redux/features/master-data/store/thunks/subscription-thunks";
import { subscriptionTableColumns } from "@/redux/features/master-data/table/subscription-table";
import { SubscriptionDetailModal } from "@/redux/features/master-data/components/subscription-detail-modal";
import SubscriptionModal from "@/redux/features/master-data/components/subscription-modal";

export default function SubscriptionPage() {
  const searchParams = useSearchParams();

  // Redux state
  const {
    subscriptionState,
    subscriptionData,
    subscriptionContent,
    isLoading,
    filters,
    operations,
    pagination,
    dispatch,
  } = useSubscriptionState();

  // Local UI state for modals only
  const [modalState, setModalState] = useState({
    isOpen: false,
    mode: ModalMode.CREATE_MODE,
    subscriptionId: "",
  });

  const [detailModalState, setDetailModalState] = useState({
    isOpen: false,
    subscriptionId: "",
  });

  const [deleteState, setDeleteState] = useState({
    isOpen: false,
    subscription: null as SubscriptionResponseModel | null,
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
      fetchAllSubscriptionService({
        search: debouncedSearch,
        pageNo: filters.pageNo,
      })
    );
  }, [dispatch, debouncedSearch, filters.pageNo]);

  // Event handlers
  const handleCreateSubscription = () => {
    setModalState({
      isOpen: true,
      mode: ModalMode.CREATE_MODE,
      subscriptionId: "",
    });
  };

  const handleEditSubscription = (subscription: SubscriptionResponseModel) => {
    setModalState({
      isOpen: true,
      mode: ModalMode.UPDATE_MODE,
      subscriptionId: subscription?.id || "",
    });
  };

  const handleSubscriptionViewDetail = (
    subscription: SubscriptionResponseModel
  ) => {
    setDetailModalState({
      isOpen: true,
      subscriptionId: subscription.id || "",
    });
  };

  const handleDeleteSubscription = (
    subscription: SubscriptionResponseModel
  ) => {
    setDeleteState({
      isOpen: true,
      subscription: subscription,
    });
  };

  const tableHandlers = useMemo(
    () => ({
      handleEditSubscription,
      handleSubscriptionViewDetail,
      handleDeleteSubscription,
    }),
    []
  );

  const columns = useMemo(
    () =>
      subscriptionTableColumns({
        data: subscriptionData,
        handlers: tableHandlers,
      }),
    [subscriptionState, tableHandlers]
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setSearchFilter(e.target.value));
  };

  const handlePageChangeWrapper = (page: number) => {
    dispatch(setPageNo(page));
    handlePageChange(page);
  };

  const handleDelete = async () => {
    if (!deleteState.subscription?.id) return;

    try {
      await dispatch(
        deleteSubscriptionService(deleteState.subscription.id)
      ).unwrap();

      showToast.success(
        `Subscription "${
          deleteState.subscription.businessName ?? ""
        }" deleted successfully`
      );

      closeDeleteModal();

      // Navigate to previous page if this was the last item
      if (subscriptionContent.length === 1 && pagination.currentPage > 1) {
        const newPage = pagination.currentPage - 1;
        dispatch(setPageNo(newPage));
        updateUrlWithPage(newPage);
      }
    } catch (error: any) {
      showToast.error(error || "Failed to delete subscription");
    }
  };

  const closeModal = () => {
    setModalState({
      isOpen: false,
      mode: ModalMode.CREATE_MODE,
      subscriptionId: "",
    });
  };

  const closeDetailModal = () => {
    setDetailModalState({
      isOpen: false,
      subscriptionId: "",
    });
  };

  const closeDeleteModal = () => {
    setDeleteState({
      isOpen: false,
      subscription: null,
    });
  };

  return (
    <div className="flex flex-1 flex-col gap-4 px-2">
      <div className="space-y-4">
        <CardHeaderSection
          breadcrumbs={[
            { label: "Dashboard", href: ROUTES.DASHBOARD.INDEX },
            { label: "Subscription", href: "" },
          ]}
          title="Subscription"
          searchValue={filters.search}
          searchPlaceholder="Search subscription..."
          buttonIcon={<Plus className="w-3 h-3" />}
          buttonText="New"
          onSearchChange={handleSearchChange}
          openModal={handleCreateSubscription}
        ></CardHeaderSection>

        {/* Data Table with Pagination */}
        <DataTableWithPagination
          data={subscriptionContent}
          columns={columns}
          loading={isLoading}
          emptyMessage="No subscription found"
          getRowKey={(subscription) => subscription.id}
          currentPage={pagination.currentPage}
          totalPages={pagination.totalPages}
          onPageChange={handlePageChangeWrapper}
        />
      </div>

      {/* Modals Add/Edit */}
      <SubscriptionModal
        isOpen={modalState.isOpen}
        onClose={closeModal}
        subscriptionId={modalState.subscriptionId}
        mode={modalState.mode}
      />

      {/* Modals subscription platform Detail */}
      <SubscriptionDetailModal
        subscriptionId={detailModalState.subscriptionId}
        isOpen={detailModalState.isOpen}
        onClose={closeDetailModal}
      />

      {/* Modals Delete name platform */}
      <DeleteConfirmationModal
        isOpen={deleteState.isOpen}
        onClose={closeDeleteModal}
        onDelete={handleDelete}
        title="Delete subscription"
        description={`Are you sure you want to delete this subscription ${
          deleteState.subscription?.businessName ||
          deleteState.subscription?.planName
        }?`}
        itemName={
          deleteState.subscription?.businessName ||
          deleteState.subscription?.planName
        }
        isSubmitting={operations.isDeleting}
      />
    </div>
  );
}
