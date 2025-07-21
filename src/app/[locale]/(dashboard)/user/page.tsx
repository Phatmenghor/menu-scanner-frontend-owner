"use client";

import { StatsCards } from "@/components/index/dashboard/state-card";
import { RoleBadge } from "@/components/shared/badge/role-badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
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
  STATUS_FILTER,
} from "@/constants/AppResource/status/status";
import {
  getUserTableHeaders,
  UserTableHeaders,
} from "@/constants/AppResource/table/table";
import { cn } from "@/lib/utils";
import {
  getUsersService,
  PaginatedUsersResponse,
  User,
} from "@/services/dashboard/user/user.service";
import { indexDisplay } from "@/utils/common/common";
import { DateTimeFormat } from "@/utils/date/date-time-format";
import { useDebounce } from "@/utils/debounce/debounce";
import {
  ExcelColumn,
  ExcelExporter,
  ExcelSheet,
} from "@/utils/export-file/excel";
import { Check, MoreHorizontal, Search, UserPlus } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { usePathname } from "next/navigation";
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
import ModalUser from "@/components/shared/modal/modal";

export default function UserPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [users, setUsers] = useState<PaginatedUsersResponse | null>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [mode, setMode] = useState<ModalMode>(ModalMode.CREATE_MODE);
  const [isExportingToExcel, setIsExportingToExcel] = useState(false);
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [roleFilter, setRoleFilter] = useState("all");

  const t = useTranslations("user");
  const headers = getUserTableHeaders(t);
  const locale = useLocale();
  const pathname = usePathname();

  console.log("Page Debug:", { locale, pathname });

  // Debounced search query - Optimized api performance when search
  const debouncedSearchQuery = useDebounce(searchQuery, 400);

  const loadUsers = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await getUsersService();
      setUsers(response);
    } catch (error: any) {
      console.log("Failed to fetch users: ", error);
    } finally {
      setIsLoading(false);
    }
  }, [debouncedSearchQuery, statusFilter]);

  useEffect(() => {
    loadUsers();
  }, [loadUsers, debouncedSearchQuery, statusFilter]);

  // Simplified search change handler - just updates the state, debouncing handles the rest
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleExportToPdf = async (data: PaginatedUsersResponse | null) => {
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

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setMode(ModalMode.UPDATE_MODE);
    setIsModalOpen(!isModalOpen);
  };

  // Handle status filter change - directly updates the filter value
  const handleStatusChange = (status: string) => {
    setStatusFilter(status);
  };

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <StatsCards />
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
          <div className="flex items-center gap-2">
            <Select
              value={statusFilter}
              onValueChange={handleStatusChange}
              disabled={isSubmitting}
            >
              <SelectTrigger className="w-[150px] text-xs h-9">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                {STATUS_FILTER.map((option) => (
                  <SelectItem
                    className="text-xs"
                    key={option.value}
                    value={option.value}
                  >
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-[130px]">
                <SelectValue placeholder="Role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="moderator">Moderator</SelectItem>
                <SelectItem value="user">User</SelectItem>
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

                        {/* Role */}
                        <TableCell className="text-xs text-muted-foreground">
                          <RoleBadge role={user?.role} />
                        </TableCell>

                        {/* Status Switch */}
                        <TableCell>
                          <Switch
                            checked={user?.status === "ACTIVE"}
                            // onCheckedChange={() => handleCanToggle(user, canModify)}
                            // disabled={isSubmitting || !canModify}
                            aria-label="Toggle user status"
                            className={cn(
                              "relative inline-flex h-6 w-10 items-center rounded-full transition-colors",
                              // canModify
                              1
                                ? "bg-gray-300 dark:bg-gray-600 data-[state=checked]:bg-primary dark:data-[state=checked]:bg-primary"
                                : "bg-gray-300 dark:bg-primary opacity-50 cursor-not-allowed"
                            )}
                          >
                            <div
                              className={cn(
                                "inline-block h-5 w-5 transform rounded-full bg-white dark:bg-gray-100 shadow-md transition-transform",
                                "translate-x-1 data-[state=checked]:translate-x-5"
                              )}
                            >
                              {user.status === "ACTIVE" && (
                                <Check className="h-3 w-3 m-auto text-orange-600 dark:text-orange-300" />
                              )}
                            </div>
                          </Switch>
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
                                {user.status === "Active"
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
              onSave={() => {}}
              Data={selectedUser}
              mode={mode}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
