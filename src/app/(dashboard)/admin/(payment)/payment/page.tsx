"use client";

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
import { ModalMode, Status } from "@/constants/AppResource/status/status";
import { UserTableHeaders } from "@/constants/AppResource/table/user/plateform-user";
import { indexDisplay } from "@/utils/common/common";
import { DateTimeFormat } from "@/utils/date/date-time-format";
import { useDebounce } from "@/utils/debounce/debounce";
import {
  ExcelColumn,
  ExcelExporter,
  ExcelSheet,
} from "@/utils/export-file/excel";
import { Plus, RotateCw, Trash } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { usePathname, useSearchParams } from "next/navigation";
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
  updateUserService,
} from "@/services/dashboard/user/plateform-user/plateform-user.service";
import { DeleteConfirmationDialog } from "@/components/shared/dialog/dialog-delete";
import { AppToast } from "@/components/shared/toast/app-toast";
import { CardHeaderSection } from "@/components/layout/main/card-header-section";
import { UserFormData } from "@/models/dashboard/user/plateform-user/user.schema";
import {
  AllPayment,
  PaymentModel,
} from "@/models/dashboard/payment/payment/payment.response.model";
import { getAllPaymentService } from "@/services/dashboard/payment/payment/payment.service";
import { PaymentTableHeader } from "@/constants/AppResource/table/payment/payment";

export default function PaymentPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [payments, setPayment] = useState<AllPayment | null>(null);
  const [initializePayment, setInitializePayment] =
    useState<UserFormData | null>(null);
  const [selectedPayment, setSelectedPayment] = useState<PaymentModel | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [mode, setMode] = useState<ModalMode>(ModalMode.CREATE_MODE);
  const [isExportingToExcel, setIsExportingToExcel] = useState(false);
  const [statusFilter, setStatusFilter] = useState<Status>(Status.ACTIVE);
  const [isUserDetailOpen, setIsUserDetailOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedUserToggle, setSelectedUserToggle] =
    useState<UserModel | null>(null);
  const [isToggleStatusDialogOpen, setIsToggleStatusDialogOpen] =
    useState(false);

  // Debounced search query - Optimized api performance when search
  const debouncedSearchQuery = useDebounce(searchQuery, 400);

  const searchParams = useSearchParams();

  const { currentPage, updateUrlWithPage, handlePageChange, getDisplayIndex } =
    usePagination({
      baseRoute: ROUTES.DASHBOARD.PAYMENT,
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

  const loadPayment = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await getAllPaymentService({
        search: debouncedSearchQuery,
        pageNo: currentPage,
        pageSize: 10,
      });
      console.log("Fetched payments:", response);
      setPayment(response);
    } catch (error: any) {
      console.log("Failed to fetch payments: ", error);
    } finally {
      setIsLoading(false);
    }
  }, [debouncedSearchQuery, statusFilter, currentPage]);

  useEffect(() => {
    loadPayment();
  }, [loadPayment]);

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

  async function handleDeleteUser() {
    if (!selectedPayment || !selectedPayment.id) return;

    setIsSubmitting(true);
    try {
      const response = await deletedUserService(selectedPayment.id);

      if (response) {
        AppToast({
          type: "success",
          message: `Payment ${
            selectedPayment.referenceNumber ?? ""
          } deleted successfully`,
          duration: 4000,
          position: "top-right",
        });
        // After deletion, check if we need to go back a page
        if (payments && payments.content.length === 1 && currentPage > 1) {
          updateUrlWithPage(currentPage - 1);
        } else {
          await loadPayment();
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
        setPayment((prev) =>
          prev
            ? {
                ...prev,
                content: prev.content.map((payment) =>
                  payment.id === selectedUserToggle?.id ? response : payment
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
        loadPayment(); // reload in case of failure
      }
    } catch (error: any) {
      toast.error(
        error?.message || "An error occurred while updating user status"
      );
      loadPayment(); // reload in case of failure
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = (payment: PaymentModel) => {
    setSelectedPayment(payment);
    setIsDeleteDialogOpen(true);
  };

  const handleCloseViewUserDetail = () => {
    setSelectedPayment(null);
    setIsUserDetailOpen(false);
  };

  const handleResetFilters = () => {
    setStatusFilter(Status.ACTIVE);
    setSearchQuery("");
    updateUrlWithPage(1, true);
    setPayment(null); // Reset users to trigger reload};
    loadPayment(); // Reload users with default filters
  };

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <div className="space-y-6">
        <CardHeaderSection
          breadcrumbs={[
            { label: "Dashboard", href: ROUTES.DASHBOARD.INDEX },
            { label: "Payment List", href: "" },
          ]}
          title="Payment"
          searchValue={searchQuery}
          searchPlaceholder="Search..."
          buttonIcon={<Plus className="w-3 h-3" />}
          buttonText="new"
          onSearchChange={handleSearchChange}
          openModal={() => {
            setIsModalOpen(!isModalOpen);
            setMode(ModalMode.CREATE_MODE);
          }}
          handleResetFilters={handleResetFilters}
          disableReset={!statusFilter}
        />

        <div className="w-full">
          <Separator className="bg-gray-300" />
        </div>

        <div>
          <div className="rounded-md border overflow-x-auto whitespace-nowrap">
            <Table>
              <TableHeader>
                <TableRow>
                  {PaymentTableHeader.map((header, index) => (
                    <TableHead
                      key={index}
                      className="font-semibold text-muted-foreground"
                    >
                      <div className={`flex items-center gap-1`}>
                        <span>{header.label}</span>
                      </div>
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {!payments || payments.content.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={UserTableHeaders.length}
                      className="text-center py-8 text-muted-foreground"
                    >
                      No users found
                    </TableCell>
                  </TableRow>
                ) : (
                  payments.content.map((payment, index) => {
                    const profileImageUrl =
                      payment?.imageUrl && process.env.NEXT_PUBLIC_API_BASE_URL
                        ? `${process.env.NEXT_PUBLIC_API_BASE_URL}${payment.imageUrl}`
                        : undefined;

                    return (
                      <TableRow key={payment.id} className="text-sm">
                        {/* Index */}
                        <TableCell className="font-medium truncate">
                          {indexDisplay(
                            payments.pageNo,
                            payments.pageSize,
                            index
                          )}
                        </TableCell>

                        {/* Avatar */}
                        <TableCell>
                          <div className="flex items-center gap-3 min-w-[180px]">
                            <Avatar className="h-10 w-10 border-2 border-background dark:border-card shadow-sm group-hover:border-primary/30 transition-all">
                              <AvatarImage
                                src={payment.imageUrl ? profileImageUrl : ""}
                                alt="Profile"
                              />
                              <AvatarFallback className="bg-primary/10 dark:bg-primary/20 text-primary font-semibold">
                                {payment?.planName?.charAt(0).toUpperCase() ||
                                  "U"}
                              </AvatarFallback>
                            </Avatar>
                          </div>
                        </TableCell>

                        <TableCell className="text-muted-foreground">
                          {payment?.businessName || "---"}
                        </TableCell>

                        <TableCell className="text-muted-foreground">
                          {payment?.planName || "---"}
                        </TableCell>

                        <TableCell className="text-muted-foreground">
                          {payment?.subscriptionDisplayName || "---"}
                        </TableCell>

                        <TableCell className="text-muted-foreground">
                          {payment?.formattedAmount || "---"}
                        </TableCell>

                        <TableCell className="text-muted-foreground">
                          {payment?.formattedAmountKhr || "---"}
                        </TableCell>

                        <TableCell className="text-muted-foreground">
                          {payment?.paymentMethod || "---"}
                        </TableCell>

                        <TableCell className="text-muted-foreground">
                          {payment?.statusDescription || "---"}
                        </TableCell>

                        <TableCell className="text-muted-foreground">
                          {payment?.referenceNumber || "---"}
                        </TableCell>

                        {/* Created At */}
                        <TableCell className="text-sm text-muted-foreground">
                          {DateTimeFormat(payment?.createdAt)}
                        </TableCell>

                        {/* Actions */}
                        <TableCell className="text-center space-x-2">
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDelete(payment)}
                          >
                            <RotateCw className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDelete(payment)}
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

            <DeleteConfirmationDialog
              isOpen={isDeleteDialogOpen}
              onClose={() => {
                setIsDeleteDialogOpen(false);
                setSelectedPayment(null);
              }}
              onDelete={handleDeleteUser}
              title="Delete Admin"
              description={`Are you sure you want to delete the admin`}
              itemName={
                selectedPayment?.paymentMethod ||
                selectedPayment?.referenceNumber
              }
              isSubmitting={isSubmitting}
            />

            <PaginationPage
              currentPage={currentPage}
              totalPages={payments?.totalPages ?? 10}
              onPageChange={handlePageChange}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
