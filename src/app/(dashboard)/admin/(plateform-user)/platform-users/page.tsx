"use client";

import { useState, useCallback, useEffect, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { Plus } from "lucide-react";

import { usePagination } from "@/hooks/use-pagination";
import { useDebounce } from "@/utils/debounce/debounce";
import { ROUTES } from "@/constants/AppRoutes/routes";
import {
  AccountStatus,
  ModalMode,
  Status,
  UserRole,
  UserGropeType,
} from "@/constants/AppResource/status/status";
import {
  AllUserResponse,
  UserModel,
} from "@/models/dashboard/user/plateform-user/user.response";
import {
  CreateUserRequest,
  UpdateUserRequest,
} from "@/models/dashboard/user/plateform-user/user.request";
import {
  createUserService,
  deletedUserService,
  getAllUserService,
  updateUserService,
} from "@/services/dashboard/user/plateform-user/plateform-user.service";
import { UserFormData } from "@/models/dashboard/user/plateform-user/user.schema";

import { CardHeaderSection } from "@/components/layout/card-header-section";
import { CustomSelect } from "@/components/shared/common/custom-select";
import { DataTable } from "@/components/shared/common/data-table";
import { CustomPagination } from "@/components/shared/common/custom-pagination";
import UserPlatformModal from "@/components/shared/modal/user-platform-modal";
import ResetPasswordModal from "@/components/shared/modal/reset-password-modal";
import { DeleteConfirmationDialog } from "@/components/shared/dialog/dialog-delete";
import { AppToast } from "@/components/shared/toast/app-toast";
import { createUserPlatformTableColumns } from "@/constants/AppResource/table/user/user-platform-table";
import { UserDetailModal } from "@/components/dashboard/plate-form-user/user-detail-modal";
import {
  STATUS_FILTER,
  USER_PLATFORM_ROLE_FILTER,
} from "@/constants/AppResource/status/filter-status";

export default function UserPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [data, setData] = useState<AllUserResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Modal states
  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    mode: ModalMode;
    userId: string;
    isSubmitting: boolean;
    error: string | null;
  }>({
    isOpen: false,
    mode: ModalMode.CREATE_MODE,
    userId: "",
    isSubmitting: false,
    error: null,
  });

  // Detail modal state - only store userPlatformId
  const [detailModalState, setDetailModalState] = useState<{
    isOpen: boolean;
    userPlatformId: string;
  }>({
    isOpen: false,
    userPlatformId: "",
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

  // Filters
  const [accountStatusFilter, setAccountStatusFilter] = useState<AccountStatus>(
    AccountStatus.All
  );
  const [roleFilter, setRoleFilter] = useState<UserRole>(UserRole.All);

  // Debounced search query
  const debouncedSearchQuery = useDebounce(searchQuery, 400);
  const searchParams = useSearchParams();

  const { currentPage, updateUrlWithPage, handlePageChange } = usePagination({
    baseRoute: ROUTES.DASHBOARD.USERS,
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
        roles: roleFilter === UserRole.All ? [] : [roleFilter],
        userType: UserGropeType.PLATFORM_USER,
        accountStatus:
          accountStatusFilter === AccountStatus.All
            ? undefined
            : accountStatusFilter,
      });
      setData(response);
    } catch (error: any) {
      console.log("Failed to fetch users: ", error);
      toast.error("Failed to load users");
    } finally {
      setIsLoading(false);
    }
  }, [debouncedSearchQuery, accountStatusFilter, roleFilter, currentPage]);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  // Handler functions for table actions
  const handleCreateUser = useCallback(() => {
    setModalState({
      isOpen: true,
      mode: ModalMode.CREATE_MODE,
      userId: "",
      isSubmitting: false,
      error: null,
    });
  }, []);

  const handleEditUser = useCallback((user: UserModel) => {
    setModalState({
      isOpen: true,
      mode: ModalMode.UPDATE_MODE,
      userId: user?.id || "",
      isSubmitting: false,
      error: null,
    });
  }, []);

  const handleViewUserDetail = useCallback((user: UserModel) => {
    setDetailModalState({
      isOpen: true,
      userPlatformId: user.id || "",
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
          message: `User status updated successfully`,
          duration: 4000,
          position: "top-right",
        });
      } else {
        AppToast({
          type: "error",
          message: `Failed to update user status`,
          duration: 4000,
          position: "top-right",
        });
      }
    } catch (error: any) {
      toast.error(
        error?.message || "An error occurred while updating user status"
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
      createUserPlatformTableColumns({
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

  const handleRoleFilterChange = (userRole: UserRole) => {
    setRoleFilter(userRole);
  };

  // Close modal handlers
  const closeModal = () => {
    setModalState({
      isOpen: false,
      mode: ModalMode.CREATE_MODE,
      userId: "",
      isSubmitting: false,
      error: null,
    });
  };

  const closeDetailModal = () => {
    setDetailModalState({
      isOpen: false,
      userPlatformId: "",
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

  // Handle form submission with optimistic updates
  const handleSubmit = async (formData: UserFormData): Promise<void> => {
    try {
      setModalState((prev) => ({
        ...prev,
        isSubmitting: true,
        error: null,
      }));

      const isCreate = modalState.mode === ModalMode.CREATE_MODE;

      if (isCreate) {
        if (!formData.email || !formData.firstName || !formData.lastName) {
          throw new Error("Email, first name and last name are required");
        }

        const createPayload: CreateUserRequest = {
          userIdentifier: formData?.userIdentifier || "",
          password: formData.password!,
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          userType: formData.userType!,
          businessId: formData.businessId,
          phoneNumber: formData.phoneNumber,
          accountStatus: formData.accountStatus,
          profileImageUrl: formData.profileImageUrl,
          address: formData.address,
          roles: formData.roles,
          notes: formData.notes,
          position: formData.position,
        };

        const response = await createUserService(createPayload);
        if (response) {
          // Optimistic update
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
            message: `User "${
              response.username || formData.email
            }" created successfully`,
            duration: 4000,
            position: "top-right",
          });
        }
      } else {
        // Update mode
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
            message: `User "${
              response.username || response.email
            }" updated successfully`,
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
      setModalState((prev) => ({ ...prev, isSubmitting: false }));
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
          message: `User "${
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
      console.error("Error deleting user:", error);
      toast.error("Failed to delete user");
    } finally {
      setDeleteState((prev) => ({ ...prev, isDeleting: false }));
    }
  };

  return (
    <div className="flex flex-1 flex-col gap-4 px-2">
      <div className="space-y-4">
        <CardHeaderSection
          breadcrumbs={[
            { label: "Dashboard", href: ROUTES.DASHBOARD.INDEX },
            { label: "Platform Users Platform", href: "" },
          ]}
          title="Platform Users"
          searchValue={searchQuery}
          searchPlaceholder="Search users..."
          buttonIcon={<Plus className="w-3 h-3" />}
          buttonText="New User"
          onSearchChange={handleSearchChange}
          openModal={handleCreateUser}
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
            <CustomSelect
              options={USER_PLATFORM_ROLE_FILTER}
              value={roleFilter}
              placeholder="Select User Role"
              onValueChange={(value) =>
                handleRoleFilterChange(value as UserRole)
              }
            />
          </div>
        </CardHeaderSection>

        <div className="space-y-4">
          <DataTable
            data={data?.content || []}
            columns={columns}
            loading={isLoading}
            emptyMessage="No users found"
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

      {/* Create/Update Modal */}
      <UserPlatformModal
        isOpen={modalState.isOpen}
        onClose={closeModal}
        isSubmitting={modalState.isSubmitting}
        onSave={handleSubmit}
        userId={modalState.userId}
        mode={modalState.mode}
        error={modalState.error}
      />

      {/* User Detail Modal - Only pass userPlatformId */}
      <UserDetailModal
        userId={detailModalState.userPlatformId}
        isOpen={detailModalState.isOpen}
        onClose={closeDetailModal}
      />

      {/* Reset Password Modal - Only pass userPlatformId */}
      <ResetPasswordModal
        isOpen={resetPasswordState.isOpen}
        userName={resetPasswordState.userName}
        onClose={closeResetPasswordModal}
        userId={resetPasswordState.userPlatformId}
      />

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmationDialog
        isOpen={deleteState.isOpen}
        onClose={closeDeleteModal}
        onDelete={handleDelete}
        title="Delete User"
        description="Are you sure you want to delete this user?"
        itemName={deleteState.user?.fullName || deleteState.user?.email}
        isSubmitting={deleteState.isDeleting}
      />
    </div>
  );
}
