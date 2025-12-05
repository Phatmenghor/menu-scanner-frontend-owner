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
  AllPayment,
  PaymentModel,
} from "@/models/dashboard/payment/payment/payment.response.model";
import {
  createPaymentService,
  deletedPaymentService,
  getAllPaymentService,
  updatePaymentService,
} from "@/services/dashboard/payment/payment/payment.service";
import PaymentModal from "@/components/shared/modal/payment-modal";
import {
  CreatePaymentFormData,
  UpdatePaymentFormData,
} from "@/models/dashboard/payment/payment/payment.schema";
import {
  CreatePaymentRequest,
  UpdatePaymentRequest,
} from "@/models/dashboard/payment/payment/payment.request.model";
import { createPaymentTableColumns } from "@/constants/AppResource/table/master-data/payment-table";
import { PaymentDetailModal } from "@/components/dashboard/master-data/payment/payment-detail-modal";

const STATUS_FILTER_OPTIONS = [
  { label: "All Status", value: Status.ALL },
  { label: "Pending", value: "PENDING" },
  { label: "Completed", value: "COMPLETED" },
  { label: "Failed", value: "FAILED" },
  { label: "Cancelled", value: "CANCELLED" },
];

const PAYMENT_METHOD_FILTER_OPTIONS = [
  { label: "All Methods", value: "ALL" },
  { label: "Cash", value: "CASH" },
  { label: "Bank Transfer", value: "BANK_TRANSFER" },
  { label: "Credit Card", value: "CREDIT_CARD" },
  { label: "Digital Wallet", value: "DIGITAL_WALLET" },
];

export default function PaymentPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [data, setData] = useState<AllPayment | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Modal states
  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    paymentId: string;
    isSubmitting: boolean;
    mode: ModalMode;
  }>({
    isOpen: false,
    paymentId: "",
    isSubmitting: false,
    mode: ModalMode.CREATE_MODE,
  });

  // Detail modal state
  const [detailModalState, setDetailModalState] = useState<{
    isOpen: boolean;
    paymentId: string;
  }>({
    isOpen: false,
    paymentId: "",
  });

  // Delete modal state
  const [deleteState, setDeleteState] = useState<{
    isOpen: boolean;
    payment: PaymentModel | null;
    isDeleting: boolean;
  }>({
    isOpen: false,
    payment: null,
    isDeleting: false,
  });

  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [paymentMethodFilter, setPaymentMethodFilter] = useState<string>("ALL");

  // Debounced search query
  const debouncedSearchQuery = useDebounce(searchQuery, 400);
  const searchParams = useSearchParams();

  const { currentPage, updateUrlWithPage, handlePageChange } = usePagination({
    baseRoute: ROUTES.DASHBOARD.PAYMENT,
    defaultPageSize: 10,
  });

  useEffect(() => {
    const pageParam = searchParams.get("pageNo");
    if (!pageParam) {
      updateUrlWithPage(1, true);
    }
  }, [searchParams, updateUrlWithPage]);

  // Load payments
  const loadPayments = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await getAllPaymentService({
        search: debouncedSearchQuery,
        pageNo: currentPage,
        pageSize: 10,
        status: statusFilter === "ALL" ? undefined : statusFilter,
        paymentMethod:
          paymentMethodFilter === "ALL" ? undefined : paymentMethodFilter,
      });
      setData(response);
    } catch (error: any) {
      console.error("Failed to fetch payments: ", error);
      toast.error("Failed to load payments");
    } finally {
      setIsLoading(false);
    }
  }, [debouncedSearchQuery, currentPage, statusFilter, paymentMethodFilter]);

  useEffect(() => {
    loadPayments();
  }, [loadPayments]);

  // Search change handler
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  // Handler functions for table actions
  const handleEditPayment = useCallback((payment: PaymentModel) => {
    setModalState({
      isOpen: true,
      paymentId: payment.id || "",
      isSubmitting: false,
      mode: ModalMode.UPDATE_MODE,
    });
  }, []);

  const handleViewPaymentDetail = useCallback((payment: PaymentModel) => {
    setDetailModalState({
      isOpen: true,
      paymentId: payment.id || "",
    });
  }, []);

  const handleDeletePayment = useCallback((payment: PaymentModel) => {
    setDeleteState({
      isOpen: true,
      payment: payment,
      isDeleting: false,
    });
  }, []);

  // Memoized table handlers
  const tableHandlers = useMemo(
    () => ({
      handleEditPayment,
      handleViewPaymentDetail,
      handleDelete: handleDeletePayment,
    }),
    [handleEditPayment, handleViewPaymentDetail, handleDeletePayment]
  );

  // Optimized table columns
  const columns = useMemo(
    () =>
      createPaymentTableColumns({
        data,
        handlers: tableHandlers,
      }),
    [data?.pageNo, data?.pageSize, data?.content?.length, tableHandlers]
  );

  // Close modals
  const closeModal = () => {
    setModalState({
      isOpen: false,
      paymentId: "",
      isSubmitting: false,
      mode: ModalMode.CREATE_MODE,
    });
  };

  const closeDetailModal = () => {
    setDetailModalState({
      isOpen: false,
      paymentId: "",
    });
  };

  const closeDeleteModal = () => {
    setDeleteState({
      isOpen: false,
      payment: null,
      isDeleting: false,
    });
  };

  // Handle form submission
  const handleSubmit = async (
    formData: CreatePaymentFormData | UpdatePaymentFormData
  ): Promise<void> => {
    try {
      setModalState((prev) => ({
        ...prev,
        isSubmitting: true,
      }));

      const isCreate = modalState.mode === ModalMode.CREATE_MODE;

      if (isCreate) {
        const data = formData as CreatePaymentFormData;
        const payload: CreatePaymentRequest = {
          businessId: data.businessId,
          amount: data.amount,
          paymentMethod: data.paymentMethod,
          status: data.status || "PENDING",
          referenceNumber: data.referenceNumber,
          notes: data.notes,
          imageUrl: data.imageUrl,
          paymentType: data.paymentType || "SUBSCRIPTION",
        };

        const response = await createPaymentService(payload);
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
            message: "Payment created successfully",
          });

          closeModal();
        }
      } else {
        if (!modalState.paymentId) {
          throw new Error("Payment ID is required for update");
        }

        const data = formData as UpdatePaymentFormData;
        const payload: UpdatePaymentRequest = {
          amount: data.amount,
          paymentMethod: data.paymentMethod,
          status: data.status,
          referenceNumber: data.referenceNumber,
          notes: data.notes,
          imageUrl: data.imageUrl,
        };

        const response = await updatePaymentService(
          modalState.paymentId,
          payload
        );
        if (response) {
          setData((prev) =>
            prev
              ? {
                  ...prev,
                  content: prev.content.map((payment) =>
                    payment.id === modalState.paymentId ? response : payment
                  ),
                }
              : prev
          );

          AppToast({
            type: "success",
            message: "Payment updated successfully",
            duration: 4000,
            position: "top-right",
          });

          closeModal();
        }
      }
    } catch (error: any) {
      console.error("Error saving payment:", error);
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
    if (!deleteState.payment?.id) return;

    setDeleteState((prev) => ({ ...prev, isDeleting: true }));

    try {
      const response = await deletedPaymentService(deleteState.payment.id);

      if (response) {
        AppToast({
          type: "success",
          message: "Payment deleted successfully",
          duration: 4000,
          position: "top-right",
        });

        // Check if we need to go back a page
        if (data && data.content.length === 1 && currentPage > 1) {
          updateUrlWithPage(currentPage - 1);
        } else {
          await loadPayments();
        }
      }
    } catch (error) {
      console.error("Error deleting payment:", error);
      toast.error("Failed to delete payment");
    } finally {
      setDeleteState((prev) => ({ ...prev, isDeleting: false }));
      closeDeleteModal();
    }
  };

  // Reset filters
  const handleResetFilters = () => {
    setStatusFilter("ALL");
    setPaymentMethodFilter("ALL");
    setSearchQuery("");
    updateUrlWithPage(1, true);
  };

  return (
    <div className="flex flex-1 flex-col gap-4 px-2">
      <div className="space-y-4">
        <CardHeaderSection
          breadcrumbs={[
            { label: "Dashboard", href: ROUTES.DASHBOARD.INDEX },
            { label: "Payment Management", href: "" },
          ]}
          title="Payment Management"
          searchValue={searchQuery}
          searchPlaceholder="Search payments..."
          buttonIcon={<Plus className="w-4 h-4" />}
          buttonText="New Payment"
          onSearchChange={handleSearchChange}
          openModal={() => {
            setModalState({
              isOpen: true,
              paymentId: "",
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
                onValueChange={(value) => setStatusFilter(value as string)}
              />
              <CustomSelect
                options={PAYMENT_METHOD_FILTER_OPTIONS}
                value={paymentMethodFilter}
                placeholder="Payment Method"
                onValueChange={(value) =>
                  setPaymentMethodFilter(value as string)
                }
              />
            </div>
          </div>
        </CardHeaderSection>

        <div className="space-y-4">
          <DataTableWithPagination
            data={data?.content || []}
            columns={columns}
            loading={isLoading}
            emptyMessage="No payments found"
            getRowKey={(payment) =>
              payment.id?.toString() || payment.referenceNumber
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
      <PaymentModal
        isOpen={modalState.isOpen}
        onClose={closeModal}
        isSubmitting={modalState.isSubmitting}
        onSave={handleSubmit}
        paymentId={modalState.paymentId}
        mode={modalState.mode}
      />

      {/* Detail Modal */}
      <PaymentDetailModal
        isOpen={detailModalState.isOpen}
        onClose={closeDetailModal}
        paymentId={detailModalState.paymentId}
      />

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmationModal
        isOpen={deleteState.isOpen}
        onClose={closeDeleteModal}
        onDelete={handleDelete}
        title="Delete Payment"
        description="Are you sure you want to delete this payment?"
        itemName={
          deleteState.payment
            ? `${deleteState.payment.referenceNumber || "Payment"}`
            : "---"
        }
        isSubmitting={deleteState.isDeleting}
      />
    </div>
  );
}
