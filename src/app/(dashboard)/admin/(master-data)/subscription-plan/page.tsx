"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Plus } from "lucide-react";
import { useDebounce } from "@/utils/debounce/debounce";
import { ROUTES } from "@/constants/app-routes/routes";
import {
  ModalMode,
  SubscriptionPlanStatus,
} from "@/constants/app-resource/status/status";
import { CardHeaderSection } from "@/components/layout/card-header-section";
import { CustomSelect } from "@/components/shared/common/custom-select";
import { DeleteConfirmationModal } from "@/components/shared/modal/delete-confirmation-modal";
import { SUBSCRIPTION_PLAN_FILTER } from "@/constants/app-resource/status/filter-status";
import { DataTableWithPagination } from "@/components/shared/common/data-table";
import { showToast } from "@/components/shared/common/show-toast";
import { usePagination } from "@/redux/store/use-pagination";
import {
  setPageNo,
  setSearchFilter,
} from "@/redux/features/auth/store/slice/users-slice";
import { useSubscriptionPlanState } from "@/redux/features/master-data/store/state/subscription-plan-state";
import {
  deleteSubscriptionPlanService,
  fetchAllSubscriptionPlanService,
} from "@/redux/features/master-data/store/thunks/subscription-plan-thunks";
import { subscriptionPlanTableColumns } from "@/redux/features/master-data/table/subscription-plan-table";
import { SubscriptionPlanResponseModel } from "@/redux/features/master-data/store/models/response/subscription-plan-response";
import { setSubscriptionPlanStatusFilter } from "@/redux/features/master-data/store/slice/subscription-plan-slice";
import SubscriptionPlanModal from "@/redux/features/master-data/components/subscription-plan-modal";
import { SubscriptionPlanDetailModal } from "@/redux/features/master-data/components/subscription-plan-detail-modal";

export default function SubscriptionPlanPage() {
  const searchParams = useSearchParams();

  // Redux state
  const {
    subscriptionPlanState,
    subscriptionPlanData,
    subscriptionPlanContent,
    isLoading,
    filters,
    operations,
    pagination,
    dispatch,
  } = useSubscriptionPlanState();

  // Local UI state for modals only
  const [modalState, setModalState] = useState({
    isOpen: false,
    mode: ModalMode.CREATE_MODE,
    planId: "",
  });

  const [detailModalState, setDetailModalState] = useState({
    isOpen: false,
    planId: "",
  });

  const [deleteState, setDeleteState] = useState({
    isOpen: false,
    business: null as SubscriptionPlanResponseModel | null,
  });

  const debouncedSearch = useDebounce(filters.search, 400);

  const { updateUrlWithPage, handlePageChange } = usePagination({
    baseRoute: ROUTES.DASHBOARD.SUBSCRIPTION_PLAN,
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

  // Fetch Subscription Plan when filters change
  useEffect(() => {
    dispatch(
      fetchAllSubscriptionPlanService({
        search: debouncedSearch,
        pageNo: filters.pageNo,
        statuses:
          filters.statuses === SubscriptionPlanStatus.ALL
            ? []
            : [filters.statuses],
      })
    );
  }, [dispatch, debouncedSearch, filters.statuses, filters.pageNo]);

  // Event handlers
  const handleCreatePlan = () => {
    setModalState({
      isOpen: true,
      mode: ModalMode.CREATE_MODE,
      planId: "",
    });
  };

  const handleEditPlan = (plan: SubscriptionPlanResponseModel) => {
    setModalState({
      isOpen: true,
      mode: ModalMode.UPDATE_MODE,
      planId: plan?.id || "",
    });
  };

  const handlePlanViewDetail = (plan: SubscriptionPlanResponseModel) => {
    setDetailModalState({
      isOpen: true,
      planId: plan.id || "",
    });
  };

  const handleDeletePlan = (plan: SubscriptionPlanResponseModel) => {
    setDeleteState({
      isOpen: true,
      business: plan,
    });
  };

  const tableHandlers = useMemo(
    () => ({
      handleEditPlan,
      handlePlanViewDetail,
      handleDeletePlan,
    }),
    []
  );

  const columns = useMemo(
    () =>
      subscriptionPlanTableColumns({
        data: subscriptionPlanData,
        handlers: tableHandlers,
      }),
    [subscriptionPlanState, tableHandlers]
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setSearchFilter(e.target.value));
  };

  const handleStatusChange = (status: SubscriptionPlanStatus) => {
    dispatch(setSubscriptionPlanStatusFilter(status));
  };

  const handlePageChangeWrapper = (page: number) => {
    dispatch(setPageNo(page));
    handlePageChange(page);
  };

  const handleDelete = async () => {
    if (!deleteState.business?.id) return;

    try {
      await dispatch(
        deleteSubscriptionPlanService(deleteState.business.id)
      ).unwrap();

      showToast.success(
        `Subscription Plan "${
          deleteState.business.name ?? ""
        }" deleted successfully`
      );

      closeDeleteModal();

      // Navigate to previous page if this was the last item
      if (subscriptionPlanContent.length === 1 && pagination.currentPage > 1) {
        const newPage = pagination.currentPage - 1;
        dispatch(setPageNo(newPage));
        updateUrlWithPage(newPage);
      }
    } catch (error: any) {
      showToast.error(error || "Failed to delete Subscription Plan");
    }
  };

  const closeModal = () => {
    setModalState({
      isOpen: false,
      mode: ModalMode.CREATE_MODE,
      planId: "",
    });
  };

  const closeDetailModal = () => {
    setDetailModalState({
      isOpen: false,
      planId: "",
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
            { label: "Subscription Plan", href: "" },
          ]}
          title="Subscription Plan"
          searchValue={filters.search}
          searchPlaceholder="Search subscription plan..."
          buttonIcon={<Plus className="w-3 h-3" />}
          buttonText="New"
          onSearchChange={handleSearchChange}
          openModal={handleCreatePlan}
        >
          <div className="flex items-center gap-3">
            <CustomSelect
              options={SUBSCRIPTION_PLAN_FILTER}
              value={filters.statuses}
              placeholder="All Status"
              onValueChange={(value) =>
                handleStatusChange(value as SubscriptionPlanStatus)
              }
              label="Subscription Plan Status"
            />
          </div>
        </CardHeaderSection>

        {/* Data Table with Pagination */}
        <DataTableWithPagination
          data={subscriptionPlanContent}
          columns={columns}
          loading={isLoading}
          emptyMessage="No Subscription Plan found"
          getRowKey={(plan) => plan.id}
          currentPage={filters.pageNo}
          totalPages={pagination.totalPages}
          onPageChange={handlePageChangeWrapper}
        />
      </div>

      {/* Modals Add/Edit */}
      <SubscriptionPlanModal
        isOpen={modalState.isOpen}
        onClose={closeModal}
        planId={modalState.planId}
        mode={modalState.mode}
      />

      {/* Modals Subscription Plan platform Detail */}
      <SubscriptionPlanDetailModal
        planId={detailModalState.planId}
        isOpen={detailModalState.isOpen}
        onClose={closeDetailModal}
      />

      {/* Modals Delete Subscription Plan */}
      <DeleteConfirmationModal
        isOpen={deleteState.isOpen}
        onClose={closeDeleteModal}
        onDelete={handleDelete}
        title="Delete Subscription Plan"
        description={`Are you sure you want to delete this subscription plan ${
          deleteState.business?.name || ""
        }?`}
        itemName={deleteState.business?.name || ""}
        isSubmitting={operations.isDeleting}
      />
    </div>
  );
}
