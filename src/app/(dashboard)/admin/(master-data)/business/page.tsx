"use client";

import { useState, useCallback, useEffect, useMemo } from "react";
import { Separator } from "@/components/ui/separator";
import {
  BUSINESS_STATUS_OPTIONS,
  BusinessStatus,
  subscriptionOptions,
  SubscriptionStatus,
} from "@/constants/AppResource/status/status";
import { useDebounce } from "@/utils/debounce/debounce";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { usePagination } from "@/hooks/use-pagination";
import { ROUTES } from "@/constants/AppRoutes/routes";
import { DeleteConfirmationDialog } from "@/components/shared/dialog/dialog-delete";
import { AppToast } from "@/components/shared/toast/app-toast";
import { BusinessFormData } from "@/models/dashboard/master-data/business/business.schema";
import {
  AllBusinessResponse,
  BusinessModel,
} from "@/models/dashboard/master-data/business/business.response.model";
import {
  createBusinessService,
  deletedBusinessService,
  getAllBusinessService,
  updateBusinessService,
} from "@/services/dashboard/master-data/business/business.service";
import ModalBusiness from "@/components/shared/modal/business-modal";
import { CardHeaderSection } from "@/components/layout/card-header-section";
import { CustomSelect } from "@/components/shared/common/custom-select";
import { DataTable } from "@/components/shared/common/data-table";
import { CustomPagination } from "@/components/shared/common/custom-pagination";
import { BusinessDetailModal } from "@/components/dashboard/master-data/business/business-detail-modal";
import { createBusinessTableColumns } from "@/constants/AppResource/table/master-data/bisiness-table";
import { set } from "nprogress";

export default function BusinessPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [data, setData] = useState<AllBusinessResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Modal states - update only
  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    data: BusinessFormData | null;
    isSubmitting: boolean;
    error: string | null;
  }>({
    isOpen: false,
    data: null,
    isSubmitting: false,
    error: null,
  });

  // Detail modal state
  const [detailModalState, setDetailModalState] = useState<{
    isOpen: boolean;
    business: BusinessModel | null;
  }>({
    isOpen: false,
    business: null,
  });

  // Delete modal state
  const [deleteState, setDeleteState] = useState<{
    isOpen: boolean;
    business: BusinessModel | null;
    isDeleting: boolean;
  }>({
    isOpen: false,
    business: null,
    isDeleting: false,
  });

  // Filter states
  const [statusFilter, setStatusFilter] = useState<BusinessStatus>(
    BusinessStatus.All
  );
  const [hasSubscription, setHasSubscription] = useState<SubscriptionStatus>(
    SubscriptionStatus.All
  );

  // Debounced search query
  const debouncedSearchQuery = useDebounce(searchQuery, 400);
  const searchParams = useSearchParams();

  const { currentPage, updateUrlWithPage, handlePageChange } = usePagination({
    baseRoute: ROUTES.DASHBOARD.BUSINESS,
    defaultPageSize: 10,
  });

  // Initial URL setup
  useEffect(() => {
    const pageParam = searchParams.get("pageNo");
    if (!pageParam) {
      updateUrlWithPage(1, true);
    }
  }, [searchParams, updateUrlWithPage]);

  // Load businesses
  const loadBusiness = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await getAllBusinessService({
        status: statusFilter === BusinessStatus.All ? undefined : statusFilter,
        hasActiveSubscription:
          hasSubscription === SubscriptionStatus.All
            ? undefined
            : hasSubscription === SubscriptionStatus.SUBSCRIBED
            ? true
            : false,
        search: debouncedSearchQuery,
        pageNo: currentPage,
      });
      console.log("Fetched businesses:", response);
      setData(response);
    } catch (error: any) {
      console.log("Failed to fetch businesses: ", error);
      toast.error("Failed to load businesses");
    } finally {
      setIsLoading(false);
    }
  }, [debouncedSearchQuery, statusFilter, hasSubscription, currentPage]);

  useEffect(() => {
    loadBusiness();
  }, [loadBusiness]);

  // Search change handler
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  // Handler functions for table actions
  const handleEditBusiness = useCallback((business: BusinessModel) => {
    setModalState({
      isOpen: true,
      data: {
        id: business.id?.toString() || "",
        email: business.email || "",
        name: business.name || "",
        status: business.status || "active",
        address: business.address || "",
        description: business.description || "",
        phone: business.phone || "",
      },
      isSubmitting: false,
      error: null,
    });
  }, []);

  const handleViewBusinessDetail = useCallback((business: BusinessModel) => {
    setDetailModalState({
      isOpen: true,
      business: business,
    });
  }, []);

  const handleDeleteBusiness = useCallback((business: BusinessModel) => {
    setDeleteState({
      isOpen: true,
      business: business,
      isDeleting: false,
    });
  }, []);

  // Memoized table handlers
  const tableHandlers = useMemo(
    () => ({
      handleEditBusiness,
      handleViewBusinessDetail,
      handleDelete: handleDeleteBusiness,
    }),
    [handleEditBusiness, handleViewBusinessDetail, handleDeleteBusiness]
  );

  // Optimized table columns
  const columns = useMemo(
    () =>
      createBusinessTableColumns({
        data,
        handlers: tableHandlers,
      }),
    [data?.pageNo, data?.pageSize, data?.content?.length, tableHandlers]
  );

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
      business: null,
    });
  };

  // Close delete modal
  const closeDeleteModal = () => {
    setDeleteState({
      isOpen: false,
      business: null,
      isDeleting: false,
    });
  };

  // Handle form submission - update only
  const handleSubmit = async (formData: BusinessFormData): Promise<void> => {
    try {
      setModalState((prev) => ({
        ...prev,
        isSubmitting: true,
        error: null,
      }));

      if (!formData.email || !formData.name || !formData.id) {
        throw new Error("Business ID, email and name are required for update");
      }

      const payload = {
        email: formData.email,
        name: formData.name,
        status: formData.status || "active",
        address: formData.address || "",
        description: formData.description || "",
        phone: formData.phone || "",
      };

      const response = await updateBusinessService(formData.id, payload);
      if (response) {
        setData((prev) =>
          prev
            ? {
                ...prev,
                content: prev.content.map((business) =>
                  business.id?.toString() === formData.id ? response : business
                ),
              }
            : prev
        );

        AppToast({
          type: "success",
          message: `Business "${response.name}" updated successfully`,
          duration: 4000,
          position: "top-right",
        });
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
    if (!deleteState.business?.id) return;

    setDeleteState((prev) => ({ ...prev, isDeleting: true }));

    try {
      const response = await deletedBusinessService(deleteState.business.id);

      if (response) {
        AppToast({
          type: "success",
          message: `Business "${deleteState.business.name}" deleted successfully`,
          duration: 4000,
          position: "top-right",
        });

        // Check if we need to go back a page
        if (data && data.content.length === 1 && currentPage > 1) {
          updateUrlWithPage(currentPage - 1);
        } else {
          await loadBusiness();
        }
      }
    } catch (error) {
      console.error("Error deleting business:", error);
      toast.error("Failed to delete business");
      throw error;
    } finally {
      setDeleteState((prev) => ({ ...prev, isDeleting: false }));
    }
  };

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <div className="space-y-6">
        <CardHeaderSection
          breadcrumbs={[
            { label: "Dashboard", href: ROUTES.DASHBOARD.INDEX },
            { label: "Business Management", href: "" },
          ]}
          title="Business Management"
          searchValue={searchQuery}
          searchPlaceholder="Search businesses..."
          onSearchChange={handleSearchChange}
          children={
            <div className="flex flex-wrap items-center justify-between gap-4 w-full">
              <div className="flex items-center gap-3">
                <CustomSelect
                  options={BUSINESS_STATUS_OPTIONS}
                  value={statusFilter}
                  placeholder="Select Status"
                  onValueChange={(value) =>
                    setStatusFilter(value as BusinessStatus)
                  }
                />
                <CustomSelect
                  options={subscriptionOptions}
                  value={hasSubscription}
                  placeholder="Select Subscription"
                  onValueChange={(value) => {
                    setHasSubscription(value as SubscriptionStatus);
                  }}
                />
              </div>
            </div>
          }
        />

        <div className="space-y-4">
          <DataTable
            data={data?.content || []}
            columns={columns}
            loading={isLoading}
            emptyMessage="No businesses found"
            getRowKey={(business) => business.id?.toString() || business.name}
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

      {/* Update Modal */}
      <ModalBusiness
        isOpen={modalState.isOpen}
        onClose={closeModal}
        isSubmitting={modalState.isSubmitting}
        onSave={handleSubmit}
        Data={modalState.data}
        error={modalState.error}
      />

      {/* Detail Modal */}
      <BusinessDetailModal
        isOpen={detailModalState.isOpen}
        onClose={closeDetailModal}
        business={detailModalState.business}
      />

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmationDialog
        isOpen={deleteState.isOpen}
        onClose={closeDeleteModal}
        onDelete={handleDelete}
        title="Delete Business"
        description="Are you sure you want to delete this business?"
        itemName={
          deleteState.business?.name || deleteState.business?.email || "---"
        }
        isSubmitting={deleteState.isDeleting}
      />
    </div>
  );
}
