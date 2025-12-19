// src/app/(dashboard)/admin/business-owner/page.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Plus } from "lucide-react";
import { useDebounce } from "@/utils/debounce/debounce";
import { ROUTES } from "@/constants/app-routes/routes";
import {
  ModalMode,
  SubscriptionStatus,
} from "@/constants/app-resource/status/status";
import { CardHeaderSection } from "@/components/layout/card-header-section";
import { CustomSelect } from "@/components/shared/common/custom-select";
import { DeleteConfirmationModal } from "@/components/shared/modal/delete-confirmation-modal";
import UserBusinessModal from "@/redux/features/auth/components/user-business-modal";
import { UserBusinessDetailModal } from "@/redux/features/auth/components/user-business-detail-modal";
import { usePagination } from "@/redux/store/use-pagination";
import { showToast } from "@/components/shared/common/show-toast";
import { SUBSCRIPTION_FILTER } from "@/constants/app-resource/status/filter-status";
import { DataTableWithPagination } from "@/components/shared/common/data-table";
import { useBusinessOwnerState } from "@/redux/features/auth/store/state/business-owner-state";
import { BusinessOwnerResponseModel } from "@/redux/features/auth/store/models/response/business-owner-response";
import {
  setPageNo,
  setSearchFilter,
  setSubscriptionStatusFilter,
} from "@/redux/features/auth/store/slice/business-owner-slice";
import {
  deleteBusinessOwnerService,
  fetchAllBusinessOwnerService,
} from "@/redux/features/auth/store/thunks/business-owner-thunks";
import { userBusinessOwnerTableColumns } from "@/redux/features/auth/table/business-owner-table";
import CreateSubscriptionModal from "@/redux/features/auth/components/create-business-owner-modal";
import RenewSubscriptionModal from "@/redux/features/auth/components/renew-subscription-modal";
import CancelSubscriptionModal from "@/redux/features/auth/components/cancel-subscription-modal";
import ChangePlanModal from "@/redux/features/auth/components/change-plan-modal";
import { BusinessOwnerDetailModal } from "@/redux/features/auth/components/business-owner-detail-modal";

export default function BusinessUserMonitorPage() {
  const searchParams = useSearchParams();

  // Redux state
  const {
    businessOwnerState,
    businessOwnerData,
    businessOwnerContent,
    isLoading,
    filters,
    operations,
    pagination,
    dispatch,
  } = useBusinessOwnerState();

  // Local UI state for modals
  const [modalState, setModalState] = useState({
    isOpen: false,
    mode: ModalMode.CREATE_MODE,
    ownerId: "",
  });

  const [detailModalState, setDetailModalState] = useState({
    isOpen: false,
    ownerId: "",
  });

  const [deleteState, setDeleteState] = useState({
    isOpen: false,
    owner: null as BusinessOwnerResponseModel | null,
  });

  // Subscription modal states
  const [createSubscriptionState, setCreateSubscriptionState] = useState({
    isOpen: false,
  });

  const [renewSubscriptionState, setRenewSubscriptionState] = useState({
    isOpen: false,
    ownerId: "",
    ownerName: "",
  });

  const [cancelSubscriptionState, setCancelSubscriptionState] = useState({
    isOpen: false,
    ownerId: "",
    ownerName: "",
  });

  const [changePlanState, setChangePlanState] = useState({
    isOpen: false,
    ownerId: "",
    ownerName: "",
  });

  const debouncedSearch = useDebounce(filters.search, 400);

  const { updateUrlWithPage, handlePageChange } = usePagination({
    baseRoute: ROUTES.DASHBOARD.BUSINESS_OWNER,
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

  // Fetch business Owner when filters change
  useEffect(() => {
    dispatch(
      fetchAllBusinessOwnerService({
        search: debouncedSearch,
        pageNo: filters.pageNo,
        subscriptionStatuses:
          filters.subscriptionStatus === SubscriptionStatus.ALL
            ? []
            : [filters.subscriptionStatus],
      })
    );
  }, [dispatch, debouncedSearch, filters.subscriptionStatus, filters.pageNo]);

  const handleViewUserDetail = (user: BusinessOwnerResponseModel) => {
    setDetailModalState({
      isOpen: true,
      ownerId: user.ownerId || "",
    });
  };

  const handleDeleteUser = (user: BusinessOwnerResponseModel) => {
    setDeleteState({
      isOpen: true,
      owner: user,
    });
  };

  // Subscription handlers
  const handleCreateSubscription = () => {
    setCreateSubscriptionState({
      isOpen: true,
    });
  };

  const handleRenewSubscription = (
    businessOwner: BusinessOwnerResponseModel
  ) => {
    setRenewSubscriptionState({
      isOpen: true,
      ownerId: businessOwner.ownerId || "",
      ownerName: businessOwner.ownerFullName || "",
    });
  };

  const handleCancelSubscription = (
    businessOwner: BusinessOwnerResponseModel
  ) => {
    setCancelSubscriptionState({
      isOpen: true,
      ownerId: businessOwner.ownerId || "",
      ownerName: businessOwner.ownerFullName || "",
    });
  };

  const handleChangePlan = (businessOwner: BusinessOwnerResponseModel) => {
    setChangePlanState({
      isOpen: true,
      ownerId: businessOwner.ownerId || "",
      ownerName: businessOwner.ownerFullName || "",
    });
  };

  const tableHandlers = useMemo(
    () => ({
      handleViewUserDetail,
      handleDeleteUser,
      handleRenewSubscription,
      handleCancelSubscription,
      handleChangePlan,
    }),
    []
  );

  const columns = useMemo(
    () =>
      userBusinessOwnerTableColumns({
        data: businessOwnerData,
        handlers: tableHandlers,
      }),
    [businessOwnerData, tableHandlers]
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setSearchFilter(e.target.value));
  };

  const handleSubscriptedStatusChange = (status: SubscriptionStatus) => {
    dispatch(setSubscriptionStatusFilter(status));
  };

  const handlePageChangeWrapper = (page: number) => {
    dispatch(setPageNo(page));
    handlePageChange(page);
  };

  const handleDelete = async () => {
    if (!deleteState.owner?.id) return;

    try {
      await dispatch(deleteBusinessOwnerService(deleteState.owner.id)).unwrap();

      showToast.success(
        `User business "${
          deleteState.owner.ownerFullName ?? ""
        }" deleted successfully`
      );

      closeDeleteModal();

      // Navigate to previous page if this was the last item
      if (businessOwnerContent.length === 1 && pagination.currentPage > 1) {
        const newPage = pagination.currentPage - 1;
        dispatch(setPageNo(newPage));
        updateUrlWithPage(newPage);
      }
    } catch (error: any) {
      showToast.error(error || "Failed to delete user business");
    }
  };

  // Close modal handlers - NO REFETCHING, state is already updated!
  const closeModal = () => {
    setModalState({
      isOpen: false,
      mode: ModalMode.CREATE_MODE,
      ownerId: "",
    });
  };

  const closeDetailModal = () => {
    setDetailModalState({
      isOpen: false,
      ownerId: "",
    });
  };

  const closeDeleteModal = () => {
    setDeleteState({
      isOpen: false,
      owner: null,
    });
  };

  const closeCreateSubscriptionModal = () => {
    setCreateSubscriptionState({
      isOpen: false,
    });
  };

  const closeRenewSubscriptionModal = () => {
    setRenewSubscriptionState({
      isOpen: false,
      ownerId: "",
      ownerName: "",
    });
  };

  const closeCancelSubscriptionModal = () => {
    setCancelSubscriptionState({
      isOpen: false,
      ownerId: "",
      ownerName: "",
    });
  };

  const closeChangePlanModal = () => {
    setChangePlanState({
      isOpen: false,
      ownerId: "",
      ownerName: "",
    });
  };

  return (
    <div className="flex flex-1 flex-col gap-4 px-2">
      <div className="space-y-4">
        <CardHeaderSection
          breadcrumbs={[
            { label: "Dashboard", href: ROUTES.DASHBOARD.INDEX },
            { label: "Business Users", href: "" },
          ]}
          title="Business Owner"
          searchValue={filters.search}
          searchPlaceholder="Search business owners..."
          buttonTooltip="Create a new busines owner"
          buttonIcon={<Plus className="w-3 h-3" />}
          buttonText="New"
          onSearchChange={handleSearchChange}
          openModal={handleCreateSubscription}
        >
          <div className="flex items-center gap-3">
            <CustomSelect
              options={SUBSCRIPTION_FILTER}
              value={filters.subscriptionStatus}
              placeholder="All Status"
              onValueChange={(value) =>
                handleSubscriptedStatusChange(value as SubscriptionStatus)
              }
              label="Subscription Status"
            />
          </div>
        </CardHeaderSection>

        {/* Data Table */}
        <DataTableWithPagination
          data={businessOwnerContent}
          columns={columns}
          loading={isLoading}
          emptyMessage="No business owners found"
          getRowKey={(user) => user.id}
          currentPage={filters.pageNo}
          totalPages={pagination.totalPages}
          onPageChange={handlePageChangeWrapper}
        />
      </div>

      {/* User Modals */}
      <CreateSubscriptionModal
        isOpen={modalState.isOpen}
        onClose={closeModal}
      />

      <BusinessOwnerDetailModal
        businessOwnerId={detailModalState.ownerId}
        isOpen={detailModalState.isOpen}
        onClose={closeDetailModal}
      />

      <DeleteConfirmationModal
        isOpen={deleteState.isOpen}
        onClose={closeDeleteModal}
        onDelete={handleDelete}
        title="Delete User"
        description={`Are you sure you want to delete this user ${
          deleteState.owner?.ownerFullName ||
          deleteState.owner?.ownerUserIdentifier
        }?`}
        itemName={
          deleteState.owner?.ownerFullName ||
          deleteState.owner?.ownerUserIdentifier
        }
        isSubmitting={operations.isDeleting}
      />

      {/* Subscription Modals */}
      <CreateSubscriptionModal
        isOpen={createSubscriptionState.isOpen}
        onClose={closeCreateSubscriptionModal}
      />

      <RenewSubscriptionModal
        isOpen={renewSubscriptionState.isOpen}
        onClose={closeRenewSubscriptionModal}
        ownerId={renewSubscriptionState.ownerId}
        ownerName={renewSubscriptionState.ownerName}
      />

      <CancelSubscriptionModal
        isOpen={cancelSubscriptionState.isOpen}
        onClose={closeCancelSubscriptionModal}
        ownerId={cancelSubscriptionState.ownerId}
        ownerName={cancelSubscriptionState.ownerName}
      />

      <ChangePlanModal
        isOpen={changePlanState.isOpen}
        onClose={closeChangePlanModal}
        ownerId={changePlanState.ownerId}
        ownerName={changePlanState.ownerName}
      />
    </div>
  );
}
