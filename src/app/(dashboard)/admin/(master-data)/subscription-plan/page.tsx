"use client";

import { useState, useCallback, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  SUBSCRIPTION_PLAN_OPTIONS,
  subscriptionOptions,
  SubscriptionPlanStatus,
  ModalMode,
} from "@/constants/AppResource/status/status";
import { useDebounce } from "@/utils/debounce/debounce";
import { Plus } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { usePagination } from "@/hooks/use-pagination";
import { ROUTES } from "@/constants/AppRoutes/routes";
import { DeleteConfirmationDialog } from "@/components/shared/dialog/dialog-delete";
import { AppToast } from "@/components/shared/toast/app-toast";
import { CardHeaderSection } from "@/components/layout/card-header-section";
import {
  AllSubscriptionPlan,
  SubscriptionPlanModel,
} from "@/models/dashboard/master-data/subscription-plan/subscription-plan-response";
import { SubscriptionPlanFormData } from "@/models/dashboard/master-data/subscription-plan/subscription-plan.schema";
import {
  createSubscriptionService,
  deletedSubscriptionPlanService,
  getAllSubscriptionPlanService,
  updateSubscriptionPlanService,
} from "@/services/dashboard/master-data/subscrion-plan/subscription-plan.service";
import ModalSubscriptionPlan from "@/components/shared/modal/subscription-plan-modal";
import { createSubscriptionPlanTableColumns } from "@/constants/AppResource/table/master-data/subscription-plan-table";
import { CustomSelect } from "@/components/shared/common/custom-select";
import { SubscriptionPlanDetailModal } from "@/components/dashboard/master-data/subscription-plan/subscription-plan-detail-modal";
import { CustomPagination } from "@/components/shared/common/custom-pagination";
import { DataTable } from "@/components/shared/common/data-table";

export default function SubscriptionPlanPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [data, setData] = useState<AllSubscriptionPlan | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Modal states
  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    mode: ModalMode;
    data: SubscriptionPlanFormData | null;
    isSubmitting: boolean;
    error: string | null;
  }>({
    isOpen: false,
    mode: ModalMode.CREATE_MODE,
    data: null,
    isSubmitting: false,
    error: null,
  });

  // Detail modal state
  const [detailModalState, setDetailModalState] = useState<{
    isOpen: boolean;
    plan: SubscriptionPlanModel | null;
  }>({
    isOpen: false,
    plan: null,
  });

  // Delete modal state
  const [deleteState, setDeleteState] = useState<{
    isOpen: boolean;
    plan: SubscriptionPlanModel | null;
    isDeleting: boolean;
  }>({
    isOpen: false,
    plan: null,
    isDeleting: false,
  });

  // Filter states
  const [statusFilter, setStatusFilter] = useState<
    SubscriptionPlanStatus | undefined
  >(undefined);
  const [hasSubscription, setHasSubscription] = useState<boolean | undefined>(
    undefined
  );
  const [minPrice, setMinPrice] = useState<number | undefined>(undefined);
  const [maxPrice, setMaxPrice] = useState<number | undefined>(undefined);
  const [minDuration, setMinDuration] = useState<number | undefined>(undefined);
  const [maxDuration, setMaxDuration] = useState<number | undefined>(undefined);
  const [publicOnly, setPublicOnly] = useState(false);
  const [freeOnly, setFreeOnly] = useState(false);

  // Debounced search query
  const debouncedSearchQuery = useDebounce(searchQuery, 400);
  const searchParams = useSearchParams();

  const { currentPage, updateUrlWithPage, handlePageChange } = usePagination({
    baseRoute: ROUTES.DASHBOARD.SUBSCRIPTION_PLAN,
    defaultPageSize: 10,
  });

  // Initial URL setup
  useEffect(() => {
    const pageParam = searchParams.get("pageNo");
    if (!pageParam) {
      updateUrlWithPage(1, true);
    }
  }, [searchParams, updateUrlWithPage]);

  // Load subscription plans
  const loadSubscriptionPlan = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await getAllSubscriptionPlanService({
        status: statusFilter,
        freeOnly: freeOnly,
        publicOnly: publicOnly,
        maxDurationDays: maxDuration,
        minDurationDays: minDuration,
        maxPrice: maxPrice,
        minPrice: minPrice,
        search: debouncedSearchQuery,
        pageNo: currentPage,
        pageSize: 10,
      });
      console.log("Fetched subscription plans:", response);
      setData(response);
    } catch (error: any) {
      console.log("Failed to fetch subscription plans: ", error);
      toast.error("Failed to load subscription plans");
    } finally {
      setIsLoading(false);
    }
  }, [
    debouncedSearchQuery,
    statusFilter,
    currentPage,
    maxPrice,
    minPrice,
    minDuration,
    maxDuration,
    publicOnly,
    freeOnly,
  ]);

  useEffect(() => {
    loadSubscriptionPlan();
  }, [loadSubscriptionPlan]);

  // Search change handler
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  // Handler functions for table actions
  const handleEditPlan = useCallback((plan: SubscriptionPlanModel) => {
    setModalState({
      isOpen: true,
      mode: ModalMode.UPDATE_MODE,
      data: {
        id: plan.id?.toString() || "",
        name: plan.name || "",
        status: plan.status || "active",
        price: plan.price || 0,
        durationDays: plan.durationDays || 30,
        description: plan.description || "",
      },
      isSubmitting: false,
      error: null,
    });
  }, []);

  const handleViewPlanDetail = useCallback((plan: SubscriptionPlanModel) => {
    setDetailModalState({
      isOpen: true,
      plan: plan,
    });
  }, []);

  const handleDeletePlan = useCallback((plan: SubscriptionPlanModel) => {
    setDeleteState({
      isOpen: true,
      plan: plan,
      isDeleting: false,
    });
  }, []);

  // Memoized table handlers
  const tableHandlers = useMemo(
    () => ({
      handleEditPlan,
      handleViewPlanDetail,
      handleDeletePlan,
    }),
    [handleEditPlan, handleViewPlanDetail, handleDeletePlan]
  );

  // Optimized table columns
  const columns = useMemo(
    () =>
      createSubscriptionPlanTableColumns({
        data,
        handlers: tableHandlers,
      }),
    [data?.pageNo, data?.pageSize, data?.content.length, tableHandlers]
  );

  // Open create modal
  const openCreateModal = () => {
    setModalState({
      isOpen: true,
      mode: ModalMode.CREATE_MODE,
      data: null,
      isSubmitting: false,
      error: null,
    });
  };

  // Close main modal
  const closeModal = () => {
    setModalState((prev) => ({
      ...prev,
      isOpen: false,
      data: null,
      error: null,
    }));
  };

  // Close detail modal
  const closeDetailModal = () => {
    setDetailModalState({
      isOpen: false,
      plan: null,
    });
  };

  // Close delete modal
  const closeDeleteModal = () => {
    setDeleteState({
      isOpen: false,
      plan: null,
      isDeleting: false,
    });
  };

  // Handle form submission
  const handleSubmit = async (
    formData: SubscriptionPlanFormData
  ): Promise<void> => {
    try {
      setModalState((prev) => ({
        ...prev,
        isSubmitting: true,
        error: null,
      }));

      const isCreate = modalState.mode === ModalMode.CREATE_MODE;

      if (
        !formData.name ||
        formData.durationDays === undefined ||
        formData.price === undefined ||
        !formData.status
      ) {
        throw new Error("All required fields must be filled");
      }

      const payload = {
        name: formData.name,
        durationDays: formData.durationDays,
        price: formData.price,
        description: formData.description || "",
        status: formData.status,
      };

      if (isCreate) {
        const response = await createSubscriptionService(payload);
        if (response) {
          setData((prev) =>
            prev
              ? {
                  ...prev,
                  content: [response, ...prev.content],
                  totalElements: prev.totalElements + 1,
                }
              : {
                  content: [response],
                  pageNo: 1,
                  pageSize: 10,
                  totalElements: 1,
                  totalPages: 1,
                  hasNext: false,
                  hasPrevious: false,
                  first: true,
                  last: true,
                }
          );

          AppToast({
            type: "success",
            message: `Subscription plan "${response.name}" created successfully`,
            duration: 4000,
            position: "top-right",
          });
        }
      } else {
        if (!formData?.id) {
          throw new Error("Plan ID is required for update");
        }

        const response = await updateSubscriptionPlanService(
          formData.id,
          payload
        );
        if (response) {
          setData((prev) =>
            prev
              ? {
                  ...prev,
                  content: prev.content.map((plan) =>
                    plan.id?.toString() === formData.id ? response : plan
                  ),
                }
              : prev
          );

          AppToast({
            type: "success",
            message: `Subscription plan "${response.name}" updated successfully`,
            duration: 4000,
            position: "top-right",
          });
        }
      }
    } catch (error: any) {
      const errorMessage = error.message || "An unexpected error occurred";
      setModalState((prev) => ({
        ...prev,
        error: errorMessage,
      }));

      toast.error(errorMessage);
      throw error; // Re-throw to prevent modal from closing
    } finally {
      setModalState((prev) => ({
        ...prev,
        isSubmitting: false,
      }));
    }
  };

  // Handle delete
  const handleDelete = async () => {
    if (!deleteState.plan?.id) return;

    setDeleteState((prev) => ({ ...prev, isDeleting: true }));

    try {
      const response = await deletedSubscriptionPlanService(
        deleteState.plan.id
      );

      if (response) {
        AppToast({
          type: "success",
          message: `Subscription plan "${deleteState.plan.name}" deleted successfully`,
          duration: 4000,
          position: "top-right",
        });

        // Check if we need to go back a page
        if (data && data.content.length === 1 && currentPage > 1) {
          updateUrlWithPage(currentPage - 1);
        } else {
          await loadSubscriptionPlan();
        }
      }
    } catch (error) {
      console.error("Error deleting subscription plan:", error);
      toast.error("Failed to delete subscription plan");
      throw error;
    } finally {
      setDeleteState((prev) => ({ ...prev, isDeleting: false }));
    }
  };

  // Reset filters
  const handleResetFilters = () => {
    setStatusFilter(undefined);
    setHasSubscription(undefined);
    setSearchQuery("");
    updateUrlWithPage(1, true);
    setData(null);
    loadSubscriptionPlan();
    setMinPrice(undefined);
    setMaxPrice(undefined);
    setMinDuration(undefined);
    setMaxDuration(undefined);
    setPublicOnly(false);
    setFreeOnly(false);
  };

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <div className="space-y-6">
        <CardHeaderSection
          breadcrumbs={[
            { label: "Dashboard", href: ROUTES.DASHBOARD.INDEX },
            { label: "Subscription Plans", href: "" },
          ]}
          title="Subscription Plans"
          searchValue={searchQuery}
          searchPlaceholder="Search plans..."
          disableReset={!statusFilter && !hasSubscription}
          handleResetFilters={handleResetFilters}
          onSearchChange={handleSearchChange}
          children={
            <div className="flex flex-wrap items-center justify-between gap-4 w-full">
              <div className="flex items-center gap-3">
                <CustomSelect
                  options={SUBSCRIPTION_PLAN_OPTIONS}
                  value={statusFilter}
                  placeholder="Select Status"
                  onValueChange={(value) =>
                    setStatusFilter(value as SubscriptionPlanStatus)
                  }
                />
                <CustomSelect
                  options={subscriptionOptions}
                  value={
                    hasSubscription === undefined
                      ? "All"
                      : hasSubscription
                      ? "true"
                      : "false"
                  }
                  placeholder="All"
                  onValueChange={(value) => {
                    if (value === "true") setHasSubscription(true);
                    else if (value === "false") setHasSubscription(false);
                    else setHasSubscription(undefined);
                  }}
                />
              </div>

              {/* Add Plan Button */}
              <Button
                onClick={openCreateModal}
                className="flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                Add Plan
              </Button>
            </div>
          }
        />

        <div className="space-y-4">
          <DataTable
            data={data?.content || []}
            columns={columns}
            loading={isLoading}
            emptyMessage="No subscription plans found"
            getRowKey={(plan) => plan.id?.toString() || plan.name}
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

      {/* Create/Edit Modal */}
      <ModalSubscriptionPlan
        isOpen={modalState.isOpen}
        onClose={closeModal}
        isSubmitting={modalState.isSubmitting}
        onSave={handleSubmit}
        Data={modalState.data}
        mode={modalState.mode}
        error={modalState.error}
      />

      {/* Detail Modal */}
      <SubscriptionPlanDetailModal
        isOpen={detailModalState.isOpen}
        onClose={closeDetailModal}
        subPlan={detailModalState.plan}
      />

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmationDialog
        isOpen={deleteState.isOpen}
        onClose={closeDeleteModal}
        onDelete={handleDelete}
        title="Delete Subscription Plan"
        description="Are you sure you want to delete this subscription plan?"
        itemName={deleteState.plan?.name || "---"}
        isSubmitting={deleteState.isDeleting}
      />
    </div>
  );
}
