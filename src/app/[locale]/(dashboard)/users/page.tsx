"use client";

import { StatsCards } from "@/components/index/dashboard/state-card";
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
  USER_TYPE_OPTIONS,
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
import { MoreHorizontal, Search, UserPlus } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { usePathname, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getStatusBadge } from "@/components/shared/badge/status-badge";
import { usePagination } from "@/hooks/use-pagination";
import { ROUTES } from "@/constants/AppRoutes/routes";
import PaginationPage from "@/components/shared/common/app-pagination";
import { AllUserResponse, UserModel } from "@/models/user/user.response";
import {
  createUserService,
  getAllUserService,
  updateUserService,
} from "@/services/dashboard/user/user.service";
import {
  CreateUserRequest,
  UpdateUserRequest,
} from "@/models/user/user.request";
import { UserFormData } from "@/models/user/user.schema";
import ModalUser from "@/components/shared/modal/modal";

export default function UserPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [users, setUsers] = useState<AllUserResponse | null>(null);
  const [selectedUser, setSelectedUser] = useState<UserModel | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [mode, setMode] = useState<ModalMode>(ModalMode.CREATE_MODE);
  const [isExportingToExcel, setIsExportingToExcel] = useState(false);
  const [statusFilter, setStatusFilter] = useState(Status.ACTIVE);
  const [userTypeFilter, setUserTypeFilter] = useState(UserType.BUSINESS_USER);

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
  }, [debouncedSearchQuery, statusFilter, userTypeFilter, currentPage]);

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
    setIsSubmitting(true);
    try {
      const basePayload = {
        firstName: formData.first_name,
        lastName: formData.last_name,
        phoneNumber: formData.phoneNumber,
        accountStatus: formData.accountStatus,
        profileImageUrl: formData.profileImageUrl,
        address: formData.address,
        roles: formData.roles,
        notes: formData.notes,
        position: formData.position,
      };

      if (mode === ModalMode.CREATE_MODE) {
        const addPayload: CreateUserRequest = {
          ...basePayload,
          email: formData.email,
          userType: formData.userType,
          password: formData.password ?? "",
        };

        const response = await createUserService(addPayload);
        if (response) {
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
          // Refresh data instead of manual state update for consistency
          toast.success(
            `User ${response.username || formData.email} added successfully`
          );
          setIsModalOpen(false);
        }
      } else if (mode === ModalMode.UPDATE_MODE && formData.id) {
        const updatePayload: UpdateUserRequest = {
          ...basePayload,
        };

        const response = await updateUserService(formData.id, updatePayload);
        if (response) {
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
          // Refresh data instead of manual state update for consistency
          toast.success(
            `User ${response.username || formData.email} updated successfully`
          );
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

  const handleEditUser = (user: UserModel) => {
    setSelectedUser(user);
    setMode(ModalMode.UPDATE_MODE);
    setIsModalOpen(!isModalOpen);
  };

  // Handle status filter change - directly updates the filter value
  const handleStatusChange = (status: Status) => {
    setStatusFilter(status);
  };

  const handleUserTypeChange = (userType: UserType) => {
    setUserTypeFilter(userType);
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
                        {header.icon && <header.icon className="w-4 h-4" />}
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
                          {getStatusBadge(user?.accountStatus)}
                        </TableCell>

                        {/* Created At */}
                        <TableCell className="text-sm text-muted-foreground">
                          {DateTimeFormat(user?.createdAt)}
                        </TableCell>

                        {/* Actions */}
                        <TableCell className="text-center">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuItem>View details</DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleEditUser(user)}
                              >
                                Edit user
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem>
                                Reset password
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                {user.accountStatus === "Active"
                                  ? "Deactivate"
                                  : "Activate"}
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-red-600">
                                Delete user
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
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
                setSelectedUser(null);
                setIsModalOpen(false);
              }}
              isSubmitting={isSubmitting}
              onSave={handleSubmit}
              Data={selectedUser}
              mode={mode}
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
