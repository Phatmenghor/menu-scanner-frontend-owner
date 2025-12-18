"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Plus } from "lucide-react";
import { useDebounce } from "@/utils/debounce/debounce";
import { ROUTES } from "@/constants/app-routes/routes";
import {
  AccountStatus,
  ModalMode,
  UserRole,
  UserGropeType,
} from "@/constants/app-resource/status/status";
import { CardHeaderSection } from "@/components/layout/card-header-section";
import { CustomSelect } from "@/components/shared/common/custom-select";
import ResetPasswordModal from "@/components/shared/modal/reset-password-modal";
import { DeleteConfirmationModal } from "@/components/shared/modal/delete-confirmation-modal";
import { userPlatformTableColumns } from "@/redux/features/auth/table/users-platform-table";
import {
  ACCOUNT_STATUS_FILTER,
  USER_PLATFORM_ROLE_FILTER,
} from "@/constants/app-resource/status/filter-status";
import { DataTableWithPagination } from "@/components/shared/common/data-table";
import { showToast } from "@/components/shared/common/show-toast";
import { useUsersState } from "@/redux/features/auth/store/state/users-state";
import { usePagination } from "@/redux/store/use-pagination";
import {
  deleteUserService,
  fetchAllUsersService,
  toggleUserStatusService,
} from "@/redux/features/auth/store/thunks/users-thunks";
import {
  setAccountStatusFilter,
  setPageNo,
  setRoleFilter,
  setSearchFilter,
} from "@/redux/features/auth/store/slice/users-slice";
import { UserResponseModel } from "@/redux/features/auth/store/models/response/users-response";
import UserBusinessModal from "@/redux/features/auth/components/user-business-modal";
import { UserBusinessDetailModal } from "@/redux/features/auth/components/user-business-detail-modal";

export default function UserPage() {
  const searchParams = useSearchParams();

  // Redux state
  const {
    userState,
    usersData,
    usersContent,
    isLoading,
    filters,
    operations,
    pagination,
    dispatch,
  } = useUsersState();

  // Local UI state for modals only
  const [modalState, setModalState] = useState({
    isOpen: false,
    mode: ModalMode.CREATE_MODE,
    userId: "",
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
    user: null as UserResponseModel | null,
  });

  const debouncedSearch = useDebounce(filters.search, 400);

  const { updateUrlWithPage, handlePageChange } = usePagination({
    baseRoute: ROUTES.DASHBOARD.BUSINESS_USER,
    defaultPageSize: 10,
  });

  // Initialize URL and Redux state on mount
  useEffect(() => {
    const pageParam = searchParams.get("pageNo");
    const pageFromUrl = pageParam ? parseInt(pageParam, 10) : 1;

    if (pageFromUrl !== pagination.currentPage) {
      dispatch(setPageNo(pageFromUrl));
    }
  }, [searchParams, filters.pageNo, dispatch]);

  // Fetch users when filters change
  useEffect(() => {
    dispatch(
      fetchAllUsersService({
        search: debouncedSearch,
        pageNo: filters.pageNo,
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
    filters.pageNo,
  ]);

  // Event handlers
  const handleCreateUser = () => {
    setModalState({
      isOpen: true,
      mode: ModalMode.CREATE_MODE,
      userId: "",
    });
  };

  const handleEditUser = (user: UserResponseModel) => {
    setModalState({
      isOpen: true,
      mode: ModalMode.UPDATE_MODE,
      userId: user?.id || "",
    });
  };

  const handleViewDetail = (user: UserResponseModel) => {
    setDetailModalState({
      isOpen: true,
      userBusinessId: user.id || "",
    });
  };

  const handleResetPassword = (user: UserResponseModel) => {
    setResetPasswordState({
      isOpen: true,
      userBusinessId: user.id || "",
      userName: user.userIdentifier || "",
    });
  };

  const handleDeleteUser = (user: UserResponseModel) => {
    setDeleteState({
      isOpen: true,
      user: user,
    });
  };

  const handleToggleStatus = async (user: UserResponseModel) => {
    if (!user?.id) return;

    try {
      await dispatch(toggleUserStatusService(user)).unwrap();
      showToast.success("User business status updated successfully");
    } catch (error: any) {
      showToast.error(error || "Failed to update user business status");
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
        data: usersData,
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

  const handleDelete = async () => {
    if (!deleteState.user?.id) return;

    try {
      await dispatch(deleteUserService(deleteState.user.id)).unwrap();

      showToast.success(
        `User business "${
          deleteState.user.fullName ?? ""
        }" deleted successfully`
      );

      closeDeleteModal();

      // Navigate to previous page if this was the last item
      if (usersContent.length === 1 && pagination.currentPage > 1) {
        const newPage = pagination.currentPage - 1;
        dispatch(setPageNo(newPage));
        updateUrlWithPage(newPage);
      }
    } catch (error: any) {
      showToast.error(error || "Failed to delete user business");
    }
  };

  const closeModal = () => {
    setModalState({
      isOpen: false,
      mode: ModalMode.CREATE_MODE,
      userId: "",
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
            { label: "Platform Users", href: "" },
          ]}
          title="Business Users"
          searchValue={filters.search}
          searchPlaceholder="Search users business..."
          buttonTooltip="Create a new users"
          buttonIcon={<Plus className="w-3 h-3" />}
          buttonText="New"
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
              options={USER_PLATFORM_ROLE_FILTER}
              value={filters.role}
              placeholder="All Roles"
              onValueChange={(value) => handleRoleChange(value as UserRole)}
              label="Platform Role"
            />
          </div>
        </CardHeaderSection>

        {/* Data Table with Your Custom Pagination */}
        <DataTableWithPagination
          data={usersContent}
          columns={columns}
          loading={isLoading}
          emptyMessage="No users platform found"
          getRowKey={(user) => user.id}
          currentPage={filters.pageNo}
          totalPages={pagination.totalPages}
          onPageChange={handlePageChangeWrapper}
        />
      </div>

      {/* Modals Add/Edit */}
      <UserBusinessModal
        isOpen={modalState.isOpen}
        onClose={closeModal}
        userId={modalState.userId}
        mode={modalState.mode}
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
          deleteState.user?.userIdentifier || deleteState.user?.email
        }?`}
        itemName={deleteState.user?.fullName || deleteState.user?.email}
        isSubmitting={operations.isDeleting}
      />
    </div>
  );
}
