"use client";

import { useState, useCallback, useEffect, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { usePagination } from "@/hooks/use-pagination";
import { useDebounce } from "@/utils/debounce/debounce";
import { ROUTES } from "@/constants/AppRoutes/routes";
import {
  AccountStatus,
  Status,
  UserGropeType,
} from "@/constants/AppResource/status/status";
import {
  AllUserResponse,
  UserModel,
} from "@/models/dashboard/user/plateform-user/user.response";
import { UpdateUserRequest } from "@/models/dashboard/user/plateform-user/user.request";
import {
  deletedUserService,
  getAllUserService,
  updateUserService,
} from "@/services/dashboard/user/plateform-user/plateform-user.service";

import { CardHeaderSection } from "@/components/layout/card-header-section";
import { CustomSelect } from "@/components/shared/common/custom-select";
import { DataTable } from "@/components/shared/common/data-table";
import { CustomPagination } from "@/components/shared/common/custom-pagination";
import ModalCustomerUser, {
  UpdateCustomerUserRequest,
} from "@/components/shared/modal/cusomer-user-modal";
import ResetPasswordModal from "@/components/shared/modal/reset-password-modal";
import { DeleteConfirmationDialog } from "@/components/shared/dialog/dialog-delete";
import { AppToast } from "@/components/shared/toast/app-toast";
import { UserDetailModal } from "@/components/dashboard/plate-form-user/user-detail-modal";
import { STATUS_FILTER } from "@/constants/AppResource/status/filter-status";
import { createCustomerUserTableColumns } from "@/constants/AppResource/table/user/customer-table";

export default function CustomerUserPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [data, setData] = useState<AllUserResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Edit modal state - simplified to only handle editing
  const [editModalState, setEditModalState] = useState<{
    isOpen: boolean;
    userId: string;
    isSubmitting: boolean;
    error: string | null;
  }>({
    isOpen: false,
    userId: "",
    isSubmitting: false,
    error: null,
  });

  // Detail modal state - only store userId
  const [detailModalState, setDetailModalState] = useState<{
    isOpen: boolean;
    userId: string;
  }>({
    isOpen: false,
    userId: "",
  });

  // Reset password modal state
  const [resetPasswordState, setResetPasswordState] = useState<{
    isOpen: boolean;
    userId: string;
    userName: string;
  }>({
    isOpen: false,
    userId: "",
    userName: "",
  });

  // Delete modal state
  const [deleteState, setDeleteState] = useState<{
    isOpen: boolean;
    user: UserModel | null;
    isDeleting: boolean;
  }>({
    isOpen: false,
    user: null,
    isDeleting: false,
  });

  // Filters
  const [accountStatusFilter, setAccountStatusFilter] = useState<AccountStatus>(
    AccountStatus.All
  );

  // Debounced search query
  const debouncedSearchQuery = useDebounce(searchQuery, 400);
  const searchParams = useSearchParams();

  const { currentPage, updateUrlWithPage, handlePageChange } = usePagination({
    baseRoute: ROUTES.DASHBOARD.CUSTOMER_USER,
    defaultPageSize: 10,
  });

  // Initialize URL with page parameter
  useEffect(() => {
    const pageParam = searchParams.get("pageNo");
    if (!pageParam) {
      updateUrlWithPage(1, true);
    }
  }, [searchParams, updateUrlWithPage]);

  // Load users
  const loadUsers = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await getAllUserService({
        search: debouncedSearchQuery,
        pageNo: currentPage,
        pageSize: 10,
        userType: UserGropeType.CUSTOMER,
        accountStatus:
          accountStatusFilter === AccountStatus.All
            ? undefined
            : accountStatusFilter,
      });
      setData(response);
    } catch (error: any) {
      console.log("Failed to fetch customer users: ", error);
      toast.error("Failed to load customer users");
    } finally {
      setIsLoading(false);
    }
  }, [debouncedSearchQuery, accountStatusFilter, currentPage]);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  // Handler functions for table actions - removed create, kept edit
  const handleEditUser = useCallback((user: UserModel) => {
    setEditModalState({
      isOpen: true,
      userId: user?.id || "",
      isSubmitting: false,
      error: null,
    });
  }, []);

  const handleViewUserDetail = useCallback((user: UserModel) => {
    setDetailModalState({
      isOpen: true,
      userId: user.id || "",
    });
  }, []);

  const handleResetPassword = useCallback((user: UserModel) => {
    setResetPasswordState({
      isOpen: true,
      userId: user.id || "",
      userName: user.fullName || user.email || "",
    });
  }, []);

  const handleDeleteUser = useCallback((user: UserModel) => {
    setDeleteState({
      isOpen: true,
      user: user,
      isDeleting: false,
    });
  }, []);

  // Direct status toggle without confirmation dialog
  const handleToggleStatus = useCallback(async (user: UserModel) => {
    if (!user?.id) return;

    try {
      const newStatus =
        user?.accountStatus === Status.ACTIVE ? Status.INACTIVE : Status.ACTIVE;

      const response = await updateUserService(user.id, {
        accountStatus: newStatus,
      });

      if (response) {
        // Optimistic update
        setData((prev) =>
          prev
            ? {
                ...prev,
                content: prev.content.map((u) =>
                  u.id === user.id ? response : u
                ),
              }
            : prev
        );

        AppToast({
          type: "success",
          message: `Customer status updated successfully`,
        });
      } else {
        AppToast({
          type: "error",
          message: `Failed to update customer status`,
        });
      }
    } catch (error: any) {
      toast.error(
        error?.message || "An error occurred while updating customer status"
      );
    }
  }, []);

  // Memoized table handlers
  const tableHandlers = useMemo(
    () => ({
      handleEditUser,
      handleViewUserDetail,
      handleResetPassword,
      handleDeleteUser,
      handleToggleStatus,
    }),
    [
      handleEditUser,
      handleViewUserDetail,
      handleResetPassword,
      handleDeleteUser,
      handleToggleStatus,
    ]
  );

  // Optimized table columns
  const columns = useMemo(
    () =>
      createCustomerUserTableColumns({
        data,
        handlers: tableHandlers,
      }),
    [data?.pageNo, data?.pageSize, data?.content?.length, tableHandlers]
  );

  // Search change handler
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  // Filter handlers
  const handleStatusChange = (status: AccountStatus) => {
    setAccountStatusFilter(status);
  };

  // Close modal handlers
  const closeEditModal = () => {
    setEditModalState({
      isOpen: false,
      userId: "",
      isSubmitting: false,
      error: null,
    });
  };

  const closeDetailModal = () => {
    setDetailModalState({
      isOpen: false,
      userId: "",
    });
  };

  const closeResetPasswordModal = () => {
    setResetPasswordState({
      isOpen: false,
      userId: "",
      userName: "",
    });
  };

  const closeDeleteModal = () => {
    setDeleteState({
      isOpen: false,
      user: null,
      isDeleting: false,
    });
  };

  // Handle form submission - only update mode
  const handleUpdateSubmit = async (
    formData: UpdateCustomerUserRequest
  ): Promise<void> => {
    try {
      setEditModalState((prev) => ({
        ...prev,
        isSubmitting: true,
        error: null,
      }));

      if (!editModalState.userId) {
        throw new Error("User ID is required for update");
      }

      // Map form data to service request format
      const updatePayload: UpdateUserRequest = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        phoneNumber: formData.phoneNumber,
        accountStatus: formData.accountStatus,
        profileImageUrl: formData.profileImageUrl,
        notes: formData.notes,
      };

      const response = await updateUserService(
        editModalState.userId,
        updatePayload
      );

      if (response) {
        // Optimistic update
        setData((prev) =>
          prev
            ? {
                ...prev,
                content: prev.content.map((user) =>
                  user.id === editModalState.userId ? response : user
                ),
              }
            : prev
        );

        AppToast({
          type: "success",
          message: `Customer "${
            response.username || response.email
          }" updated successfully`,
        });

        closeEditModal();
      }
    } catch (error: any) {
      const errorMessage = error.message || "An unexpected error occurred";
      setEditModalState((prev) => ({
        ...prev,
        error: errorMessage,
      }));

      toast.error(errorMessage);
    } finally {
      setEditModalState((prev) => ({ ...prev, isSubmitting: false }));
    }
  };

  // Handle delete
  const handleDelete = async () => {
    if (!deleteState.user?.id) return;

    setDeleteState((prev) => ({ ...prev, isDeleting: true }));

    try {
      const response = await deletedUserService(deleteState.user.id);

      if (response) {
        AppToast({
          type: "success",
          message: `Customer "${
            deleteState.user.fullName ?? ""
          }" deleted successfully`,
          duration: 4000,
          position: "top-right",
        });

        // Check if we need to go back a page
        if (data && data.content.length === 1 && currentPage > 1) {
          updateUrlWithPage(currentPage - 1);
        } else {
          await loadUsers();
        }
      }
    } catch (error) {
      console.error("Error deleting customer:", error);
      toast.error("Failed to delete customer");
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
            { label: "Customer Management", href: "" },
          ]}
          title="Customer Users"
          searchValue={searchQuery}
          searchPlaceholder="Search customers..."
          onSearchChange={handleSearchChange}
          // Remove openModal prop since we no longer have create functionality
        >
          <div className="flex items-center gap-3">
            <CustomSelect
              options={STATUS_FILTER}
              value={accountStatusFilter}
              placeholder="Select Status"
              onValueChange={(value) =>
                handleStatusChange(value as AccountStatus)
              }
            />
          </div>
        </CardHeaderSection>

        <div className="space-y-4">
          <DataTable
            data={data?.content || []}
            columns={columns}
            loading={isLoading}
            emptyMessage="No customers found"
            getRowKey={(user) => user.id?.toString() || user.email}
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

      {/* Edit Modal - Only for updates */}
      <ModalCustomerUser
        isOpen={editModalState.isOpen}
        onClose={closeEditModal}
        isSubmitting={editModalState.isSubmitting}
        onSave={handleUpdateSubmit}
        userId={editModalState.userId}
        error={editModalState.error}
      />

      {/* User Detail Modal - Only pass userId */}
      <UserDetailModal
        userId={detailModalState.userId}
        isOpen={detailModalState.isOpen}
        onClose={closeDetailModal}
      />

      {/* Reset Password Modal - Only pass userId */}
      <ResetPasswordModal
        isOpen={resetPasswordState.isOpen}
        userName={resetPasswordState.userName}
        onClose={closeResetPasswordModal}
        userId={resetPasswordState.userId}
      />

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmationDialog
        isOpen={deleteState.isOpen}
        onClose={closeDeleteModal}
        onDelete={handleDelete}
        title="Delete Customer"
        description="Are you sure you want to delete this customer? This action cannot be undone."
        itemName={deleteState.user?.fullName || deleteState.user?.email}
        isSubmitting={deleteState.isDeleting}
      />
    </div>
  );
}
