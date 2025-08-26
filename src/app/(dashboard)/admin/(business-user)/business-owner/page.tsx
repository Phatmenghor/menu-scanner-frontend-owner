"use client";

import { RoleBadge } from "@/components/shared/badge/role-badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  BusinessUserRole,
  BusinessUserType,
  ModalMode,
  Status,
} from "@/constants/AppResource/status/status";
import { UserTableHeaders } from "@/constants/AppResource/table/user/plateform-user";
import { indexDisplay } from "@/utils/common/common";
import { dateTimeFormat } from "@/utils/date/date-time-format";
import { useDebounce } from "@/utils/debounce/debounce";
import {
  ExcelColumn,
  ExcelExporter,
  ExcelSheet,
} from "@/utils/export-file/excel";
import { Check, Plus, RotateCw, Trash } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { usePagination } from "@/hooks/use-pagination";
import { ROUTES } from "@/constants/AppRoutes/routes";
import PaginationPage from "@/components/shared/common/app-pagination";
import {
  AllUserResponse,
  UserModel,
} from "@/models/dashboard/user/plateform-user/user.response";
import {
  deletedUserService,
  getAllUserService,
  updateUserService,
} from "@/services/dashboard/user/plateform-user/plateform-user.service";
import ResetPasswordModal from "@/components/shared/dialog/dialog-reset-password";
import { DeleteConfirmationDialog } from "@/components/shared/dialog/dialog-delete";
import { AppToast } from "@/components/shared/toast/app-toast";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { ConfirmDialog } from "@/components/shared/dialog/dialog-confirm";
import { CardHeaderSection } from "@/components/layout/card-header-section";
import { UserDetailSheet } from "@/components/dashboard/plate-form-user/manage-user/user-detail-sheet";
import ModalBusinessUser from "@/components/shared/modal/business-user-modal";
import { UserFormData } from "@/models/dashboard/user/plateform-user/user.schema";
import { CreateBusinessUserRequest } from "@/models/dashboard/user/business-user/business-user.request.model";
import {
  CreateBusinessUserFormData,
  UpdateBusinessUserFormData,
} from "@/models/dashboard/user/business-user/business-user.schema";
import { createBusinessOwnerService } from "@/services/dashboard/master-data/business/business.service";
import { CreateBusinessOwnerRequest } from "@/models/dashboard/user/business-owner/business-owner.request.model";

export default function BusinessUserPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [users, setUsers] = useState<AllUserResponse | null>(null);
  const [initializeUser, setInitializeUser] = useState<UserFormData | null>(
    null
  );
  const [selectedUser, setSelectedUser] = useState<UserModel | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [mode, setMode] = useState<ModalMode>(ModalMode.CREATE_MODE);
  const [isExportingToExcel, setIsExportingToExcel] = useState(false);
  const [statusFilter, setStatusFilter] = useState<Status>(Status.ACTIVE);
  const [userTypeFilter, setUserTypeFilter] = useState<BusinessUserType>(
    BusinessUserType.BUSINESS_USER
  );
  const [isUserDetailOpen, setIsUserDetailOpen] = useState(false);

  const [roleFilter, setRoleFilter] = useState<BusinessUserRole>(
    BusinessUserRole.BUSINESS_OWNER
  );
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isResetPasswordDialogOpen, setIsResetPasswordDialogOpen] =
    useState(false);
  const [selectedUserToggle, setSelectedUserToggle] =
    useState<UserModel | null>(null);
  const [isToggleStatusDialogOpen, setIsToggleStatusDialogOpen] =
    useState(false);
  const [roleFilterOpen, setRoleFilterOpen] = useState(false);

  // Debounced search query - Optimized api performance when search
  const debouncedSearchQuery = useDebounce(searchQuery, 400);

  const searchParams = useSearchParams();

  const { currentPage, updateUrlWithPage, handlePageChange, getDisplayIndex } =
    usePagination({
      baseRoute: ROUTES.DASHBOARD.BUSINESS_OWNER,
      defaultPageSize: 10,
    });

  // Then add this effect for initial URL setup
  useEffect(() => {
    const pageParam = searchParams.get("pageNo");
    if (!pageParam) {
      // Use replace: true to avoid adding to browser history
      updateUrlWithPage(1, true);
    }
  }, [searchParams, updateUrlWithPage]);

  const loadUsers = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await getAllUserService({
        search: debouncedSearchQuery,
        pageNo: currentPage,
        roles: [BusinessUserRole.BUSINESS_OWNER],
        pageSize: 10,
        userType: userTypeFilter,
        accountStatus: statusFilter,
      });
      console.log("Fetched users:", response);
      setUsers(response);
    } catch (error: any) {
      console.log("Failed to fetch users: ", error);
    } finally {
      setIsLoading(false);
    }
  }, [
    debouncedSearchQuery,
    statusFilter,
    userTypeFilter,
    roleFilter,
    currentPage,
  ]);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  // Simplified search change handler - just updates the state, debouncing handles the rest
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleExportToPdf = async (data: AllUserResponse | null) => {
    setIsExportingToExcel(true);
    try {
      const columns: ExcelColumn[] = [
        {
          header: "Id",
          key: "id",
          width: 15,
          style: { alignment: { horizontal: "right" } },
        },
        { header: "Name", key: "name", width: 15 },
        { header: "Email", key: "email", width: 30 },
        { header: "Role", key: "role", width: 15 },
        { header: "Status", key: "status", width: 15 },
        {
          header: "Join Date",
          key: "createdAt",
          width: 25,
          type: "date",
          format: "mm/dd/yyyy",
        },
      ];

      // await quickExport(data?.content ?? [], {
      //   filename: "users.xlsx",
      //   title: "User List",
      //   autoFilter: true,
      //   columns: columns,
      //   sortBy: [{ key: "createdAt", order: "desc" }],
      // });

      const exporter = new ExcelExporter({
        filename: "user.xlsx",
        title: "User Report",
        author: "IT Department",
        useAlternateRows: true,
        protection: {
          password: "Mak12pa12",
          deleteRows: false,
        },
      });

      const sheetConfig: ExcelSheet = {
        name: "User",
        data: data?.content ?? [],
        columns,
        autoFilter: true,
        freezeRows: 1,
        sortBy: [{ key: "createAt", order: "desc" }],
      };

      exporter.addSheet(sheetConfig);
      await exporter.export();

      toast.success("Successfully export to excel");
    } catch (err: any) {
      toast.success("Failed to export to excel");
      console.log("Error exporting to excel: ", err);
    } finally {
      setIsExportingToExcel(false);
    }
  };

  async function handleSubmit(
    formData: CreateBusinessUserFormData | UpdateBusinessUserFormData
  ) {
    console.log("Submitting form:", formData, "mode:", mode);

    setIsSubmitting(true);
    try {
      const isCreate = mode === ModalMode.CREATE_MODE;

      if (isCreate) {
        const data = formData as CreateBusinessUserFormData;

        const createPayload: CreateBusinessOwnerRequest = {
          businessAddress: data.businessAddress,
          businessName: data.businessName,
          preferredSubdomain: data.preferredSubdomain,
          businessDescription: data.businessDescription,
          businessPhone: data.businessPhone,
          businessEmail: data.businessEmail,
          ownerFirstName: data.ownerFirstName,
          ownerLastName: data.ownerLastName,
          ownerPhone: data.ownerPhone,
          ownerPassword: data.ownerPassword,
          ownerUserIdentifier: data.ownerUserIdentifier,
          ownerAddress: data.ownerAddress,
          ownerEmail: data.ownerEmail,
        };

        const response = await createBusinessOwnerService(createPayload);
        if (response) {
          // Update users list
          setUsers((prev) =>
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
            message: `User ${
              response.username || data.ownerUserIdentifier
            } added successfully`,
            duration: 4000,
            position: "top-right",
          });

          setIsModalOpen(false);
        }
      } else {
        const data = formData as UpdateBusinessUserFormData;

        // Update mode
        if (!data.id) {
          throw new Error("User ID is required for update");
        }

        const updatePayload = {
          firstName: data.firstName,
          lastName: data.lastName,
          phoneNumber: data.phoneNumber,
          accountStatus: data.accountStatus,
          profileImageUrl: data.profileImageUrl,
          address: data.address,
          roles: data.roles,
          notes: data.notes,
          position: data.position,
        };

        const response = await updateUserService(data.id, updatePayload);
        if (response) {
          // Update users list
          setUsers((prev) =>
            prev
              ? {
                  ...prev,
                  content: prev.content.map((user) =>
                    user.id === data.id ? response : user
                  ),
                }
              : prev
          );

          AppToast({
            type: "success",
            message: `User ${
              response.username || response.email
            } updated successfully`,
            duration: 4000,
            position: "top-right",
          });

          setIsModalOpen(false);
        }
      }
    } catch (error: any) {
      console.error("Error submitting user form:", error);
      toast.error(error.message || "An unexpected error occurred");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleDeleteUser() {
    if (!selectedUser || !selectedUser.id) return;

    setIsSubmitting(true);
    try {
      const response = await deletedUserService(selectedUser.id);

      if (response) {
        AppToast({
          type: "success",
          message: `User ${selectedUser.fullName ?? ""} deleted successfully`,
          duration: 4000,
          position: "top-right",
        });
        // After deletion, check if we need to go back a page
        if (users && users.content.length === 1 && currentPage > 1) {
          updateUrlWithPage(currentPage - 1);
        } else {
          await loadUsers();
        }
      } else {
        AppToast({
          type: "error",
          message: `Failed to delete user`,
          duration: 4000,
          position: "top-right",
        });
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      toast.error("An error occurred while deleting the user");
    } finally {
      setIsSubmitting(false);
      setIsDeleteDialogOpen(false);
    }
  }

  // Status toggle handler
  const handleStatusToggle = async (user: UserModel | null) => {
    if (!user?.id) return;

    setIsSubmitting(true);
    try {
      const newStatus =
        user?.accountStatus === Status.ACTIVE ? Status.INACTIVE : Status.ACTIVE;

      const response = await updateUserService(user?.id, {
        accountStatus: newStatus,
      });

      if (response) {
        // Optimistic update
        setUsers((prev) =>
          prev
            ? {
                ...prev,
                content: prev.content.map((user) =>
                  user.id === selectedUserToggle?.id ? response : user
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
        setSelectedUserToggle(null);
        setIsToggleStatusDialogOpen(false);
      } else {
        AppToast({
          type: "error",
          message: `Failed to update user status`,
          duration: 4000,
          position: "top-right",
        });
        loadUsers(); // reload in case of failure
      }
    } catch (error: any) {
      toast.error(
        error?.message || "An error occurred while updating user status"
      );
      loadUsers(); // reload in case of failure
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleStatus = (user: UserModel) => {
    setSelectedUserToggle(user);
    setIsToggleStatusDialogOpen(true);
  };

  const handleDelete = (user: UserModel) => {
    setSelectedUser(user);
    setIsDeleteDialogOpen(true);
  };

  const handleResetPassword = (user: UserModel) => {
    setSelectedUser(user);
    setIsResetPasswordDialogOpen(true);
  };

  const handleCloseViewUserDetail = () => {
    setSelectedUser(null);
    setIsUserDetailOpen(false);
  };

  const handleResetFilters = () => {
    setUserTypeFilter(BusinessUserType.BUSINESS_USER);
    setRoleFilter(BusinessUserRole.BUSINESS_OWNER);
    setStatusFilter(Status.ACTIVE);
    setSearchQuery("");
    updateUrlWithPage(1, true);
    setUsers(null); // Reset users to trigger reload};
    loadUsers(); // Reload users with default filters
  };

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <div className="space-y-6">
        <CardHeaderSection
          breadcrumbs={[
            { label: "Dashboard", href: ROUTES.DASHBOARD.INDEX },
            { label: "Business Users List", href: "" },
          ]}
          title="Business Users"
          searchValue={searchQuery}
          searchPlaceholder="Search..."
          buttonIcon={<Plus className="w-3 h-3" />}
          buttonText="Add new"
          onSearchChange={handleSearchChange}
          buttonHref={ROUTES.DASHBOARD.NEW_OWNER}
          handleResetFilters={handleResetFilters}
          disableReset={!roleFilter && !statusFilter && !userTypeFilter}
        />

        <div className="w-full">
          <Separator className="bg-gray-300" />
        </div>

        <div>
          <div className="rounded-md border overflow-x-auto whitespace-nowrap">
            <Table>
              <TableHeader>
                <TableRow>
                  {UserTableHeaders.map((header, index) => (
                    <TableHead
                      key={index}
                      className="font-semibold text-muted-foreground"
                    >
                      <div
                        className={`flex items-center gap-1 ${header.className}`}
                      >
                        <span>{header.label}</span>
                      </div>
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {!users || users.content.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={UserTableHeaders.length}
                      className="text-center py-8 text-muted-foreground"
                    >
                      No users found
                    </TableCell>
                  </TableRow>
                ) : (
                  users.content.map((user, index) => {
                    const profileImageUrl =
                      user?.profileImageUrl &&
                      process.env.NEXT_PUBLIC_API_BASE_URL
                        ? `${process.env.NEXT_PUBLIC_API_BASE_URL}${user.profileImageUrl}`
                        : undefined;

                    return (
                      <TableRow key={user.id} className="text-sm">
                        {/* Index */}
                        <TableCell className="font-medium truncate">
                          {indexDisplay(users.pageNo, users.pageSize, index)}
                        </TableCell>

                        {/* Avatar */}
                        <TableCell>
                          <div className="flex items-center gap-3 min-w-[180px]">
                            <Avatar className="h-10 w-10 border-2 border-background dark:border-card shadow-sm group-hover:border-primary/30 transition-all">
                              <AvatarImage
                                src={
                                  user.profileImageUrl ? profileImageUrl : ""
                                }
                                alt="Profile"
                              />
                              <AvatarFallback className="bg-primary/10 dark:bg-primary/20 text-primary font-semibold">
                                {user?.email?.charAt(0).toUpperCase() || "U"}
                              </AvatarFallback>
                            </Avatar>
                          </div>
                        </TableCell>

                        <TableCell className="text-muted-foreground">
                          {user?.userIdentifier || "---"}
                        </TableCell>

                        <TableCell className="text-muted-foreground">
                          {user?.email || "---"}
                        </TableCell>

                        {/* FullName */}
                        <TableCell className="text-muted-foreground">
                          {user?.fullName ||
                            `${user.firstName} ${user.lastName}`}
                        </TableCell>

                        {/* Role */}
                        <TableCell className="text-xs text-muted-foreground space-x-1">
                          {user.roles?.length > 0
                            ? user.roles.map((role: string) => (
                                <RoleBadge key={role} role={role} />
                              ))
                            : "---"}
                        </TableCell>

                        {/* Status Switch */}
                        <TableCell>
                          <Switch
                            checked={user?.accountStatus === "ACTIVE"}
                            onCheckedChange={() => handleToggleStatus(user)}
                            disabled={isSubmitting}
                            aria-label="Toggle user status"
                            className={cn(
                              "relative inline-flex h-5 w-9 items-center rounded-full transition-colors",
                              // canModify
                              1
                                ? "bg-gray-300 dark:bg-gray-600 data-[state=checked]:bg-primary dark:data-[state=checked]:bg-primary"
                                : "bg-gray-300 dark:bg-primary opacity-50 cursor-not-allowed"
                            )}
                          >
                            <div
                              className={cn(
                                "inline-block h-6 w-6 transform rounded-full bg-white dark:bg-gray-100 shadow-md transition-transform",
                                "translate-x-1 data-[state=checked]:translate-x-5"
                              )}
                            >
                              {user.accountStatus === "ACTIVE" && (
                                <Check className="h-6 w-6 m-auto text-orange-600 dark:text-orange-300" />
                              )}
                            </div>
                          </Switch>
                        </TableCell>

                        {/* Created At */}
                        <TableCell className="text-sm text-muted-foreground">
                          {dateTimeFormat(user?.createdAt)}
                        </TableCell>

                        {/* Actions */}
                        <TableCell className="text-center space-x-2">
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleResetPassword(user)}
                          >
                            <RotateCw className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDelete(user)}
                          >
                            <Trash className="w-4 h-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>

            <ModalBusinessUser
              isOpen={isModalOpen}
              onClose={() => {
                setInitializeUser(null);
                setIsModalOpen(false);
              }}
              isSubmitting={isSubmitting}
              onSave={handleSubmit}
              Data={initializeUser}
              mode={mode}
            />

            <ResetPasswordModal
              isOpen={isResetPasswordDialogOpen}
              userName={selectedUser?.fullName || selectedUser?.email}
              onClose={() => {
                setIsResetPasswordDialogOpen(false);
                setSelectedUser(null);
              }}
              userId={selectedUser?.id}
            />

            <UserDetailSheet
              onClose={handleCloseViewUserDetail}
              open={isUserDetailOpen}
              user={selectedUser}
            />

            <DeleteConfirmationDialog
              isOpen={isDeleteDialogOpen}
              onClose={() => {
                setIsDeleteDialogOpen(false);
                setSelectedUser(null);
              }}
              onDelete={handleDeleteUser}
              title="Delete Admin"
              description={`Are you sure you want to delete the admin`}
              itemName={selectedUser?.fullName || selectedUser?.email}
              isSubmitting={isSubmitting}
            />

            <ConfirmDialog
              open={isToggleStatusDialogOpen}
              onOpenChange={() => {
                setIsToggleStatusDialogOpen(false);
                setSelectedUserToggle(null);
              }}
              centered={true}
              title="Change User Status"
              description={`Are you sure you want to ${
                selectedUserToggle?.accountStatus === "ACTIVE"
                  ? "disable"
                  : "enable"
              } this user: ${selectedUserToggle?.email}?`}
              confirmButton={{
                text: `${
                  selectedUserToggle?.accountStatus === "ACTIVE"
                    ? "Disable"
                    : "Enable"
                }`,
                onClick: () => handleStatusToggle(selectedUserToggle),
                variant: "primary",
              }}
              cancelButton={{ text: "Cancel", variant: "secondary" }}
              onConfirm={() => handleStatusToggle(selectedUserToggle)}
            />

            <PaginationPage
              currentPage={currentPage}
              totalPages={users?.totalPages ?? 10}
              onPageChange={handlePageChange}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
