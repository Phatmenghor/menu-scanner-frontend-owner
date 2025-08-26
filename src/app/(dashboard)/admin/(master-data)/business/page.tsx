"use client";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  BUSINESS_STATUS_OPTIONS,
  BusinessStatus,
  ModalMode,
  Status,
  subscriptionOptions,
} from "@/constants/AppResource/status/status";
import { useDebounce } from "@/utils/debounce/debounce";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { usePagination } from "@/hooks/use-pagination";
import { ROUTES } from "@/constants/AppRoutes/routes";
import ResetPasswordModal from "@/components/shared/dialog/dialog-reset-password";
import { DeleteConfirmationDialog } from "@/components/shared/dialog/dialog-delete";
import { AppToast } from "@/components/shared/toast/app-toast";
import { ConfirmDialog } from "@/components/shared/dialog/dialog-confirm";
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
import { CardHeaderSection } from "@/components/layout/main/card-header-section";
import {
  CustomSelect,
  SelectOption,
} from "@/components/shared/common/custom-select";
import { DataTable } from "@/components/shared/common/data-table";
import { createBusinessTableColumns } from "@/constants/AppResource/table/table-constant";
import { CustomPagination } from "@/components/shared/common/custom-pagination";
import { set } from "nprogress";
import { BusinessDetailModal } from "@/components/dashboard/master-data/business/business-detail-modal";

export default function BusinessPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [data, setData] = useState<AllBusinessResponse | null>(null);
  const [initializeBusiness, setInitializeBusiness] =
    useState<BusinessFormData | null>(null);
  const [selectedBusiness, setSelectedBusiness] =
    useState<BusinessModel | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isBusinessDetailOpen, setIsBusinessDetailOpen] = useState(false);
  const [mode, setMode] = useState<ModalMode>(ModalMode.CREATE_MODE);
  const [statusFilter, setStatusFilter] = useState<BusinessStatus | undefined>(
    BusinessStatus.All
  );
  const [hasSubscription, setHasSubscription] = useState<boolean | undefined>(
    undefined
  );
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const debouncedSearchQuery = useDebounce(searchQuery, 400);
  const searchParams = useSearchParams();

  const { currentPage, updateUrlWithPage, handlePageChange } = usePagination({
    baseRoute: ROUTES.DASHBOARD.BUSINESS,
    defaultPageSize: 10,
  });

  useEffect(() => {
    const pageParam = searchParams.get("pageNo");
    if (!pageParam) {
      updateUrlWithPage(1, true);
    }
  }, [searchParams, updateUrlWithPage]);

  const loadBusiness = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await getAllBusinessService({
        status: statusFilter == BusinessStatus.All ? undefined : statusFilter,
        hasActiveSubscription: hasSubscription,
        search: debouncedSearchQuery,
        pageNo: currentPage,
      });
      setData(response);
    } catch (error: any) {
      console.log("Failed to fetch businesses: ", error);
    } finally {
      setIsLoading(false);
    }
  }, [debouncedSearchQuery, statusFilter, hasSubscription, currentPage]);

  useEffect(() => {
    loadBusiness();
  }, [loadBusiness]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  async function handleSubmit(formData: BusinessFormData) {
    setIsSubmitting(true);
    try {
      const isCreate = mode === ModalMode.CREATE_MODE;
      const payload = {
        email: formData.email!,
        name: formData.name!,
        status: formData.status,
        address: formData.address,
        description: formData.description,
        phone: formData.phone,
      };

      if (isCreate) {
        const response = await createBusinessService(payload);
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
            message: `Business ${
              response.username || formData.email
            } added successfully`,
            duration: 4000,
            position: "top-right",
          });

          setIsModalOpen(false);
        }
      } else {
        if (!formData?.id) {
          throw new Error("Business ID is required for update");
        }

        const response = await updateBusinessService(formData?.id, payload);
        if (response) {
          setData((prev) =>
            prev
              ? {
                  ...prev,
                  content: prev.content.map((b) =>
                    b.id === formData.id ? response : b
                  ),
                }
              : prev
          );

          AppToast({
            type: "success",
            message: `Business ${
              response.username || response.email
            } updated successfully`,
            duration: 4000,
            position: "top-right",
          });

          setIsModalOpen(false);
        }
      }
    } catch (error: any) {
      console.error("Error submitting business form:", error);
      toast.error(error.message || "An unexpected error occurred");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleDeleteBusiness() {
    if (!selectedBusiness || !selectedBusiness.id) return;

    setIsSubmitting(true);
    try {
      const response = await deletedBusinessService(selectedBusiness.id);

      if (response) {
        AppToast({
          type: "success",
          message: `Business ${
            selectedBusiness.name ?? ""
          } deleted successfully`,
          duration: 4000,
          position: "top-right",
        });

        if (data && data.content.length === 1 && currentPage > 1) {
          updateUrlWithPage(currentPage - 1);
        } else {
          await loadBusiness();
        }
      } else {
        AppToast({
          type: "error",
          message: `Failed to delete business`,
          duration: 4000,
          position: "top-right",
        });
      }
    } catch (error) {
      console.error("Error deleting business:", error);
      toast.error("An error occurred while deleting the business");
    } finally {
      setIsSubmitting(false);
      setIsDeleteDialogOpen(false);
    }
  }

  const handleEditBusiness = (business: BusinessFormData) => {
    setInitializeBusiness(business);
    setMode(ModalMode.UPDATE_MODE);
    setIsModalOpen(true);
  };

  const handleViewBusinessDetail = (business: BusinessModel) => {
    setSelectedBusiness(business);
    setIsBusinessDetailOpen(true);
  };

  const handleDelete = (business: BusinessModel) => {
    setSelectedBusiness(business);
    setIsDeleteDialogOpen(true);
  };

  const handleResetFilters = () => {
    setStatusFilter(undefined);
    setHasSubscription(undefined);
    setSearchQuery("");
    updateUrlWithPage(1, true);
    setData(null);
    loadBusiness();
  };

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <div className="space-y-6">
        <CardHeaderSection
          breadcrumbs={[
            { label: "Dashboard", href: ROUTES.DASHBOARD.INDEX },
            { label: "Business List", href: "" },
          ]}
          title="Business"
          searchValue={searchQuery}
          searchPlaceholder="Search..."
          disableReset={!statusFilter && !hasSubscription}
          handleResetFilters={handleResetFilters}
          onSearchChange={handleSearchChange}
          children={
            <div className="flex flex-wrap items-center justify-start gap-4 w-full">
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
            </div>
          }
        />

        <div className="space-y-4">
          <DataTable
            data={data?.content || []}
            columns={createBusinessTableColumns({
              data,
              handlers: {
                handleEditBusiness,
                handleViewBusinessDetail,
                handleDelete,
              },
            })}
            loading={isLoading}
            emptyMessage="No businesses found"
            getRowKey={(business) => business.id}
          />

          <CustomPagination
            currentPage={currentPage}
            totalPages={data?.totalPages || 1}
            onPageChange={handlePageChange}
            size="md"
          />
        </div>

        <ModalBusiness
          isOpen={isModalOpen}
          onClose={() => {
            setInitializeBusiness(null);
            setIsModalOpen(false);
          }}
          isSubmitting={isSubmitting}
          onSave={handleSubmit}
          data={initializeBusiness}
        />

        <BusinessDetailModal
          isOpen={isBusinessDetailOpen}
          onClose={() => {
            setSelectedBusiness(null);
            setIsBusinessDetailOpen(false);
          }}
          business={selectedBusiness}
        />

        <DeleteConfirmationDialog
          isOpen={isDeleteDialogOpen}
          onClose={() => {
            setIsDeleteDialogOpen(false);
            setSelectedBusiness(null);
          }}
          onDelete={handleDeleteBusiness}
          title="Delete Business"
          description="Are you sure you want to delete this business?"
          itemName={selectedBusiness?.name || selectedBusiness?.email}
          isSubmitting={isSubmitting}
        />
      </div>
    </div>
  );
}
