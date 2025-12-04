"use client";

import { useState, useCallback, useEffect, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";

import { usePagination } from "@/hooks/use-pagination";
import { useDebounce } from "@/utils/debounce/debounce";
import { ROUTES } from "@/constants/AppRoutes/routes";
import {
  ModalMode,
  Status,
  BusinessUserRole,
  BusinessUserType,
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
import { UserFormData } from "@/models/dashboard/user/plateform-user/user.schema";

import { CardHeaderSection } from "@/components/layout/card-header-section";
import { CustomSelect } from "@/components/shared/common/custom-select";
import { DataTableWithPagination } from "@/components/shared/common/data-table";
import { CustomPagination } from "@/components/shared/common/custom-pagination";
import ModalBusinessUser from "@/components/shared/modal/business-user-modal";
import ResetPasswordModal from "@/components/shared/modal/reset-password-modal";
import { DeleteConfirmationModal } from "@/components/shared/modal/delete-confirmation-modal";
import { ConfirmDialog } from "@/components/shared/dialog/dialog-confirm";
import { AppToast } from "@/components/shared/toast/app-toast";
import { UserDetailModal } from "@/components/dashboard/plate-form-user/user-detail-modal";
import { STATUS_FILTER } from "@/constants/AppResource/status/filter-status";
import { createBusinessUserTableColumns } from "@/constants/AppResource/table/user/business-table";

export default function BusinessUserPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [data, setData] = useState<AllUserResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Edit modal state (only update mode)
  const [editModalState, setEditModalState] = useState<{
    isOpen: boolean;
    userId?: string;
    isSubmitting: boolean;
    error: string | null;
  }>({
    isOpen: false,
    userId: undefined,
    isSubmitting: false,
    error: null,
  });

  // Detail modal state
  const [detailModalState, setDetailModalState] = useState<{
    isOpen: boolean;
    user: UserModel | null;
  }>({
    isOpen: false,
    user: null,
  });

  // Reset password modal state
  const [resetPasswordState, setResetPasswordState] = useState<{
    isOpen: boolean;
    userPlatformId: string;
    userName: string;
  }>({
    isOpen: false,
    userPlatformId: "",
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

  // Toggle status modal state
  const [toggleStatusState, setToggleStatusState] = useState<{
    isOpen: boolean;
    user: UserModel | null;
    isToggling: boolean;
  }>({
    isOpen: false,
    user: null,
    isToggling: false,
  });

  // Filters
  const [statusFilter, setStatusFilter] = useState<Status>(Status.ACTIVE);

  // Debounced search query
  const debouncedSearchQuery = useDebounce(searchQuery, 400);
  const searchParams = useSearchParams();

  const { currentPage, updateUrlWithPage, handlePageChange } = usePagination({
    baseRoute: ROUTES.DASHBOARD.BUSINESS_USER,
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
        roles: [
          BusinessUserRole.BUSINESS_OWNER,
          BusinessUserRole.BUSINESS_MANAGER,
          BusinessUserRole.BUSINESS_STAFF,
        ],
        userType: BusinessUserType.BUSINESS_USER,
        accountStatus: statusFilter,
        pageSize: 10,
      });
      setData(response);
    } catch (error: any) {
      console.log("Failed to fetch business users: ", error);
      toast.error("Failed to load business users");
    } finally {
      setIsLoading(false);
    }
  }, [debouncedSearchQuery, statusFilter, currentPage]);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  // Handler functions for table actions
  const handleEditUser = useCallback((user: UserModel) => {
    setEditModalState({
      isOpen: true,
      userId: user?.id,
      isSubmitting: false,
      error: null,
    });
  }, []);

  const handleViewUserDetail = useCallback((user: UserModel) => {
    setDetailModalState({
      isOpen: true,
      user: user,
    });
  }, []);

  const handleResetPassword = useCallback((user: UserModel) => {
    setResetPasswordState({
      isOpen: true,
      userPlatformId: user.id || "",
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

  const handleToggleStatus = useCallback((user: UserModel) => {
    setToggleStatusState({
      isOpen: true,
      user: user,
      isToggling: false,
    });
  }, []);

  // Memoized table handlers
  const tableHandlers = useMemo(
    () => ({
      handleEditUser,
      handleViewUserDetail,
      handleResetPassword,
      handleDeleteUser,
    }),
    [
      handleEditUser,
      handleViewUserDetail,
      handleResetPassword,
      handleDeleteUser,
    ]
  );

  // Optimized table columns
  const columns = useMemo(
    () =>
      createBusinessUserTableColumns({
        data,
        handlers: tableHandlers,
        isSubmitting:
          editModalState.isSubmitting || toggleStatusState.isToggling,
      }),
    [
      data?.pageNo,
      data?.pageSize,
      data?.content?.length,
      tableHandlers,
      editModalState.isSubmitting,
      toggleStatusState.isToggling,
    ]
  );

  // Search change handler
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  // Filter handlers
  const handleStatusChange = (status: Status) => {
    setStatusFilter(status);
  };

  // Close modal handlers
  const closeEditModal = () => {
    setEditModalState({
      isOpen: false,
      userId: undefined,
      isSubmitting: false,
      error: null,
    });
  };

  const closeDetailModal = () => {
    setDetailModalState({
      isOpen: false,
      user: null,
    });
  };

  const closeResetPasswordModal = () => {
    setResetPasswordState({
      isOpen: false,
      userPlatformId: "",
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

  const closeToggleStatusModal = () => {
    setToggleStatusState({
      isOpen: false,
      user: null,
      isToggling: false,
    });
  };

  // Handle form submission (update only)
  const handleUpdateUser = async (formData: UserFormData): Promise<void> => {
    try {
      setEditModalState((prev) => ({
        ...prev,
        isSubmitting: true,
        error: null,
      }));

      if (!formData.id) {
        throw new Error("User ID is required for update");
      }

      const updatePayload: UpdateUserRequest = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        phoneNumber: formData.phoneNumber,
        accountStatus: formData.accountStatus,
        profileImageUrl: formData.profileImageUrl,
        address: formData.address,
        businessId: formData.businessId,
        roles: formData.roles,
        notes: formData.notes,
        position: formData.position,
      };

      const response = await updateUserService(formData.id, updatePayload);
      if (response) {
        // Optimistic update
        setData((prev) =>
          prev
            ? {
                ...prev,
                content: prev.content.map((user) =>
                  user.id === formData.id ? response : user
                ),
              }
            : prev
        );

        AppToast({
          type: "success",
          message: `Business user "${response.email}" updated successfully`,
          duration: 4000,
          position: "top-right",
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
          message: `Business user "${
            deleteState.user.fullName ?? deleteState.user.email ?? ""
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

        closeDeleteModal();
      }
    } catch (error) {
      console.error("Error deleting business user:", error);
      toast.error("Failed to delete business user");
    } finally {
      setDeleteState((prev) => ({ ...prev, isDeleting: false }));
    }
  };

  // Handle status toggle
  const handleStatusToggleConfirm = async () => {
    if (!toggleStatusState.user?.id) return;

    setToggleStatusState((prev) => ({ ...prev, isToggling: true }));

    try {
      const newStatus =
        toggleStatusState.user?.accountStatus === Status.ACTIVE
          ? Status.INACTIVE
          : Status.ACTIVE;

      const response = await updateUserService(toggleStatusState.user.id, {
        accountStatus: newStatus,
      });

      if (response) {
        // Optimistic update
        setData((prev) =>
          prev
            ? {
                ...prev,
                content: prev.content.map((user) =>
                  user.id === toggleStatusState.user?.id ? response : user
                ),
              }
            : prev
        );

        AppToast({
          type: "success",
          message: `Business user status updated successfully`,
          duration: 4000,
          position: "top-right",
        });

        closeToggleStatusModal();
      }
    } catch (error: any) {
      toast.error(
        error?.message || "An error occurred while updating user status"
      );
    } finally {
      setToggleStatusState((prev) => ({ ...prev, isToggling: false }));
    }
  };

  return (
    <div className="flex flex-1 flex-col gap-4 px-2">
      <div className="space-y-4">
        <CardHeaderSection
          breadcrumbs={[
            { label: "Dashboard", href: ROUTES.DASHBOARD.INDEX },
            { label: "Business Users", href: "" },
          ]}
          title="Business Users"
          searchValue={searchQuery}
          searchPlaceholder="Search business users..."
          onSearchChange={handleSearchChange}
        >
          <div className="flex items-center gap-3">
            <CustomSelect
              options={STATUS_FILTER}
              value={statusFilter}
              placeholder="Select Status"
              onValueChange={(value) => handleStatusChange(value as Status)}
            />
          </div>
        </CardHeaderSection>

        <div className="space-y-4">
          <DataTableWithPagination
            data={data?.content || []}
            columns={columns}
            loading={isLoading}
            emptyMessage="No business users found"
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

      {/* Edit User Modal */}
      <ModalBusinessUser
        isOpen={editModalState.isOpen}
        onClose={closeEditModal}
        isSubmitting={editModalState.isSubmitting}
        onSave={handleUpdateUser}
        userId={editModalState.userId}
        mode={ModalMode.UPDATE_MODE}
        error={editModalState.error}
      />

      {/* User Detail Modal */}
      <UserDetailModal
        userId={detailModalState.user?.id}
        isOpen={detailModalState.isOpen}
        onClose={closeDetailModal}
      />

      {/* Reset Password Modal */}
      <ResetPasswordModal
        isOpen={resetPasswordState.isOpen}
        userName={resetPasswordState.userName}
        onClose={closeResetPasswordModal}
        userId={resetPasswordState.userPlatformId}
      />

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmationModal
        isOpen={deleteState.isOpen}
        onClose={closeDeleteModal}
        onDelete={handleDelete}
        title="Delete Business User"
        description="Are you sure you want to delete this business user?"
        itemName={deleteState.user?.fullName || deleteState.user?.email}
        isSubmitting={deleteState.isDeleting}
      />
    </div>
  );
}
