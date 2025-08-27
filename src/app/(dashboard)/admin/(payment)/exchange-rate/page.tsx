"use client";

import { RoleBadge } from "@/components/shared/badge/role-badge";
import { Button } from "@/components/ui/button";
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
  UserRole,
  UserGropeType,
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
import { Pen, Plus, Trash } from "lucide-react";
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
  createUserService,
  deletedUserService,
  updateUserService,
} from "@/services/dashboard/user/plateform-user/plateform-user.service";
import {
  CreateUserRequest,
  UpdateUserRequest,
} from "@/models/dashboard/user/plateform-user/user.request";
import UserPlatformModal from "@/components/shared/modal/user-platform-modal";
import { DeleteConfirmationDialog } from "@/components/shared/dialog/dialog-delete";
import { AppToast } from "@/components/shared/toast/app-toast";
import { ConfirmDialog } from "@/components/shared/dialog/dialog-confirm";
import { CardHeaderSection } from "@/components/layout/card-header-section";
import { UserFormData } from "@/models/dashboard/user/plateform-user/user.schema";
import {
  createExchangeRateService,
  getAllExchangeRateService,
  updateExchangeRateService,
} from "@/services/dashboard/payment/exchange-rate/exchange-rate.service";
import {
  AllExchangeRate,
  ExchangeRateModel,
} from "@/models/dashboard/payment/exchange-rate/exchange-rate.response.model";
import { ExchangeRateTableHeaders } from "@/constants/AppResource/table/payment/exchange-rate";
import ModalExchangeRate from "@/components/shared/modal/exchange-rate-modal";
import { ExchangeRateFormData } from "@/models/dashboard/payment/exchange-rate/exchange-rate.schema";
import { SaveExchangeRateRequest } from "@/models/dashboard/payment/exchange-rate/exchange-rate.request.model";

export default function ExchangeRatePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [exchangeRate, setExchangeRate] = useState<AllExchangeRate | null>(
    null
  );
  const [initializeExchangeRate, setInitializeExchangeRate] =
    useState<ExchangeRateModel | null>(null);
  const [selectedExchangeRate, setSelectedExchangeRate] =
    useState<ExchangeRateModel | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [mode, setMode] = useState<ModalMode>(ModalMode.CREATE_MODE);
  const [isExportingToExcel, setIsExportingToExcel] = useState(false);
  const [statusFilter, setStatusFilter] = useState<Status>(Status.ACTIVE);
  const [userTypeFilter, setUserTypeFilter] = useState<UserGropeType>(
    UserGropeType.PLATFORM_USER
  );
  const [isUserDetailOpen, setIsUserDetailOpen] = useState(false);

  const [roleFilter, setRoleFilter] = useState<UserRole>(
    UserRole.PLATFORM_OWNER
  );
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isResetPasswordDialogOpen, setIsResetPasswordDialogOpen] =
    useState(false);
  const [selectedExchangeRateToggle, setselectedExchangeRateToggle] =
    useState<UserModel | null>(null);
  const [isToggleStatusDialogOpen, setIsToggleStatusDialogOpen] =
    useState(false);
  const [roleFilterOpen, setRoleFilterOpen] = useState(false);

  // Debounced search query - Optimized api performance when search
  const debouncedSearchQuery = useDebounce(searchQuery, 400);

  const searchParams = useSearchParams();

  const { currentPage, updateUrlWithPage, handlePageChange, getDisplayIndex } =
    usePagination({
      baseRoute: ROUTES.DASHBOARD.EXCHANGE_RATE,
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
      const response = await getAllExchangeRateService({
        search: debouncedSearchQuery,
        pageNo: currentPage,
        pageSize: 10,
      });
      console.log("Fetched exchange rate:", response);
      setExchangeRate(response);
    } catch (error: any) {
      console.log("Failed to fetch exchange rate: ", error);
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

  async function handleSubmit(formData: ExchangeRateFormData) {
    console.log("Submitting form:", formData, "mode:", mode);

    setIsSubmitting(true);
    try {
      const isCreate = mode === ModalMode.CREATE_MODE;

      const payload: SaveExchangeRateRequest = {
        usdToKhrRate: formData.usdToKhrRate,
        notes: formData.notes,
      };
      if (isCreate) {
        const response = await createExchangeRateService(payload);
        if (response) {
          // Update users list
          setExchangeRate((prev) =>
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
            message: `Exchange Rate save added successfully`,
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

        const response = await updateExchangeRateService(formData.id, payload);
        if (response) {
          // Update users list
          setExchangeRate((prev) =>
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
      console.error("Error saving exchange rate form:", error);
      toast.error(error.message || "An unexpected error occurred");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleDeleteUser() {
    if (!selectedExchangeRate || !selectedExchangeRate.id) return;

    setIsSubmitting(true);
    try {
      const response = await deletedUserService(selectedExchangeRate.id);

      if (response) {
        AppToast({
          type: "success",
          message: `Exchange Rate deleted successfully`,
          duration: 4000,
          position: "top-right",
        });
        // After deletion, check if we need to go back a page
        if (
          exchangeRate &&
          exchangeRate.content.length === 1 &&
          currentPage > 1
        ) {
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

  const handleEditUser = (ex: ExchangeRateModel | null) => {
    setInitializeExchangeRate(ex);
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
        setExchangeRate((prev) =>
          prev
            ? {
                ...prev,
                content: prev.content.map((user) =>
                  user.id === selectedExchangeRateToggle?.id ? response : user
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
        setselectedExchangeRateToggle(null);
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

  const handleDelete = (user: ExchangeRateModel) => {
    setSelectedExchangeRate(user);
    setIsDeleteDialogOpen(true);
  };

  const handleResetFilters = () => {
    setUserTypeFilter(UserGropeType.PLATFORM_USER);
    setRoleFilter(UserRole.PLATFORM_OWNER);
    setStatusFilter(Status.ACTIVE);
    setSearchQuery("");
    updateUrlWithPage(1, true);
    setExchangeRate(null); // Reset users to trigger reload};
    loadUsers(); // Reload users with default filters
  };

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <div className="space-y-6">
        <CardHeaderSection
          breadcrumbs={[
            { label: "Dashboard", href: ROUTES.DASHBOARD.INDEX },
            { label: "Exchange Rates List", href: "" },
          ]}
          title="Exchange Rates"
          searchValue={searchQuery}
          searchPlaceholder="Search..."
          buttonIcon={<Plus className="w-3 h-3" />}
          buttonText="New"
          onSearchChange={handleSearchChange}
          openModal={() => {
            setIsModalOpen(!isModalOpen);
            setMode(ModalMode.CREATE_MODE);
          }}
          handleResetFilters={handleResetFilters}
          disableReset={!roleFilter && !statusFilter && !userTypeFilter}
        ></CardHeaderSection>

        <div className="w-full">
          <Separator className="bg-gray-300" />
        </div>

        <div>
          <div className="rounded-md border overflow-x-auto whitespace-nowrap">
            <Table>
              <TableHeader>
                <TableRow>
                  {ExchangeRateTableHeaders.map((header, index) => (
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
                {!exchangeRate || exchangeRate.content.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={UserTableHeaders.length}
                      className="text-center py-8 text-muted-foreground"
                    >
                      No users found
                    </TableCell>
                  </TableRow>
                ) : (
                  exchangeRate.content.map((e, index) => {
                    return (
                      <TableRow key={e.id} className="text-sm">
                        {/* Index */}
                        <TableCell className="font-medium truncate">
                          {indexDisplay(
                            exchangeRate.pageNo,
                            exchangeRate.pageSize,
                            index
                          )}
                        </TableCell>

                        <TableCell className="text-xs text-muted-foreground">
                          {e?.usdToKhrRate || "---"}
                        </TableCell>

                        <TableCell className="text-xs">
                          <span
                            className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${
                              e.isActive
                                ? "bg-green-100 text-green-700"
                                : "bg-red-100 text-red-700"
                            }`}
                          >
                            {e.isActive ? "Active" : "Inactive"}
                          </span>
                        </TableCell>

                        {/* Role */}
                        <TableCell
                          className="text-xs text-muted-foreground max-w-[200px] truncate"
                          title={e.notes || "---"}
                        >
                          {e.notes || "---"}
                        </TableCell>

                        <TableCell className="text-xs text-muted-foreground">
                          {e.createdBy}
                        </TableCell>

                        <TableCell className="text-xs text-muted-foreground">
                          {e.updatedBy}
                        </TableCell>

                        {/* Created At */}
                        <TableCell className="text-sm text-muted-foreground">
                          {dateTimeFormat(e?.createdAt)}
                        </TableCell>

                        {/* Updated At */}
                        <TableCell className="text-sm text-muted-foreground">
                          {dateTimeFormat(e?.updatedAt)}
                        </TableCell>

                        {/* Actions */}
                        <TableCell className="text-center space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditUser(e)}
                          >
                            <Pen className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDelete(e)}
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

            <ModalExchangeRate
              isOpen={isModalOpen}
              onClose={() => {
                setInitializeExchangeRate(null);
                setIsModalOpen(false);
              }}
              isSubmitting={isSubmitting}
              onSave={handleSubmit}
              Data={initializeExchangeRate}
              mode={mode}
            />

            <DeleteConfirmationDialog
              isOpen={isDeleteDialogOpen}
              onClose={() => {
                setIsDeleteDialogOpen(false);
                setSelectedExchangeRate(null);
              }}
              onDelete={handleDeleteUser}
              title="Delete Exchange Rate"
              description={`Are you sure you want to delete the exchange rate`}
              isSubmitting={isSubmitting}
            />

            <ConfirmDialog
              open={isToggleStatusDialogOpen}
              onOpenChange={() => {
                setIsToggleStatusDialogOpen(false);
                setselectedExchangeRateToggle(null);
              }}
              centered={true}
              title="Change User Status"
              description={`Are you sure you want to ${
                selectedExchangeRateToggle?.accountStatus === "ACTIVE"
                  ? "disable"
                  : "enable"
              } this user: ${selectedExchangeRateToggle?.email}?`}
              confirmButton={{
                text: `${
                  selectedExchangeRateToggle?.accountStatus === "ACTIVE"
                    ? "Disable"
                    : "Enable"
                }`,
                onClick: () => handleStatusToggle(selectedExchangeRateToggle),
                variant: "primary",
              }}
              cancelButton={{ text: "Cancel", variant: "secondary" }}
              onConfirm={() => handleStatusToggle(selectedExchangeRateToggle)}
            />

            <PaginationPage
              currentPage={currentPage}
              totalPages={exchangeRate?.totalPages ?? 10}
              onPageChange={handlePageChange}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
