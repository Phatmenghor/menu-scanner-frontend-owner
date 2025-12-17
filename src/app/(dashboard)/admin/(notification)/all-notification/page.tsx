"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Plus } from "lucide-react";
import { useDebounce } from "@/utils/debounce/debounce";
import { ROUTES } from "@/constants/app-routes/routes";
import { ModalMode } from "@/constants/app-resource/status/status";
import { CardHeaderSection } from "@/components/layout/card-header-section";
import { DeleteConfirmationModal } from "@/components/shared/modal/delete-confirmation-modal";
import { DataTableWithPagination } from "@/components/shared/common/data-table";
import { showToast } from "@/components/shared/common/show-toast";
import { usePagination } from "@/redux/store/use-pagination";
import { useNotificationState } from "@/redux/features/notification/store/state/notification-state";
import { NotificationResponseModel } from "@/redux/features/notification/store/models/response/notification-response";
import {
  deleteNotificationService,
  fetchAllNotificationService,
} from "@/redux/features/notification/store/thunks/notification-thunks";
import { allNotificationTableColumns } from "@/redux/features/notification/table/all-notification-table";
import { AllNotificationDetailModal } from "@/redux/features/notification/components/all-notification-detail-modal";
import {
  setPageNo,
  setSearchFilter,
} from "@/redux/features/notification/store/slice/notification-slice";

export default function AllNotificationPage() {
  const searchParams = useSearchParams();

  // Redux state
  const {
    notificationState,
    notificationData,
    notificationContent,
    unReadCount,
    unSeenCount,
    isLoading,
    filters,
    operations,
    pagination,
    dispatch,
  } = useNotificationState();

  // Local UI state for modals only
  const [modalState, setModalState] = useState({
    isOpen: false,
    mode: ModalMode.CREATE_MODE,
    notificationId: "",
  });

  const [detailModalState, setDetailModalState] = useState({
    isOpen: false,
    notificationId: "",
  });

  const [deleteState, setDeleteState] = useState({
    isOpen: false,
    notification: null as NotificationResponseModel | null,
  });

  const debouncedSearch = useDebounce(filters.search, 400);

  const { updateUrlWithPage, handlePageChange } = usePagination({
    baseRoute: ROUTES.DASHBOARD.ALL_NOTIFICATION,
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

  // Fetch notification when filters change
  useEffect(() => {
    dispatch(
      fetchAllNotificationService({
        search: debouncedSearch,
        pageNo: filters.pageNo,
      })
    );
  }, [dispatch, debouncedSearch, filters.pageNo]);

  // Event handlers
  const handleCreateProvince = () => {
    setModalState({
      isOpen: true,
      mode: ModalMode.CREATE_MODE,
      notificationId: "",
    });
  };

  const handleNotificationViewDetail = (
    notification: NotificationResponseModel
  ) => {
    setDetailModalState({
      isOpen: true,
      notificationId: notification.id || "",
    });
  };

  const handleDeleteNotification = (
    notification: NotificationResponseModel
  ) => {
    setDeleteState({
      isOpen: true,
      notification: notification,
    });
  };

  const tableHandlers = useMemo(
    () => ({
      handleNotificationViewDetail,
      handleDeleteNotification,
    }),
    []
  );

  const columns = useMemo(
    () =>
      allNotificationTableColumns({
        data: notificationData,
        handlers: tableHandlers,
      }),
    [notificationState, tableHandlers]
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setSearchFilter(e.target.value));
  };

  const handlePageChangeWrapper = (page: number) => {
    handlePageChange(page);
  };

  const handleDelete = async () => {
    if (!deleteState.notification?.id) return;

    try {
      await dispatch(
        deleteNotificationService(deleteState.notification.id)
      ).unwrap();

      showToast.success(
        `Notification "${
          deleteState.notification.title ?? ""
        }" deleted successfully`
      );

      closeDeleteModal();

      // Navigate to previous page if this was the last item
      if (notificationContent.length === 1 && pagination.currentPage > 1) {
        const newPage = pagination.currentPage - 1;
        dispatch(setPageNo(newPage));
        updateUrlWithPage(newPage);
      }
    } catch (error: any) {
      showToast.error(error || "Failed to delete notification");
    }
  };

  const closeModal = () => {
    setModalState({
      isOpen: false,
      mode: ModalMode.CREATE_MODE,
      notificationId: "",
    });
  };

  const closeDetailModal = () => {
    setDetailModalState({
      isOpen: false,
      notificationId: "",
    });
  };

  const closeDeleteModal = () => {
    setDeleteState({
      isOpen: false,
      notification: null,
    });
  };

  return (
    <div className="flex flex-1 flex-col gap-4 px-2">
      <div className="space-y-4">
        <CardHeaderSection
          breadcrumbs={[
            { label: "Dashboard", href: ROUTES.DASHBOARD.INDEX },
            { label: "All Notification", href: "" },
          ]}
          title="All Notification"
          searchValue={filters.search}
          searchPlaceholder="Search all Notification..."
          buttonTooltip="Create a new Notification"
          buttonIcon={<Plus className="w-3 h-3" />}
          buttonText="New"
          onSearchChange={handleSearchChange}
          openModal={handleCreateProvince}
        ></CardHeaderSection>

        {/* Data Table with Your Custom Pagination */}
        <DataTableWithPagination
          data={notificationContent}
          columns={columns}
          loading={isLoading}
          emptyMessage="No Notification found"
          getRowKey={(notification) => notification.id}
          currentPage={filters.pageNo}
          totalPages={pagination.totalPages}
          onPageChange={handlePageChangeWrapper}
        />
      </div>

      {/* Modals Notication platform Detail */}
      <AllNotificationDetailModal
        notificationId={detailModalState.notificationId}
        isOpen={detailModalState.isOpen}
        onClose={closeDetailModal}
      />

      {/* Modals Delete notification platform */}
      <DeleteConfirmationModal
        isOpen={deleteState.isOpen}
        onClose={closeDeleteModal}
        onDelete={handleDelete}
        title="Delete Notification"
        description={`Are you sure you want to delete this notification ${
          deleteState.notification?.title || ""
        }?`}
        itemName={deleteState.notification?.title || ""}
        isSubmitting={operations.isDeleting}
      />
    </div>
  );
}
