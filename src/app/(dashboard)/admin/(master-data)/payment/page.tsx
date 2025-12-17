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
import UserPlatformModal from "@/redux/features/auth/components/user-platform-modal";
import { UserPlatformDetailModal } from "@/redux/features/auth/components/user-platform-detail-modal";
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
import { fi } from "date-fns/locale";
import { BusinessDetailModal } from "@/redux/features/master-data/components/business-detail-modal";
import BusinessModal from "@/redux/features/master-data/components/business-modal";
import { usePaymentState } from "@/redux/features/master-data/store/state/payment-state";
import { PaymentResponseModel } from "@/redux/features/master-data/store/models/response/payment-response";
import {
  deletePaymentService,
  fetchAllPaymentService,
} from "@/redux/features/master-data/store/thunks/payment-thunks";
import { paymentTableColumns } from "@/redux/features/master-data/table/payment-table";
import { PaymentDetailModal } from "@/redux/features/master-data/components/payment-detail-modal";
import PaymentModal from "@/redux/features/master-data/components/payment-modal";

export default function PaymentPage() {
  const searchParams = useSearchParams();

  // Redux state
  const {
    paymentState,
    paymentData,
    paymentContent,
    isLoading,
    filters,
    operations,
    pagination,
    dispatch,
  } = usePaymentState();

  // Local UI state for modals only
  const [modalState, setModalState] = useState({
    isOpen: false,
    mode: ModalMode.CREATE_MODE,
    paymentId: "",
  });

  const [detailModalState, setDetailModalState] = useState({
    isOpen: false,
    paymentId: "",
  });

  const [deleteState, setDeleteState] = useState({
    isOpen: false,
    payment: null as PaymentResponseModel | null,
  });

  const debouncedSearch = useDebounce(filters.search, 400);

  const { updateUrlWithPage, handlePageChange } = usePagination({
    baseRoute: ROUTES.DASHBOARD.PAYMENT,
    defaultPageSize: 15,
  });

  // Initialize URL and Redux state on mount
  useEffect(() => {
    const pageParam = searchParams.get("pageNo");
    const pageFromUrl = pageParam ? parseInt(pageParam, 10) : 1;

    if (pageFromUrl !== pagination.currentPage) {
      dispatch(setPageNo(pageFromUrl));
    }
  }, [searchParams, pagination.currentPage, dispatch]);

  // Fetch payment when filters change
  useEffect(() => {
    dispatch(
      fetchAllPaymentService({
        search: debouncedSearch,
        pageNo: pagination.currentPage,
      })
    );
  }, [dispatch, debouncedSearch, pagination.currentPage]);

  // Event handlers
  const handleCreatePayment = () => {
    setModalState({
      isOpen: true,
      mode: ModalMode.CREATE_MODE,
      paymentId: "",
    });
  };

  const handleEditPayment = (payment: PaymentResponseModel) => {
    setModalState({
      isOpen: true,
      mode: ModalMode.UPDATE_MODE,
      paymentId: payment?.id || "",
    });
  };

  const handlePaymentViewDetail = (payment: PaymentResponseModel) => {
    setDetailModalState({
      isOpen: true,
      paymentId: payment.id || "",
    });
  };

  const handleDeletePayment = (payment: PaymentResponseModel) => {
    setDeleteState({
      isOpen: true,
      payment: payment,
    });
  };

  const tableHandlers = useMemo(
    () => ({
      handleEditPayment,
      handlePaymentViewDetail,
      handleDeletePayment,
    }),
    []
  );

  const columns = useMemo(
    () =>
      paymentTableColumns({
        data: paymentData,
        handlers: tableHandlers,
      }),
    [paymentState, tableHandlers]
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setSearchFilter(e.target.value));
  };

  const handlePageChangeWrapper = (page: number) => {
    dispatch(setPageNo(page));
    handlePageChange(page);
  };

  const handleDelete = async () => {
    if (!deleteState.payment?.id) return;

    try {
      await dispatch(deletePaymentService(deleteState.payment.id)).unwrap();

      showToast.success(
        `Payment "${deleteState.payment.amount ?? ""}" deleted successfully`
      );

      closeDeleteModal();

      // Navigate to previous page if this was the last item
      if (paymentContent.length === 1 && pagination.currentPage > 1) {
        const newPage = pagination.currentPage - 1;
        dispatch(setPageNo(newPage));
        updateUrlWithPage(newPage);
      }
    } catch (error: any) {
      showToast.error(error || "Failed to delete payment. Please try again.");
    }
  };

  const closeModal = () => {
    setModalState({
      isOpen: false,
      mode: ModalMode.CREATE_MODE,
      paymentId: "",
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
    });
  };

  return (
    <div className="flex flex-1 flex-col gap-4 px-2">
      <div className="space-y-4">
        <CardHeaderSection
          breadcrumbs={[
            { label: "Dashboard", href: ROUTES.DASHBOARD.INDEX },
            { label: "Payment", href: "" },
          ]}
          title="Payment"
          searchValue={filters.search}
          searchPlaceholder="Search payment..."
          buttonIcon={<Plus className="w-3 h-3" />}
          buttonText="New"
          onSearchChange={handleSearchChange}
          openModal={handleCreatePayment}
        ></CardHeaderSection>

        {/* Data Table with Pagination */}
        <DataTableWithPagination
          data={paymentContent}
          columns={columns}
          loading={isLoading}
          emptyMessage="No payment found"
          getRowKey={(user) => user.id}
          currentPage={pagination.currentPage}
          totalPages={pagination.totalPages}
          onPageChange={handlePageChangeWrapper}
        />
      </div>

      {/* Modals Add/Edit */}
      <PaymentModal
        isOpen={modalState.isOpen}
        onClose={closeModal}
        paymentId={modalState.paymentId}
        mode={modalState.mode}
      />

      {/* Modals business platform Detail */}
      <PaymentDetailModal
        paymentId={detailModalState.paymentId}
        isOpen={detailModalState.isOpen}
        onClose={closeDetailModal}
      />

      {/* Modals Delete name platform */}
      <DeleteConfirmationModal
        isOpen={deleteState.isOpen}
        onClose={closeDeleteModal}
        onDelete={handleDelete}
        title="Delete Payment"
        description={`Are you sure you want to delete this payment ${deleteState.payment?.amount}?`}
        itemName={deleteState.payment?.amount?.toString() || ""}
        isSubmitting={operations.isDeleting}
      />
    </div>
  );
}
