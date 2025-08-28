"use client";

import { useState, useCallback, useEffect, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { Plus, Users, UserCheck, UserX, Download, Filter } from "lucide-react";

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
import ModalCustomerUser from "@/components/shared/modal/cusomer-user-modal";
import ResetPasswordModal from "@/components/shared/modal/reset-password-modal";
import { DeleteConfirmationDialog } from "@/components/shared/dialog/dialog-delete";
import { AppToast } from "@/components/shared/toast/app-toast";
import { createCustomerUserTableColumns } from "@/constants/AppResource/table/customer-user/customer-user-table";
import { UserDetailModal } from "@/components/dashboard/plate-form-user/user-detail-modal";
import {
  STATUS_FILTER,
  USER_CUSTOMER_ROLE_FILTER,
} from "@/constants/AppResource/status/filter-status";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ExcelColumn,
  ExcelExporter,
  ExcelSheet,
} from "@/utils/export-file/excel";

export default function CustomerUserPage() {
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
  const [roleFilter, setRoleFilter] = useState<UserRole>(UserRole.All);
  const [isExporting, setIsExporting] = useState(false);

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
        roles: roleFilter === UserRole.All ? [] : [roleFilter],
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
  }, [debouncedSearchQuery, accountStatusFilter, roleFilter, currentPage]);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  // Statistics calculation
  const userStats = useMemo(() => {
    if (!data) return { total: 0, active: 0, inactive: 0 };

    return {
      total: data.totalElements || 0,
      active:
        data.content?.filter((user) => user.accountStatus === Status.ACTIVE)
          .length || 0,
      inactive:
        data.content?.filter((user) => user.accountStatus === Status.INACTIVE)
          .length || 0,
    };
  }, [data]);

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
          duration: 4000,
          position: "top-right",
        });
      } else {
        AppToast({
          type: "error",
          message: `Failed to update customer status`,
          duration: 4000,
          position: "top-right",
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
          roles: formData.roles || [UserRole.CUSTOMER],
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
            message: `Customer "${
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
            message: `Customer "${
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

  // Handle export
  const handleExportToExcel = async () => {
    setIsExporting(true);
    try {
      const columns: ExcelColumn[] = [
        { header: "Customer ID", key: "userIdentifier", width: 20 },
        { header: "Full Name", key: "fullName", width: 25 },
        { header: "Email", key: "email", width: 30 },
        { header: "Phone", key: "phoneNumber", width: 20 },
        { header: "Business", key: "businessName", width: 25 },
        { header: "Status", key: "accountStatus", width: 15 },
        { header: "Join Date", key: "createdAt", width: 20, type: "date" },
      ];

      const exporter = new ExcelExporter({
        filename: "customer-users.xlsx",
        title: "Customer Users Report",
        author: "System",
      });

      const sheetConfig: ExcelSheet = {
        name: "Customers",
        data: data?.content ?? [],
        columns,
        autoFilter: true,
        freezeRows: 1,
      };

      exporter.addSheet(sheetConfig);
      await exporter.export();

      toast.success("Export completed successfully");
    } catch (error) {
      console.error("Export failed:", error);
      toast.error("Failed to export data");
    } finally {
      setIsExporting(false);
    }
  };

  // Reset filters
  const handleResetFilters = () => {
    setAccountStatusFilter(AccountStatus.All);
    setRoleFilter(UserRole.All);
    setSearchQuery("");
    updateUrlWithPage(1, true);
  };

  return (
    <div className="flex flex-1 flex-col gap-4 px-2">
      <div className="space-y-4">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Customers
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{userStats.total}</div>
              <p className="text-xs text-muted-foreground">
                Registered customers
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active</CardTitle>
              <UserCheck className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {userStats.active}
              </div>
              <p className="text-xs text-muted-foreground">Active customers</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Inactive</CardTitle>
              <UserX className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                {userStats.inactive}
              </div>
              <p className="text-xs text-muted-foreground">
                Inactive customers
              </p>
            </CardContent>
          </Card>
        </div>

        <CardHeaderSection
          breadcrumbs={[
            { label: "Dashboard", href: ROUTES.DASHBOARD.INDEX },
            { label: "Customer Management", href: "" },
          ]}
          title="Customer Users"
          searchValue={searchQuery}
          searchPlaceholder="Search customers..."
          buttonIcon={<Plus className="w-3 h-3" />}
          buttonText="New Customer"
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
              options={USER_CUSTOMER_ROLE_FILTER}
              value={roleFilter}
              placeholder="Select User Role"
              onValueChange={(value) =>
                handleRoleFilterChange(value as UserRole)
              }
            />

            <Button
              variant="outline"
              size="sm"
              onClick={handleExportToExcel}
              disabled={isExporting || !data?.content?.length}
            >
              <Download className="w-4 h-4 mr-2" />
              {isExporting ? "Exporting..." : "Export"}
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={handleResetFilters}
              disabled={
                accountStatusFilter === AccountStatus.All &&
                roleFilter === UserRole.All &&
                !searchQuery
              }
            >
              <Filter className="w-4 h-4 mr-2" />
              Reset
            </Button>
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

      {/* Create/Update Modal - Only pass userId */}
      <ModalCustomerUser
        isOpen={modalState.isOpen}
        onClose={closeModal}
        isSubmitting={modalState.isSubmitting}
        onSave={handleSubmit}
        userId={modalState.userId}
        mode={modalState.mode}
        error={modalState.error}
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
