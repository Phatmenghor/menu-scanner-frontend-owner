"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Plus } from "lucide-react";

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
import {
  ACCOUNT_STATUS_FILTER,
  USER_BUSINESS_ROLE_FILTER,
} from "@/constants/AppResource/status/filter-status";

import { DataTableWithPagination } from "@/components/shared/common/data-table";
import { UserBusinessDetailModal } from "@/components/dashboard/users/business-user/user-business-detail-modal";
import UserBusinessModal from "@/components/dashboard/users/business-user/user-business-modal";
import { userBusinessTableColumns } from "@/constants/AppResource/table/users/user-business-table";
import { useUsersState } from "@/redux/features/auth/state/users-state";
import { usePagination } from "@/redux/store/use-pagination";
import {
  createUser,
  deleteUser,
  fetchUsers,
  toggleUserStatus,
  updateUser,
} from "@/redux/features/auth/thunks/users-thunks";
import { showToast } from "@/components/shared/common/app-toast";
import {
  setAccountStatusFilter,
  setPageNo,
  setRoleFilter,
  setSearchFilter,
} from "@/redux/features/auth/slice/users-slice";
import {
  CreateUserRequest,
  UpdateUserRequest,
} from "@/redux/features/auth/models/request/users-request";

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
  } = useUsersState();

  // Local UI state for modals
  const [modalState, setModalState] = useState({
    isOpen: false,
    mode: ModalMode.CREATE_MODE,
    userId: "",
    error: null as string | null,
  });

  const [detailModalState, setDetailModalState] = useState({
    isOpen: false,
    userBusinessId: "",
  });

  const [resetPasswordState, setResetPasswordState] = useState({
    isOpen: false,
    userBusinessId: "",
    userName: "",
  });

  const [deleteState, setDeleteState] = useState({
    isOpen: false,
    user: null as UserModel | null,
  });

  const debouncedSearch = useDebounce(filters.search, 400);

  const { updateUrlWithPage, handlePageChange } = usePagination({
    baseRoute: ROUTES.DASHBOARD.BUSINESS_USER,
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
        roles: filters.role === UserRole.ALL ? [] : [filters.role],
        userTypes: [UserGropeType.BUSINESS_USER],
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

  // console.log("## filters.accountStatus", filters.accountStatus);

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
      userBusinessId: user.id || "",
    });
  };

  const handleResetPassword = (user: UserModel) => {
    setResetPasswordState({
      isOpen: true,
      userBusinessId: user.id || "",
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
      showToast.success("User status updated successfully");
    } catch (error: any) {
      showToast.error(error || "Failed to update user status");
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
      userBusinessTableColumns({
        data: userState,
        handlers: tableHandlers,
      }),
    [userState, tableHandlers]
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setSearchFilter(e.target.value));
  };

  const handleStatusChange = (status: AccountStatus) => {
    dispatch(setAccountStatusFilter(status));
  };

  const handleRoleChange = (role: UserRole) => {
    dispatch(setRoleFilter(role));
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

        showToast.success(
          `User "${response.username || response.email}" created successfully`
        );

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

        showToast.success(
          `User "${response.username || response.email}" updated successfully`
        );

        closeModal();
      }
    } catch (error: any) {
      const errorMessage = error || "An unexpected error occurred";
      setModalState((prev) => ({ ...prev, error: errorMessage }));
      showToast.error(errorMessage);
      throw error;
    }
  };

  const handleDelete = async () => {
    if (!deleteState.user?.id) return;

    try {
      await dispatch(deleteUser(deleteState.user.id)).unwrap();
      showToast.success("User deleted successfully");
      closeDeleteModal();

      // Navigate to previous page if this was the last item
      if (users.length === 1 && pagination.currentPage > 1) {
        const newPage = pagination.currentPage - 1;
        dispatch(setPageNo(newPage));
        updateUrlWithPage(newPage);
      }
    } catch (error: any) {
      showToast.error(error || "Failed to delete user");
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
      userBusinessId: "",
    });
  };

  const closeResetPasswordModal = () => {
    setResetPasswordState({
      isOpen: false,
      userBusinessId: "",
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
            { label: "Business Users", href: "" },
          ]}
          title="Business Users"
          searchValue={filters.search}
          searchPlaceholder="Search business users..."
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
            <CustomSelect
              options={USER_BUSINESS_ROLE_FILTER}
              value={filters.role}
              placeholder="All Roles"
              onValueChange={(value) => handleRoleChange(value as UserRole)}
              label="Business Role"
            />
          </div>
        </CardHeaderSection>

        {/* Merged DataTable with Pagination */}
        <DataTableWithPagination
          data={users}
          columns={columns}
          loading={isLoading}
          emptyMessage="No users business found"
          getRowKey={(user) => user.id?.toString() || user.email}
          currentPage={pagination.currentPage}
          totalPages={pagination.totalPages}
          onPageChange={handlePageChangeWrapper}
        />
      </div>

      {/* Modals Add/Edit */}
      <UserBusinessModal
        isOpen={modalState.isOpen}
        onClose={closeModal}
        isSubmitting={operations.isCreating || operations.isUpdating}
        onSave={handleSubmit}
        userId={modalState.userId}
        mode={modalState.mode}
        error={modalState.error}
      />

      {/* Modals User Detail */}
      <UserBusinessDetailModal
        userId={detailModalState.userBusinessId}
        isOpen={detailModalState.isOpen}
        onClose={closeDetailModal}
      />

      {/* Modals Reset Password */}
      <ResetPasswordModal
        isOpen={resetPasswordState.isOpen}
        userName={resetPasswordState.userName}
        onClose={closeResetPasswordModal}
        userId={resetPasswordState.userBusinessId}
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
