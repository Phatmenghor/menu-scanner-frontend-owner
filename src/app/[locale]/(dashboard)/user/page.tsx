"use client";

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
import { STATUS_FILTER } from "@/constants/AppResource/status/status";
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
import { Check, Edit, Eye, Search, Trash2 } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

export default function UserPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [users, setUsers] = useState<PaginatedUsersResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isExportingToExcel, setIsExportingToExcel] = useState(false);
  const [statusFilter, setStatusFilter] = useState("ALL");

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

  // Handle status filter change - directly updates the filter value
  const handleStatusChange = (status: string) => {
    setStatusFilter(status);
  };

  return (
    <Card>
      <CardContent className="space-y-6 p-6">
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
                        <TableCell>
                          <div className="flex items-center justify-center">
                            <Button
                              variant="ghost"
                              // onClick={() => {
                              //   setSelectedUser(user);
                              //   setIsSidebarOpen(true);
                              // }}
                              className="hover:text-primary"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>

                            <Button
                              variant="ghost"
                              className={cn(
                                "transition-all duration-200 hover:text-primary"
                                // !canModify && "opacity-50 cursor-not-allowed"
                              )}
                              // onClick={() => handleCanEditUser(user, canModify)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>

                            <Button
                              variant="ghost"
                              // onClick={() => {
                              //   if (canModify) {
                              //     setUserToDelete(user);
                              //     setIsDeleteDialogOpen(true);
                              //   } else {
                              //     toast.error(
                              //       "You are not authorized to delete this user."
                              //     );
                              //   }
                              // }}
                              className={cn(
                                "text-destructive hover:text-red-600"
                                // !canModify && "opacity-50 cursor-not-allowed"
                              )}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
