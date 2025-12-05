"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Plus } from "lucide-react";

import { usePagination } from "@/hooks/use-pagination";
import { useDebounce } from "@/utils/debounce/debounce";
import { ROUTES } from "@/constants/AppRoutes/routes";
import {
  AccountStatus,
  ModalMode,
  UserRole,
  UserGropeType,
} from "@/constants/AppResource/status/status";
import { UserModel } from "@/models/dashboard/user/plateform-user/user.response";
import { UserFormData } from "@/models/dashboard/user/plateform-user/user.schema";

import { CardHeaderSection } from "@/components/layout/card-header-section";
import { CustomSelect } from "@/components/shared/common/custom-select";
import ResetPasswordModal from "@/components/shared/modal/reset-password-modal";
import { DeleteConfirmationModal } from "@/components/shared/modal/delete-confirmation-modal";
import { AppToast } from "@/components/shared/common/app-toast";
import { userPlatformTableColumns } from "@/constants/AppResource/table/users/user-platform-table";
import {
  ACCOUNT_STATUS_FILTER,
  USER_PLATFORM_ROLE_FILTER,
} from "@/constants/AppResource/status/filter-status";

// Redux imports
import {
  useUsers,
  fetchUsers,
  createUser,
  updateUser,
  deleteUser,
  toggleUserStatus,
  setSearchFilter,
  setAccountStatusFilter,
  setRoleFilter,
  setPageNo,
  UpdateUserRequest,
  CreateUserRequest,
} from "@/store/features/users";
import { DataTableWithPagination } from "@/components/shared/common/data-table";
import UserCustomerModal from "@/components/dashboard/users/customer/user-customer-modal";
import { UserCustomerDetailModal } from "@/components/dashboard/users/customer/user-customer-detail-modal";

export default function UserPage() {
  const searchParams = useSearchParams();

  // Redux state
  const {
    userState,
    users,
    isLoading,
    filters,
    operations,
    pagination,
    dispatch,
  } = useUsers();

  // Local UI state for modals
  const [modalState, setModalState] = useState({
    isOpen: false,
    mode: ModalMode.CREATE_MODE,
    userId: "",
    error: null as string | null,
  });

  const [detailModalState, setDetailModalState] = useState({
    isOpen: false,
    userCustomerId: "",
  });

  const [resetPasswordState, setResetPasswordState] = useState({
    isOpen: false,
    userCustomerId: "",
    userName: "",
  });

  const [deleteState, setDeleteState] = useState({
    isOpen: false,
    user: null as UserModel | null,
  });

  const debouncedSearch = useDebounce(filters.search, 400);

  const { updateUrlWithPage, handlePageChange } = usePagination({
    baseRoute: ROUTES.DASHBOARD.CUSTOMER_USER,
    defaultPageSize: 10,
  });

  // Initialize URL on mount
  useEffect(() => {
    const pageParam = searchParams.get("pageNo");
    if (!pageParam) {
      updateUrlWithPage(1, true);
    }
  }, [searchParams, updateUrlWithPage]);

  // Fetch users when filters change
  useEffect(() => {
    dispatch(
      fetchUsers({
        search: debouncedSearch,
        pageNo: pagination.currentPage,
        roles: [UserRole.CUSTOMER],
        userTypes: [UserGropeType.CUSTOMER],
        accountStatus:
          filters.accountStatus === AccountStatus.ALL
            ? []
            : [filters.accountStatus],
      })
    );
  }, [
    dispatch,
    debouncedSearch,
    filters.accountStatus,
    filters.role,
    pagination.currentPage,
  ]);

  // Event handlers
  const handleCreateUser = () => {
    setModalState({
      isOpen: true,
      mode: ModalMode.CREATE_MODE,
      userId: "",
      error: null,
    });
  };

  const handleEditUser = (user: UserModel) => {
    setModalState({
      isOpen: true,
      mode: ModalMode.UPDATE_MODE,
      userId: user?.id || "",
      error: null,
    });
  };

  const handleViewDetail = (user: UserModel) => {
    setDetailModalState({
      isOpen: true,
      userCustomerId: user.id || "",
    });
  };

  const handleResetPassword = (user: UserModel) => {
    setResetPasswordState({
      isOpen: true,
      userCustomerId: user.id || "",
      userName: user.fullName || user.email || "",
    });
  };

  const handleDeleteUser = (user: UserModel) => {
    setDeleteState({
      isOpen: true,
      user: user,
    });
  };

  const handleToggleStatus = async (user: UserModel) => {
    if (!user?.id) return;

    try {
      await dispatch(toggleUserStatus(user)).unwrap();
      AppToast({
        type: "success",
        message: "User status updated successfully",
      });
    } catch (error: any) {
      AppToast({
        type: "error",
        message: error || "Failed to update user status",
      });
    }
  };

  const tableHandlers = useMemo(
    () => ({
      handleEditUser,
      handleViewUserDetail: handleViewDetail,
      handleResetPassword,
      handleDeleteUser,
      handleToggleStatus,
    }),
    []
  );

  const columns = useMemo(
    () =>
      userPlatformTableColumns({
        data: userState.data,
        handlers: tableHandlers,
      }),
    [userState.data, tableHandlers]
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setSearchFilter(e.target.value));
  };

  const handleStatusChange = (status: AccountStatus) => {
    dispatch(setAccountStatusFilter(status));
  };

  const handlePageChangeWrapper = (page: number) => {
    dispatch(setPageNo(page));
    handlePageChange(page);
  };

  const handleSubmit = async (formData: UserFormData): Promise<void> => {
    try {
      setModalState((prev) => ({ ...prev, error: null }));

      const isCreate = modalState.mode === ModalMode.CREATE_MODE;

      if (isCreate) {
        // Ensure all required fields are present (validated by schema)
        const createPayload: CreateUserRequest = {
          userIdentifier: formData.userIdentifier!,
          email: formData.email!,
          password: formData.password!,
          firstName: formData.firstName!,
          lastName: formData.lastName!,
          phoneNumber: formData.phoneNumber!,
          userType: formData.userType!,
          accountStatus: formData.accountStatus!,
          roles: formData.roles!,
          position: formData.position,
          address: formData.address,
          notes: formData.notes,
        };

        const response = await dispatch(createUser(createPayload)).unwrap();

        AppToast({
          type: "success",
          message: `User "${
            response.username || formData.email
          }" created successfully`,
        });

        closeModal();
      } else {
        // Update mode
        if (!formData.id) {
          throw new Error("User ID is required for update");
        }

        const updatePayload: UpdateUserRequest = {
          firstName: formData.firstName!,
          lastName: formData.lastName!,
          phoneNumber: formData.phoneNumber!,
          accountStatus: formData.accountStatus!,
          roles: formData.roles!,
          position: formData.position,
          address: formData.address,
          notes: formData.notes,
        };

        const response = await dispatch(
          updateUser({ userId: formData.id, userData: updatePayload })
        ).unwrap();

        AppToast({
          type: "success",
          message: `User "${
            response.username || response.email
          }" updated successfully`,
        });

        closeModal();
      }
    } catch (error: any) {
      const errorMessage = error || "An unexpected error occurred";
      setModalState((prev) => ({ ...prev, error: errorMessage }));
      AppToast({ type: "error", message: errorMessage });
      throw error;
    }
  };

  const handleDelete = async () => {
    if (!deleteState.user?.id) return;

    try {
      await dispatch(deleteUser(deleteState.user.id)).unwrap();

      AppToast({
        type: "success",
        message: `User "${
          deleteState.user.fullName ?? ""
        }" deleted successfully`,
      });

      closeDeleteModal();

      // Navigate to previous page if this was the last item
      if (users.length === 1 && pagination.currentPage > 1) {
        const newPage = pagination.currentPage - 1;
        dispatch(setPageNo(newPage));
        updateUrlWithPage(newPage);
      }
    } catch (error: any) {
      AppToast({
        type: "error",
        message: error || "Failed to delete user",
      });
    }
  };

  const closeModal = () => {
    setModalState({
      isOpen: false,
      mode: ModalMode.CREATE_MODE,
      userId: "",
      error: null,
    });
  };

  const closeDetailModal = () => {
    setDetailModalState({
      isOpen: false,
      userCustomerId: "",
    });
  };

  const closeResetPasswordModal = () => {
    setResetPasswordState({
      isOpen: false,
      userCustomerId: "",
      userName: "",
    });
  };

  const closeDeleteModal = () => {
    setDeleteState({
      isOpen: false,
      user: null,
    });
  };

  return (
    <div className="flex flex-1 flex-col gap-4 px-2">
      <div className="space-y-4">
        <CardHeaderSection
          breadcrumbs={[
            { label: "Dashboard", href: ROUTES.DASHBOARD.INDEX },
            { label: "Customer Users", href: "" },
          ]}
          title="Customer Users"
          searchValue={filters.search}
          searchPlaceholder="Search customer users..."
          buttonIcon={<Plus className="w-3 h-3" />}
          buttonText="New User"
          onSearchChange={handleSearchChange}
          openModal={handleCreateUser}
        >
          <div className="flex items-center gap-3">
            <CustomSelect
              options={ACCOUNT_STATUS_FILTER}
              value={filters.accountStatus}
              placeholder="All Status"
              onValueChange={(value) =>
                handleStatusChange(value as AccountStatus)
              }
              label="Account Status"
            />
          </div>
        </CardHeaderSection>

        {/* Merged DataTable with Pagination */}
        <DataTableWithPagination
          data={users}
          columns={columns}
          loading={isLoading}
          emptyMessage="No users customer found"
          getRowKey={(user) => user.id?.toString() || user.email}
          currentPage={pagination.currentPage}
          totalPages={pagination.totalPages}
          onPageChange={handlePageChangeWrapper}
        />
      </div>

      {/* Modals Add/Edit */}
      <UserCustomerModal
        isOpen={modalState.isOpen}
        onClose={closeModal}
        isSubmitting={operations.isCreating || operations.isUpdating}
        onSave={handleSubmit}
        userId={modalState.userId}
        mode={modalState.mode}
        error={modalState.error}
      />

      {/* Modals User Detail */}
      <UserCustomerDetailModal
        userId={detailModalState.userCustomerId}
        isOpen={detailModalState.isOpen}
        onClose={closeDetailModal}
      />

      {/* Modals Reset Password */}
      <ResetPasswordModal
        isOpen={resetPasswordState.isOpen}
        userName={resetPasswordState.userName}
        onClose={closeResetPasswordModal}
        userId={resetPasswordState.userCustomerId}
      />

      {/* Modals Delete User */}
      <DeleteConfirmationModal
        isOpen={deleteState.isOpen}
        onClose={closeDeleteModal}
        onDelete={handleDelete}
        title="Delete User"
        description={`Are you sure you want to delete this user ${
          deleteState.user?.fullName || deleteState.user?.email
        }?`}
        itemName={deleteState.user?.fullName || deleteState.user?.email}
        isSubmitting={operations.isDeleting}
      />
    </div>
  );
}
