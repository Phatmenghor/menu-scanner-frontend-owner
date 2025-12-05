"use client";

import { useState, useCallback, useEffect, useMemo } from "react";
import { useDebounce } from "@/utils/debounce/debounce";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { usePagination } from "@/hooks/use-pagination";
import { ROUTES } from "@/constants/AppRoutes/routes";
import { DeleteConfirmationModal } from "@/components/shared/modal/delete-confirmation-modal";
import { AppToast } from "@/components/shared/common/app-toast";
import { CardHeaderSection } from "@/components/layout/card-header-section";
import { CustomSelect } from "@/components/shared/common/custom-select";
import { DataTableWithPagination } from "@/components/shared/common/data-table";
import { CustomPagination } from "@/components/shared/common/custom-pagination";
import { ModalMode, Status } from "@/constants/AppResource/status/status";
import { Plus } from "lucide-react";
import {
  AllExchangeRate,
  ExchangeRateModel,
} from "@/models/dashboard/payment/exchange-rate/exchange-rate.response.model";
import {
  createExchangeRateService,
  deletedExchangeRateService,
  getAllExchangeRateService,
  updateExchangeRateService,
} from "@/services/dashboard/payment/exchange-rate/exchange-rate.service";
import ModalExchangeRate from "@/components/shared/modal/exchange-rate-modal";
import { ExchangeRateFormData } from "@/models/dashboard/payment/exchange-rate/exchange-rate.schema";
import { SaveExchangeRateRequest } from "@/models/dashboard/payment/exchange-rate/exchange-rate.request.model";
import { createExchangeRateTableColumns } from "@/constants/AppResource/table/master-data/exchange-rate-table";
import { ExchangeRateDetailModal } from "@/components/dashboard/master-data/exchange-rate/exchange-rate-detail-modal";

const STATUS_FILTER_OPTIONS = [
  { label: "All Status", value: Status.ALL },
  { label: "Active", value: Status.ACTIVE },
  { label: "Inactive", value: Status.INACTIVE },
];

export default function ExchangeRatePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [data, setData] = useState<AllExchangeRate | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Modal states
  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    exchangeRateId: string;
    isSubmitting: boolean;
    mode: ModalMode;
  }>({
    isOpen: false,
    exchangeRateId: "",
    isSubmitting: false,
    mode: ModalMode.CREATE_MODE,
  });

  // Detail modal state
  const [detailModalState, setDetailModalState] = useState<{
    isOpen: boolean;
    exchangeRateId: string;
  }>({
    isOpen: false,
    exchangeRateId: "",
  });

  // Delete modal state
  const [deleteState, setDeleteState] = useState<{
    isOpen: boolean;
    exchangeRate: ExchangeRateModel | null;
    isDeleting: boolean;
  }>({
    isOpen: false,
    exchangeRate: null,
    isDeleting: false,
  });

  const [statusFilter, setStatusFilter] = useState<Status>(Status.ALL);

  // Debounced search query
  const debouncedSearchQuery = useDebounce(searchQuery, 400);
  const searchParams = useSearchParams();

  const { currentPage, updateUrlWithPage, handlePageChange } = usePagination({
    baseRoute: ROUTES.DASHBOARD.EXCHANGE_RATE,
    defaultPageSize: 10,
  });

  useEffect(() => {
    const pageParam = searchParams.get("pageNo");
    if (!pageParam) {
      updateUrlWithPage(1, true);
    }
  }, [searchParams, updateUrlWithPage]);

  // Load exchange rates
  const loadExchangeRates = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await getAllExchangeRateService({
        search: debouncedSearchQuery,
        pageNo: currentPage,
        pageSize: 10,
        isActive:
          statusFilter === Status.ALL
            ? undefined
            : statusFilter === Status.ACTIVE
            ? true
            : false,
      });
      setData(response);
    } catch (error: any) {
      console.error("Failed to fetch exchange rates: ", error);
      toast.error("Failed to load exchange rates");
    } finally {
      setIsLoading(false);
    }
  }, [debouncedSearchQuery, currentPage, statusFilter]);

  useEffect(() => {
    loadExchangeRates();
  }, [loadExchangeRates]);

  // Search change handler
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  // Handler functions for table actions
  const handleEditExchangeRate = useCallback(
    (exchangeRate: ExchangeRateModel) => {
      setModalState({
        isOpen: true,
        exchangeRateId: exchangeRate.id || "",
        isSubmitting: false,
        mode: ModalMode.UPDATE_MODE,
      });
    },
    []
  );

  const handleViewExchangeRateDetail = useCallback(
    (exchangeRate: ExchangeRateModel) => {
      setDetailModalState({
        isOpen: true,
        exchangeRateId: exchangeRate.id || "",
      });
    },
    []
  );

  const handleDeleteExchangeRate = useCallback(
    (exchangeRate: ExchangeRateModel) => {
      setDeleteState({
        isOpen: true,
        exchangeRate: exchangeRate,
        isDeleting: false,
      });
    },
    []
  );

  // Memoized table handlers
  const tableHandlers = useMemo(
    () => ({
      handleEditExchangeRate,
      handleViewExchangeRateDetail,
      handleDelete: handleDeleteExchangeRate,
    }),
    [
      handleEditExchangeRate,
      handleViewExchangeRateDetail,
      handleDeleteExchangeRate,
    ]
  );

  // Optimized table columns
  const columns = useMemo(
    () =>
      createExchangeRateTableColumns({
        data,
        handlers: tableHandlers,
      }),
    [data?.pageNo, data?.pageSize, data?.content?.length, tableHandlers]
  );

  // Close modals
  const closeModal = () => {
    setModalState({
      isOpen: false,
      exchangeRateId: "",
      isSubmitting: false,
      mode: ModalMode.CREATE_MODE,
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
      exchangeRate: null,
      isDeleting: false,
    });
  };

  // Handle form submission
  const handleSubmit = async (
    formData: ExchangeRateFormData
  ): Promise<void> => {
    try {
      setModalState((prev) => ({
        ...prev,
        isSubmitting: true,
      }));

      const isCreate = modalState.mode === ModalMode.CREATE_MODE;
      const payload: SaveExchangeRateRequest = {
        usdToKhrRate: formData.usdToKhrRate,
        notes: formData.notes,
      };

      if (isCreate) {
        const response = await createExchangeRateService(payload);
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
            message: "Exchange rate created successfully",
            duration: 4000,
            position: "top-right",
          });

          closeModal();
        }
      } else {
        if (!modalState.exchangeRateId) {
          throw new Error("Exchange rate ID is required for update");
        }

        const response = await updateExchangeRateService(
          modalState.exchangeRateId,
          payload
        );
        if (response) {
          setData((prev) =>
            prev
              ? {
                  ...prev,
                  content: prev.content.map((rate) =>
                    rate.id === modalState.exchangeRateId ? response : rate
                  ),
                }
              : prev
          );

          AppToast({
            type: "success",
            message: "Exchange rate updated successfully",
            duration: 4000,
            position: "top-right",
          });

          closeModal();
        }
      }
    } catch (error: any) {
      console.error("Error saving exchange rate:", error);
      toast.error(error.message || "An unexpected error occurred");
    } finally {
      setModalState((prev) => ({
        ...prev,
        isSubmitting: false,
      }));
    }
  };

  // Handle delete
  const handleDelete = async () => {
    if (!deleteState.exchangeRate?.id) return;

    setDeleteState((prev) => ({ ...prev, isDeleting: true }));

    try {
      const response = await deletedExchangeRateService(
        deleteState.exchangeRate.id
      );

      if (response) {
        AppToast({
          type: "success",
          message: "Exchange rate deleted successfully",
          duration: 4000,
          position: "top-right",
        });

        // Check if we need to go back a page
        if (data && data.content.length === 1 && currentPage > 1) {
          updateUrlWithPage(currentPage - 1);
        } else {
          await loadExchangeRates();
        }
      }
    } catch (error) {
      console.error("Error deleting exchange rate:", error);
      toast.error("Failed to delete exchange rate");
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
            { label: "Exchange Rate Management", href: "" },
          ]}
          title="Exchange Rate Management"
          searchValue={searchQuery}
          searchPlaceholder="Search exchange rates..."
          buttonIcon={<Plus className="w-4 h-4" />}
          buttonText="New Exchange Rate"
          onSearchChange={handleSearchChange}
          openModal={() => {
            setModalState({
              isOpen: true,
              exchangeRateId: "",
              isSubmitting: false,
              mode: ModalMode.CREATE_MODE,
            });
          }}
        >
          <div className="flex flex-wrap items-center justify-between gap-4 w-full">
            <div className="flex items-center gap-3">
              <CustomSelect
                options={STATUS_FILTER_OPTIONS}
                value={statusFilter}
                placeholder="Select Status"
                onValueChange={(value) => setStatusFilter(value as Status)}
              />
            </div>
          </div>
        </CardHeaderSection>

        <div className="space-y-4">
          <DataTableWithPagination
            data={data?.content || []}
            columns={columns}
            loading={isLoading}
            emptyMessage="No exchange rates found"
            getRowKey={(exchangeRate) =>
              exchangeRate.id?.toString() ||
              exchangeRate.usdToKhrRate.toString()
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

      {/* Create/Edit Modal */}
      <ModalExchangeRate
        isOpen={modalState.isOpen}
        onClose={closeModal}
        isSubmitting={modalState.isSubmitting}
        onSave={handleSubmit}
        exchangeRateId={modalState.exchangeRateId}
        mode={modalState.mode}
      />

      {/* Detail Modal */}
      <ExchangeRateDetailModal
        isOpen={detailModalState.isOpen}
        onClose={closeDetailModal}
        exchangeRateId={detailModalState.exchangeRateId}
      />

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmationModal
        isOpen={deleteState.isOpen}
        onClose={closeDeleteModal}
        onDelete={handleDelete}
        title="Delete Exchange Rate"
        description="Are you sure you want to delete this exchange rate?"
        itemName={
          deleteState.exchangeRate
            ? `${deleteState.exchangeRate.usdToKhrRate.toLocaleString()} KHR`
            : "---"
        }
        isSubmitting={deleteState.isDeleting}
      />
    </div>
  );
}
