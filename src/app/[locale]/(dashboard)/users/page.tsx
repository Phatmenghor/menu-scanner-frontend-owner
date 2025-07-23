"use client";

import { RoleBadge } from "@/components/shared/badge/role-badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  ModalMode,
  Status,
  STATUS_FILTER,
  USER_ROLE_OPTIONS,
  USER_TYPE_OPTIONS,
  UserRole,
  UserType,
} from "@/constants/AppResource/status/status";
import {
  getUserTableHeaders,
  UserTableHeaders,
} from "@/constants/AppResource/table/table";
import { indexDisplay } from "@/utils/common/common";
import { DateTimeFormat } from "@/utils/date/date-time-format";
import { useDebounce } from "@/utils/debounce/debounce";
import {
  ExcelColumn,
  ExcelExporter,
  ExcelSheet,
} from "@/utils/export-file/excel";
import { Check, RotateCw, Search, UserPlus } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { usePathname, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { usePagination } from "@/hooks/use-pagination";
import { ROUTES } from "@/constants/AppRoutes/routes";
import PaginationPage from "@/components/shared/common/app-pagination";
import { AllUserResponse, UserModel } from "@/models/user/user.response";
import {
  createUserService,
  deletedUserService,
  getAllUserService,
  updateUserService,
} from "@/services/dashboard/user/user.service";
import { CreateUserRequest } from "@/models/user/user.request";
import { UserFormData } from "@/models/user/user.schema";
import ModalUser from "@/components/shared/modal/modal";
import ResetPasswordModal from "@/components/shared/dialog/dialog-reset-password";
import { DeleteConfirmationDialog } from "@/components/shared/dialog/dialog-delete";
import { AppToast } from "@/components/shared/toast/app-toast";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { ConfirmDialog } from "@/components/shared/dialog/dialog-confirm";

export default function UserPage() {
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
  const [userTypeFilter, setUserTypeFilter] = useState<UserType>(
    UserType.PLATFORM_USER
  );
  const [roleFilter, setRoleFilter] = useState<UserRole>(
    UserRole.PLATFORM_OWNER
  );
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isResetPasswordDialogOpen, setIsResetPasswordDialogOpen] =
    useState(false);
  const [selectedUserToggle, setSelectedUserToggle] =
    useState<UserModel | null>(null);
  const [isToggleStatusDialogOpen, setIsToggleStatusDialogOpen] =
    useState(false);

  const t = useTranslations("user");
  const headers = getUserTableHeaders(t);
  const locale = useLocale();
  const pathname = usePathname();

  console.log("Page Debug:", { locale, pathname });

  // Debounced search query - Optimized api performance when search
  const debouncedSearchQuery = useDebounce(searchQuery, 400);

  const searchParams = useSearchParams();

  const { currentPage, updateUrlWithPage, handlePageChange, getDisplayIndex } =
    usePagination({
      baseRoute: ROUTES.DASHBOARD.USERS,
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
        roles: [roleFilter.toString()],
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

  async function handleSubmit(formData: UserFormData) {
    console.log("Submitting form:", formData, "mode:", mode);

    setIsSubmitting(true);
    try {
      const isCreate = mode === ModalMode.CREATE_MODE;

      if (isCreate) {
        const createPayload: CreateUserRequest = {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email!,
          userType: formData.userType!,
          password: formData.password!,
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
              response.username || formData.email
            } added successfully`,
            duration: 4000,
            position: "top-right",
          });

          setIsModalOpen(false);
        }
      } else {
        // Update mode
        if (!formData.id) {
          throw new Error("User ID is required for update");
        }

        const updatePayload = {
          firstName: formData.firstName,
          lastName: formData.lastName,
          phoneNumber: formData.phoneNumber,
          accountStatus: formData.accountStatus,
          profileImageUrl: formData.profileImageUrl,
          address: formData.address,
          roles: formData.roles,
          notes: formData.notes,
          position: formData.position,
        };

        const response = await updateUserService(formData.id, updatePayload);
        if (response) {
          // Update users list
          setUsers((prev) =>
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

  const handleEditUser = (user: UserFormData) => {
    setInitializeUser(user);
    setMode(ModalMode.UPDATE_MODE);
    setIsModalOpen(!isModalOpen);
  };

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

  // Handle status filter change - directly updates the filter value
  const handleStatusChange = (status: Status) => {
    setStatusFilter(status);
  };

  const handleUserTypeChange = (userType: UserType) => {
    setUserTypeFilter(userType);
  };

  const handleRoleFilterChange = (userType: UserRole) => {
    setRoleFilter(userType);
  };

  const handleResetPassword = (user: UserModel) => {
    setSelectedUser(user);
    setIsResetPasswordDialogOpen(true);
  };

  const handleDelete = (user: UserModel) => {
    setSelectedUser(user);
    setIsDeleteDialogOpen(true);
  };

  const handleResetFilters = () => {
    setUserTypeFilter(UserType.PLATFORM_USER);
    setRoleFilter(UserRole.PLATFORM_OWNER);
    setStatusFilter(Status.ACTIVE);
    setSearchQuery("");
    updateUrlWithPage(1, true);
    setUsers(null); // Reset users to trigger reload};
    loadUsers(); // Reload users with default filters
  };

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Users</h2>
            <p className="text-muted-foreground">
              Manage your users and their permissions
            </p>
          </div>
          <Button
            onClick={() => {
              setIsModalOpen(!isModalOpen);
              setMode(ModalMode.CREATE_MODE);
            }}
            className="flex items-center"
          >
            <UserPlus className="mr-2 h-4 w-4" />
            Add User
          </Button>
        </div>
        <div className="flex flex-wrap items-center justify-start gap-4 w-full">
          <div className="relative w-full md:w-[350px]">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              aria-label="search-user"
              autoComplete="search-user"
              type="search"
              placeholder={t("search")}
              value={searchQuery}
              onChange={handleSearchChange}
              className="pl-8 w-full min-w-[200px] text-xs md:min-w-[300px] h-9"
              disabled={isSubmitting}
            />
          </div>
          <div>
            <Button onClick={() => handleExportToPdf(users)}>Excel</Button>
          </div>
          <div className="flex items-center gap-3">
            <Select value={statusFilter} onValueChange={handleStatusChange}>
              <SelectTrigger className="min-w-[150px] h-9 text-sm">
                <SelectValue placeholder="Select Status" />
              </SelectTrigger>
              <SelectContent>
                {STATUS_FILTER.map((option) => (
                  <SelectItem
                    key={option.value}
                    value={option.value}
                    className="text-sm"
                  >
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={userTypeFilter} onValueChange={handleUserTypeChange}>
              <SelectTrigger className="min-w-[150px] h-9 text-sm">
                <SelectValue placeholder="Select User Type" />
              </SelectTrigger>
              <SelectContent>
                {USER_TYPE_OPTIONS.map((option) => (
                  <SelectItem
                    key={option.value}
                    value={option.value}
                    className="text-sm"
                  >
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={roleFilter} onValueChange={handleRoleFilterChange}>
              <SelectTrigger className="min-w-[150px] h-9 text-sm">
                <SelectValue placeholder="Select User Type" />
              </SelectTrigger>
              <SelectContent>
                {USER_ROLE_OPTIONS.map((option) => (
                  <SelectItem
                    key={option.value}
                    value={option.value}
                    className="text-sm"
                  >
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              onClick={handleResetFilters}
              disabled={!roleFilter && !statusFilter && !userTypeFilter}
              className="flex items-center"
            >
              <RotateCw className="mr-2 h-4 w-4" />
              Reset
            </Button>
          </div>
        </div>

        <div className="w-full">
          <Separator className="bg-gray-300" />
        </div>

        <div>
          <div className="rounded-md border overflow-x-auto whitespace-nowrap">
            <Table>
              <TableHeader>
                <TableRow>
                  {headers.map((header, index) => (
                    <TableHead
                      key={index}
                      className="text-xs font-semibold text-muted-foreground"
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
                    // const profileImageUrl = useMemo(() => {
                    //   if (
                    //     user?.profileUrl &&
                    //     process.env.NEXT_PUBLIC_API_BASE_URL
                    //   ) {
                    //     return new URL(
                    //       user.profileUrl,
                    //       `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/`
                    //     ).toString();
                    //   }
                    //   return "/placeholder.svg?height=36&width=36";
                    // }, [user]);

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
                                // src={user.profileUrl ? profileImageUrl : ""}
                                alt="Profile"
                              />
                              <AvatarFallback className="bg-primary/10 dark:bg-primary/20 text-primary font-semibold">
                                {user?.email?.charAt(0).toUpperCase() || "U"}
                              </AvatarFallback>
                            </Avatar>
                            <span className="text-sm font-semibold">
                              {user?.email}
                            </span>
                          </div>
                        </TableCell>

                        {/* FullName */}
                        <TableCell className="text-xs text-muted-foreground">
                          {user?.fullName ||
                            `${user.firstName} ${user.lastName}`}
                        </TableCell>

                        {/* Role */}
                        <TableCell className="text-xs text-muted-foreground">
                          <RoleBadge role={user?.userType} />
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
                          {DateTimeFormat(user?.createdAt)}
                        </TableCell>

                        {/* Actions */}
                        <TableCell className="text-center space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditUser(user)}
                          >
                            Edit
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleResetPassword(user)}
                          >
                            Reset
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDelete(user)}
                          >
                            Delete
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>

            <ModalUser
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
              title="Change user status"
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
              size="md"
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
