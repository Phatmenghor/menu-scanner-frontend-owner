"use client";

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
  STATUS_FILTER,
} from "@/constants/AppResource/status/status";
import { indexDisplay } from "@/utils/common/common";
import { DateTimeFormat, formatDate } from "@/utils/date/date-time-format";
import { useDebounce } from "@/utils/debounce/debounce";
import {
  ExcelColumn,
  ExcelExporter,
  ExcelSheet,
} from "@/utils/export-file/excel";
import { Eye, Pen, Plus, RotateCcw, Trash, X } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { usePagination } from "@/hooks/use-pagination";
import { ROUTES } from "@/constants/AppRoutes/routes";
import PaginationPage from "@/components/shared/common/app-pagination";
import { AllUserResponse } from "@/models/dashboard/user/plateform-user/user.response";
import { DeleteConfirmationDialog } from "@/components/shared/dialog/dialog-delete";
import { AppToast } from "@/components/shared/toast/app-toast";
import { CardHeaderSection } from "@/components/layout/card-header-section";
import {
  cancelSubscriptionService,
  createSubscriptionService,
  deletedSubscriptionService,
  getAllSubscriptionService,
  renewSubscriptionService,
  updateSubscriptionService,
} from "@/services/dashboard/subscription/subscription.service";
import { SubscriptionTableHeaders } from "@/constants/AppResource/table/user/subscription";
import {
  AllSubscriptionResponse,
  SubscriptionModel,
} from "@/models/dashboard/subscription/subscription.response.model";
import { SubscriptionFormData } from "@/models/dashboard/subscription/subscription.schema";
import {
  CancelSubscriptionRequest,
  CreateSubscriptionRequest,
  RenewSubscriptionRequest,
  UpdateSubscriptionRequest,
} from "@/models/dashboard/subscription/subscription.request.model";
import ModalSubscription from "@/components/shared/modal/subscription-modal";
import { setLoading } from "@/store/features/userSlice";
import { RenewSubscriptionModal } from "@/components/shared/modal/subscription-renew-modal";
import { CancelSubscriptionModal } from "@/components/shared/modal/subscription-cancel-modal";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function SubscriptionPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [subscriptions, setSubscriptions] =
    useState<AllSubscriptionResponse | null>(null);
  const [initializeSubscription, setInitializeSubscription] =
    useState<SubscriptionFormData | null>(null);
  const [selectedSubscription, setSelectedSubscription] =
    useState<SubscriptionModel | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [mode, setMode] = useState<ModalMode>(ModalMode.CREATE_MODE);
  const [isExportingToExcel, setIsExportingToExcel] = useState(false);
  const [statusFilter, setStatusFilter] = useState<Status>(Status.ACTIVE);
  const [isUserDetailOpen, setIsUserDetailOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isRenewModalOpen, setIsRenewModalOpen] = useState(false);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);

  // Debounced search query - Optimized api performance when search
  const debouncedSearchQuery = useDebounce(searchQuery, 400);

  const searchParams = useSearchParams();

  const { currentPage, updateUrlWithPage, handlePageChange, getDisplayIndex } =
    usePagination({
      baseRoute: ROUTES.DASHBOARD.SUBSCRIPTION,
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

  const loadSubs = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await getAllSubscriptionService({
        search: debouncedSearchQuery,
        pageNo: currentPage,
        pageSize: 10,
      });
      console.log("Fetched subscriptions:", response);
      setSubscriptions(response);
    } catch (error: any) {
      console.log("Failed to fetch subscriptions: ", error);
    } finally {
      setIsLoading(false);
    }
  }, [debouncedSearchQuery, currentPage]);

  useEffect(() => {
    loadSubs();
  }, [loadSubs]);

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

  const handleSubmitRenewSubscription = async (
    data: RenewSubscriptionRequest
  ) => {
    if (selectedSubscription?.id === undefined) return;

    setLoading(true);
    try {
      const response = await renewSubscriptionService(
        selectedSubscription?.id,
        {
          customDurationDays: data.customDurationDays,
          newPlanId: data.newPlanId,
          createPayment: data.createPayment,
          paymentAmount: data.paymentAmount,
          paymentImageUrl: data.paymentImageUrl,
          paymentMethod: data.paymentMethod,
          paymentNotes: data.paymentNotes,
          paymentReferenceNumber: data.paymentReferenceNumber,
          paymentStatus: data.paymentStatus,
        }
      );

      if (response) {
        setSubscriptions((prev) =>
          prev
            ? {
                ...prev,
                content: prev.content.map((sub) =>
                  sub.id === selectedSubscription.id
                    ? response.subscription
                    : sub
                ),
              }
            : prev
        );

        AppToast({
          type: "success",
          message: `Subscription renew successfully`,
          duration: 4000,
          position: "top-right",
        });
      } else {
        AppToast({
          type: "error",
          message: `Subscription renew successfully`,
          duration: 4000,
          position: "top-right",
        });
      }
    } catch (error: any) {
      console.error("Error to renew subscription: ", error.message);
    } finally {
      setLoading(false);
    }
  };

  async function handleSubmit(formData: SubscriptionFormData) {
    console.log("Submitting form:", formData, "mode:", mode);

    setIsSubmitting(true);
    try {
      const isCreate = mode === ModalMode.CREATE_MODE;

      if (isCreate) {
        const createPayload: CreateSubscriptionRequest = {
          businessId: formData.businessId!,
          planId: formData.planId,
          autoRenew: formData.autoRenew,
          notes: formData.notes,
          startDate: formData.startDate,
        };

        const response = await createSubscriptionService(createPayload);
        if (response) {
          // Update users list
          setSubscriptions((prev) =>
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
            type: "celebration",
            message: `Subscription added successfully`,
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

        const updatePayload: UpdateSubscriptionRequest = {
          planId: formData.planId,
          autoRenew: formData.autoRenew,
          startDate: formData.startDate,
          endDate: formData.endDate,
          isActive: formData.isActive,
          notes: formData.notes,
        };

        const response = await updateSubscriptionService(
          formData.id,
          updatePayload
        );
        if (response) {
          // Update users list
          setSubscriptions((prev) =>
            prev
              ? {
                  ...prev,
                  content: prev.content.map((sub) =>
                    sub.id === formData.id ? response : sub
                  ),
                }
              : prev
          );

          AppToast({
            type: "success",
            message: `Subscription updated successfully`,
            duration: 4000,
            position: "top-right",
          });

          setIsModalOpen(false);
        }
      }
    } catch (error: any) {
      console.error("Error submitting subscription form:", error);
      toast.error(error.message || "An unexpected error occurred");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleDeleteSubscription() {
    if (!selectedSubscription || !selectedSubscription.id) return;

    setIsSubmitting(true);
    try {
      const response = await deletedSubscriptionService(
        selectedSubscription.id
      );

      if (response) {
        AppToast({
          type: "success",
          message: `Subscription ${
            selectedSubscription.planName ?? ""
          } deleted successfully`,
          duration: 4000,
          position: "top-right",
        });
        // After deletion, check if we need to go back a page
        if (
          subscriptions &&
          subscriptions.content.length === 1 &&
          currentPage > 1
        ) {
          updateUrlWithPage(currentPage - 1);
        } else {
          await loadSubs();
        }
      } else {
        AppToast({
          type: "error",
          message: `Failed to delete subscription`,
          duration: 4000,
          position: "top-right",
        });
      }
    } catch (error) {
      console.error("Error deleting subscription:", error);
      toast.error("An error occurred while deleting the subscription");
    } finally {
      setIsSubmitting(false);
      setIsDeleteDialogOpen(false);
    }
  }

  const handleSubmitCancelSubscription = async (
    data: CancelSubscriptionRequest
  ) => {
    if (!selectedSubscription) return;

    setLoading(true);

    try {
      const response = await cancelSubscriptionService(
        selectedSubscription.id,
        {
          reason: data?.reason ?? undefined,
          notes: data?.notes ?? undefined,
          refundAmount: data?.refundAmount ?? null,
          refundNotes: data?.refundNotes ?? null,
        }
      );

      if (response) {
        setSubscriptions((prev) =>
          prev
            ? {
                ...prev,
                content: prev.content.map((sub) =>
                  sub.id === selectedSubscription.id
                    ? response.subscription
                    : sub
                ),
              }
            : prev
        );

        AppToast({
          type: "success",
          message: `Subscription cancelled successfully`,
          duration: 4000,
          position: "top-right",
        });
      } else {
        AppToast({
          type: "error",
          message: `Failed to cancel subscription`,
          duration: 4000,
          position: "top-right",
        });
      }
    } catch (error: any) {
      console.error("Error cancelling subscription: ", error.message);

      AppToast({
        type: "error",
        message: error?.response?.data?.message || "Unexpected error occurred",
        duration: 4000,
        position: "top-right",
      });
    } finally {
      setLoading(false);
    }
  };

  // Handle status filter change - directly updates the filter value
  const handleStatusChange = (status: Status) => {
    setStatusFilter(status);
  };

  const handleDelete = (sub: SubscriptionModel) => {
    setSelectedSubscription(sub);
    setIsDeleteDialogOpen(true);
  };

  const handleRenewSubscription = (sub: SubscriptionModel) => {
    setSelectedSubscription(sub);
    setIsRenewModalOpen(true);
  };

  const handleCancelSubscription = (sub: SubscriptionModel) => {
    setSelectedSubscription(sub);
    setIsCancelModalOpen(true);
  };

  const handleViewSubscriptionDetail = (sub: SubscriptionModel | null) => {
    setSelectedSubscription(sub);
    setIsUserDetailOpen(true);
  };

  const handleCloseViewSubscriptionDetail = () => {
    setSelectedSubscription(null);
    setIsUserDetailOpen(false);
  };

  const handleResetFilters = () => {
    setSearchQuery("");
    updateUrlWithPage(1, true);
    setSubscriptions(null); // Reset users to trigger reload};
    loadSubs(); // Reload users with default filters
  };

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <div className="space-y-6">
        <CardHeaderSection
          breadcrumbs={[
            { label: "Dashboard", href: ROUTES.DASHBOARD.INDEX },
            { label: "Subscription List", href: "" },
          ]}
          title="Subscription"
          searchValue={searchQuery}
          searchPlaceholder="Search..."
          buttonIcon={<Plus className="w-3 h-3" />}
          buttonText="Add new"
          onSearchChange={handleSearchChange}
          openModal={() => {
            setIsModalOpen(!isModalOpen);
            setMode(ModalMode.CREATE_MODE);
          }}
          handleResetFilters={handleResetFilters}
          disableReset={!statusFilter}
        >
          <div className="flex items-center gap-3">
            {/* Status Filter */}
            <Select value={statusFilter} onValueChange={handleStatusChange}>
              <SelectTrigger className="min-w-[150px] text-black h-9 text-sm">
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
          </div>
        </CardHeaderSection>

        <div className="w-full">
          <Separator className="bg-gray-300" />
        </div>

        <div>
          <div className="rounded-md border overflow-x-auto whitespace-nowrap">
            <Table>
              <TableHeader>
                <TableRow>
                  {SubscriptionTableHeaders.map((header, index) => (
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
                {!subscriptions || subscriptions.content.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={SubscriptionTableHeaders.length}
                      className="text-center py-8 text-muted-foreground"
                    >
                      No subscriptions found
                    </TableCell>
                  </TableRow>
                ) : (
                  subscriptions.content.map((sub, index) => {
                    return (
                      <TableRow key={sub.id} className="text-sm">
                        {/* Index */}
                        <TableCell className="font-medium truncate">
                          {indexDisplay(
                            subscriptions.pageNo,
                            subscriptions.pageSize,
                            index
                          )}
                        </TableCell>

                        <TableCell className="text-muted-foreground">
                          {sub?.businessName || "---"}
                        </TableCell>

                        <TableCell className="text-muted-foreground">
                          {sub?.planName || "---"}
                        </TableCell>

                        <TableCell className="text-muted-foreground">
                          {sub?.planPrice || "---"}$
                        </TableCell>

                        <TableCell className="text-muted-foreground">
                          {sub?.planDurationDays || "---"}
                        </TableCell>

                        <TableCell className="text-muted-foreground">
                          {formatDate(sub?.startDate) || "---"}
                        </TableCell>

                        <TableCell className="text-muted-foreground">
                          {formatDate(sub?.endDate) || "---"}
                        </TableCell>

                        <TableCell className="text-muted-foreground">
                          {sub?.daysRemaining || "---"}
                        </TableCell>

                        <TableCell className="text-xs">
                          {sub?.isExpired ? (
                            <span className="px-2 py-1 rounded-full text-red-700 bg-red-100 font-medium">
                              Expired
                            </span>
                          ) : sub?.isActive ? (
                            <span className="px-2 py-1 rounded-full text-green-700 bg-green-100 font-medium">
                              Active
                            </span>
                          ) : (
                            <span className="px-2 py-1 rounded-full text-yellow-800 bg-yellow-100 font-medium">
                              Upcoming
                            </span>
                          )}
                        </TableCell>

                        <TableCell>
                          {sub?.autoRenew === true ? (
                            <span className="px-2 py-1 text-xs font-medium text-green-700 bg-green-100 rounded-full">
                              Yes
                            </span>
                          ) : sub?.autoRenew === false ? (
                            <span className="px-2 py-1 text-xs font-medium text-red-700 bg-red-100 rounded-full">
                              No
                            </span>
                          ) : (
                            <span className="text-muted-foreground">---</span>
                          )}
                        </TableCell>

                        <TableCell className="text-muted-foreground">
                          {`${sub?.totalPaidAmount}$` || "---"}
                        </TableCell>

                        <TableCell className="text-muted-foreground">
                          {sub?.paymentStatusSummary || "---"}
                        </TableCell>

                        {/* Created At */}
                        <TableCell className="text-sm text-muted-foreground">
                          {DateTimeFormat(sub?.createdAt) || "---"}
                        </TableCell>

                        <TableCell className="text-center">
                          <div className="flex justify-center items-center gap-2">
                            <TooltipProvider>
                              {/* Renew */}
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="rounded-full transition-all hover:scale-105"
                                    onClick={() => handleRenewSubscription(sub)}
                                  >
                                    <RotateCcw className="w-4 h-4" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>Renew</TooltipContent>
                              </Tooltip>

                              {/* Cancel */}
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="rounded-full transition-all hover:scale-105"
                                    onClick={() =>
                                      handleCancelSubscription(sub)
                                    }
                                  >
                                    <X className="w-4 h-4" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>Cancel</TooltipContent>
                              </Tooltip>

                              {/* Delete */}
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="rounded-full transition-all hover:scale-105"
                                    onClick={() => handleDelete(sub)}
                                  >
                                    <Trash className="w-4 h-4 text-muted-foreground" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>Delete</TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>

            <ModalSubscription
              isOpen={isModalOpen}
              onClose={() => {
                setInitializeSubscription(null);
                setIsModalOpen(false);
              }}
              isSubmitting={isSubmitting}
              onSave={handleSubmit}
              Data={initializeSubscription}
              mode={mode}
            />

            {/* <UserDetailSheet
              onClose={handleCloseViewSubscriptionDetail}
              open={isUserDetailOpen}
              user={selectedSubscription}
            /> */}

            <RenewSubscriptionModal
              onOpenChange={() => {
                setSelectedSubscription(null);
                setIsRenewModalOpen(false);
              }}
              onSubmit={handleSubmitRenewSubscription}
              open={isRenewModalOpen}
              subscription={selectedSubscription}
            />

            <CancelSubscriptionModal
              onOpenChange={() => {
                setSelectedSubscription(null);
                setIsCancelModalOpen(false);
              }}
              onSubmit={handleSubmitCancelSubscription}
              open={isCancelModalOpen}
              subscription={selectedSubscription}
            />

            <DeleteConfirmationDialog
              isOpen={isDeleteDialogOpen}
              onClose={() => {
                setSelectedSubscription(null);
                setIsDeleteDialogOpen(false);
              }}
              onDelete={handleDeleteSubscription}
              title="Delete Admin"
              description={`Are you sure you want to delete the admin`}
              itemName={
                selectedSubscription?.planName ||
                selectedSubscription?.displayName
              }
              isSubmitting={isSubmitting}
            />

            <PaginationPage
              currentPage={currentPage}
              totalPages={subscriptions?.totalPages ?? 10}
              onPageChange={handlePageChange}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
