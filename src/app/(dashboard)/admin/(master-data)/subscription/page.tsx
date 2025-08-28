"use client";

import { useState, useCallback, useEffect, useMemo } from "react";
import { useDebounce } from "@/utils/debounce/debounce";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { usePagination } from "@/hooks/use-pagination";
import { ROUTES } from "@/constants/AppRoutes/routes";
import { DeleteConfirmationDialog } from "@/components/shared/dialog/dialog-delete";
import { AppToast } from "@/components/shared/toast/app-toast";
import { CardHeaderSection } from "@/components/layout/card-header-section";
import { CustomSelect } from "@/components/shared/common/custom-select";
import { DataTable } from "@/components/shared/common/data-table";
import { CustomPagination } from "@/components/shared/common/custom-pagination";
import { ModalMode, Status } from "@/constants/AppResource/status/status";
import {
  AllSubscriptionResponse,
  SubscriptionModel,
} from "@/models/dashboard/master-data/subscription/subscription.response.model";
import {
  CancelSubscriptionRequest,
  RenewSubscriptionRequest,
  UpdateSubscriptionRequest,
} from "@/models/dashboard/master-data/subscription/subscription.request.model";
import {
  cancelSubscriptionService,
  deletedSubscriptionService,
  getAllSubscriptionService,
  renewSubscriptionService,
  updateSubscriptionService,
} from "@/services/dashboard/subscription/subscription.service";
import ModalSubscription from "@/components/shared/modal/subscription-modal";
import { RenewSubscriptionModal } from "@/components/shared/modal/subscription-renew-modal";
import { CancelSubscriptionModal } from "@/components/shared/modal/subscription-cancel-modal";
import { SubscriptionDetailModal } from "@/components/shared/modal/subscription-detail-modal";
import { createSubscriptionTableColumns } from "@/constants/AppResource/table/master-data/subscription-table";
import {
  AUTO_RENEW_FILTER,
  STATUS_FILTER,
  SUBSCRIPT_STATUS_FILTER,
} from "@/constants/AppResource/status/filter-status";

export default function SubscriptionPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [data, setData] = useState<AllSubscriptionResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Modal states - create/update
  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    subscriptionId: string;
    isSubmitting: boolean;
    error: string | null;
    mode: ModalMode;
  }>({
    isOpen: false,
    subscriptionId: "",
    isSubmitting: false,
    error: null,
    mode: ModalMode.CREATE_MODE,
  });

  // Detail modal state - following user pattern with ID only
  const [detailModalState, setDetailModalState] = useState<{
    isOpen: boolean;
    subscriptionId: string;
  }>({
    isOpen: false,
    subscriptionId: "",
  });

  // Renew modal state
  const [renewModalState, setRenewModalState] = useState<{
    isOpen: boolean;
    subscriptionId: string;
    isSubmitting: boolean;
  }>({
    isOpen: false,
    subscriptionId: "",
    isSubmitting: false,
  });

  // Cancel modal state
  const [cancelModalState, setCancelModalState] = useState<{
    isOpen: boolean;
    subscriptionId: string;
    isSubmitting: boolean;
  }>({
    isOpen: false,
    subscriptionId: "",
    isSubmitting: false,
  });

  // Delete modal state
  const [deleteState, setDeleteState] = useState<{
    isOpen: boolean;
    subscription: SubscriptionModel | null;
    isDeleting: boolean;
  }>({
    isOpen: false,
    subscription: null,
    isDeleting: false,
  });

  const [statusFilter, setStatusFilter] = useState<Status>(Status.ALL);
  const [autoRenewFilter, setAutoRenewFilter] = useState<Status>(Status.ALL);

  // Debounced search query
  const debouncedSearchQuery = useDebounce(searchQuery, 400);
  const searchParams = useSearchParams();

  const { currentPage, updateUrlWithPage, handlePageChange } = usePagination({
    baseRoute: ROUTES.DASHBOARD.SUBSCRIPTION,
    defaultPageSize: 10,
  });

  useEffect(() => {
    const pageParam = searchParams.get("pageNo");
    if (!pageParam) {
      updateUrlWithPage(1, true);
    }
  }, [searchParams, updateUrlWithPage]);

  // Load subscriptions
  const loadSubscriptions = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await getAllSubscriptionService({
        search: debouncedSearchQuery,
        pageNo: currentPage,
        isActive:
          statusFilter === Status.ALL
            ? undefined
            : statusFilter === Status.ACTIVE
            ? true
            : false,
        autoRenew:
          autoRenewFilter === Status.ALL
            ? undefined
            : autoRenewFilter === Status.ACTIVE
            ? true
            : false,
      });
      setData(response);
    } catch (error: any) {
      console.error("Failed to fetch subscriptions: ", error);
      toast.error("Failed to load subscriptions");
    } finally {
      setIsLoading(false);
    }
  }, [debouncedSearchQuery, currentPage, statusFilter, autoRenewFilter]);

  useEffect(() => {
    loadSubscriptions();
  }, [loadSubscriptions]);

  // Search change handler
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  // Handler functions for table actions
  const handleEditSubscription = useCallback(
    (subscription: SubscriptionModel) => {
      setModalState({
        isOpen: true,
        subscriptionId: subscription.id || "",
        isSubmitting: false,
        error: null,
        mode: ModalMode.UPDATE_MODE,
      });
    },
    []
  );

  const handleViewSubscriptionDetail = useCallback(
    (subscription: SubscriptionModel) => {
      setDetailModalState({
        isOpen: true,
        subscriptionId: subscription.id || "",
      });
    },
    []
  );

  const handleDeleteSubscription = useCallback(
    (subscription: SubscriptionModel) => {
      setDeleteState({
        isOpen: true,
        subscription: subscription,
        isDeleting: false,
      });
    },
    []
  );

  const handleRenewSubscription = useCallback(
    (subscription: SubscriptionModel) => {
      setRenewModalState({
        isOpen: true,
        subscriptionId: subscription.id || "",
        isSubmitting: false,
      });
    },
    []
  );

  const handleCancelSubscription = useCallback(
    (subscription: SubscriptionModel) => {
      setCancelModalState({
        isOpen: true,
        subscriptionId: subscription.id || "",
        isSubmitting: false,
      });
    },
    []
  );

  // Memoized table handlers
  const tableHandlers = useMemo(
    () => ({
      handleEditSubscription,
      handleViewSubscriptionDetail,
      handleDelete: handleDeleteSubscription,
      handleRenewSubscription,
      handleCancelSubscription,
    }),
    [
      handleEditSubscription,
      handleViewSubscriptionDetail,
      handleDeleteSubscription,
      handleRenewSubscription,
      handleCancelSubscription,
    ]
  );

  // Optimized table columns
  const columns = useMemo(
    () =>
      createSubscriptionTableColumns({
        data,
        handlers: tableHandlers,
      }),
    [data?.pageNo, data?.pageSize, data?.content?.length, tableHandlers]
  );

  // Close modals
  const closeModal = () => {
    setModalState((prev) => ({
      ...prev,
      isOpen: false,
      subscriptionId: "",
      error: null,
    }));
  };

  const closeDetailModal = () => {
    setDetailModalState({
      isOpen: false,
      subscriptionId: "",
    });
  };

  const closeRenewModal = () => {
    setRenewModalState({
      isOpen: false,
      subscriptionId: "",
      isSubmitting: false,
    });
  };

  const closeCancelModal = () => {
    setCancelModalState({
      isOpen: false,
      subscriptionId: "",
      isSubmitting: false,
    });
  };

  const closeDeleteModal = () => {
    setDeleteState({
      isOpen: false,
      subscription: null,
      isDeleting: false,
    });
  };

  // Handle form submission - update only (no create in this version)
  const handleSubmit = async (
    formData: UpdateSubscriptionRequest
  ): Promise<void> => {
    try {
      setModalState((prev) => ({
        ...prev,
        isSubmitting: true,
        error: null,
      }));

      if (!modalState.subscriptionId) {
        throw new Error("Subscription ID is required for update");
      }

      const response = await updateSubscriptionService(
        modalState.subscriptionId,
        formData
      );
      if (response) {
        setData((prev) =>
          prev
            ? {
                ...prev,
                content: prev.content.map((sub) =>
                  sub.id === modalState.subscriptionId ? response : sub
                ),
              }
            : prev
        );

        AppToast({
          type: "success",
          message: `Subscription updated successfully`,
          duration: 4000,
          position: "top-right",
        });

        closeModal();
      }
    } catch (error: any) {
      const errorMessage = error.message || "An unexpected error occurred";
      setModalState((prev) => ({
        ...prev,
        error: errorMessage,
      }));

      toast.error(errorMessage);
    } finally {
      setModalState((prev) => ({
        ...prev,
        isSubmitting: false,
      }));
    }
  };

  // Handle renew submission
  const handleSubmitRenew = async (renewData: RenewSubscriptionRequest) => {
    if (!renewModalState.subscriptionId) return;

    setRenewModalState((prev) => ({ ...prev, isSubmitting: true }));

    try {
      const response = await renewSubscriptionService(
        renewModalState.subscriptionId,
        renewData
      );

      if (response) {
        setData((prev) =>
          prev
            ? {
                ...prev,
                content: prev.content.map((sub) =>
                  sub.id === renewModalState.subscriptionId
                    ? response.subscription
                    : sub
                ),
              }
            : prev
        );

        AppToast({
          type: "success",
          message: `Subscription renewed successfully`,
          duration: 4000,
          position: "top-right",
        });

        closeRenewModal();
      }
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message || "Failed to renew subscription"
      );
    } finally {
      setRenewModalState((prev) => ({ ...prev, isSubmitting: false }));
    }
  };

  // Handle cancel submission
  const handleSubmitCancel = async (cancelData: CancelSubscriptionRequest) => {
    if (!cancelModalState.subscriptionId) return;

    setCancelModalState((prev) => ({ ...prev, isSubmitting: true }));

    try {
      const response = await cancelSubscriptionService(
        cancelModalState.subscriptionId,
        cancelData
      );

      if (response) {
        setData((prev) =>
          prev
            ? {
                ...prev,
                content: prev.content.map((sub) =>
                  sub.id === cancelModalState.subscriptionId
                    ? response.subscription
                    : sub
                ),
              }
            : prev
        );

        AppToast({
          type: "success",
          message: `Subscription cancelled successfully`,
          duration: 4000,
          position: "top-right",
        });

        closeCancelModal();
      }
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message || "Failed to cancel subscription"
      );
    } finally {
      setCancelModalState((prev) => ({ ...prev, isSubmitting: false }));
    }
  };

  // Handle delete
  const handleDelete = async () => {
    if (!deleteState.subscription?.id) return;

    setDeleteState((prev) => ({ ...prev, isDeleting: true }));

    try {
      const response = await deletedSubscriptionService(
        deleteState.subscription.id
      );

      if (response) {
        AppToast({
          type: "success",
          message: `Subscription "${deleteState.subscription.planName}" deleted successfully`,
        });

        // Check if we need to go back a page
        if (data && data.content.length === 1 && currentPage > 1) {
          updateUrlWithPage(currentPage - 1);
        } else {
          await loadSubscriptions();
        }
      }
    } catch (error) {
      console.error("Error deleting subscription:", error);
      toast.error("Failed to delete subscription");
    } finally {
      setDeleteState((prev) => ({ ...prev, isDeleting: false }));
      closeDeleteModal();
    }
  };

  return (
    <div className="flex flex-1 flex-col gap-4 px-2">
      <div className="space-y-4">
        <CardHeaderSection
          breadcrumbs={[
            { label: "Dashboard", href: ROUTES.DASHBOARD.INDEX },
            { label: "Subscription Management", href: "" },
          ]}
          title="Subscription Management"
          searchValue={searchQuery}
          searchPlaceholder="Search subscriptions..."
          onSearchChange={handleSearchChange}
          openModal={() => {
            setModalState({
              isOpen: true,
              subscriptionId: "",
              isSubmitting: false,
              error: null,
              mode: ModalMode.CREATE_MODE,
            });
          }}
        >
          <div className="flex flex-wrap items-center justify-between gap-4 w-full">
            <div className="flex items-center gap-3">
              <CustomSelect
                options={SUBSCRIPT_STATUS_FILTER}
                value={statusFilter}
                placeholder="Select Status"
                onValueChange={(value) => setStatusFilter(value as Status)}
              />
              <CustomSelect
                options={AUTO_RENEW_FILTER}
                value={autoRenewFilter}
                placeholder="Auto Renew"
                onValueChange={(value) => setAutoRenewFilter(value as Status)}
              />
            </div>
          </div>
        </CardHeaderSection>

        <div className="space-y-4">
          <DataTable
            data={data?.content || []}
            columns={columns}
            loading={isLoading}
            emptyMessage="No subscriptions found"
            getRowKey={(subscription) =>
              subscription.id?.toString() || subscription.planName
            }
          />

          {data && data.totalPages > 1 && (
            <CustomPagination
              currentPage={currentPage}
              totalPages={data.totalPages}
              onPageChange={handlePageChange}
              size="md"
            />
          )}
        </div>
      </div>

      {/* Edit Modal */}
      <ModalSubscription
        isOpen={modalState.isOpen}
        onClose={closeModal}
        isSubmitting={modalState.isSubmitting}
        onSave={handleSubmit}
        subscriptionId={modalState.subscriptionId}
        error={modalState.error}
      />

      {/* Detail Modal */}
      <SubscriptionDetailModal
        isOpen={detailModalState.isOpen}
        onClose={closeDetailModal}
        subscriptionId={detailModalState.subscriptionId}
      />

      {/* Renew Modal */}
      <RenewSubscriptionModal
        open={renewModalState.isOpen}
        onOpenChange={closeRenewModal}
        onSubmit={handleSubmitRenew}
        subscriptionId={renewModalState.subscriptionId}
        isSubmitting={renewModalState.isSubmitting}
      />

      {/* Cancel Modal */}
      <CancelSubscriptionModal
        open={cancelModalState.isOpen}
        onOpenChange={closeCancelModal}
        onSubmit={handleSubmitCancel}
        subscriptionId={cancelModalState.subscriptionId}
        isSubmitting={cancelModalState.isSubmitting}
      />

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmationDialog
        isOpen={deleteState.isOpen}
        onClose={closeDeleteModal}
        onDelete={handleDelete}
        title="Delete Subscription"
        description="Are you sure you want to delete this subscription?"
        itemName={
          deleteState.subscription?.planName ||
          deleteState.subscription?.businessName ||
          "---"
        }
        isSubmitting={deleteState.isDeleting}
      />
    </div>
  );
}
