"use client";

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
  BUSINESS_STATUS_OPTIONS,
  BusinessStatus,
  ModalMode,
  Status,
  SUBSCRIPTION_PLAN_OPTIONS,
  SubscriptionPlanStatus,
  UserRole,
  UserType,
} from "@/constants/AppResource/status/status";
import {
  BusinessTableHeaders,
  getUserTableHeaders,
} from "@/constants/AppResource/table/table";
import { indexDisplay } from "@/utils/common/common";
import { DateTimeFormat } from "@/utils/date/date-time-format";
import { useDebounce } from "@/utils/debounce/debounce";
import {
  ExcelColumn,
  ExcelExporter,
  ExcelSheet,
} from "@/utils/export-file/excel";
import {
  Check,
  Download,
  Edit,
  Eye,
  Plus,
  RotateCw,
  Search,
  Trash,
  UserPlus,
} from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { usePathname, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { usePagination } from "@/hooks/use-pagination";
import { ROUTES } from "@/constants/AppRoutes/routes";
import PaginationPage from "@/components/shared/common/app-pagination";
import { updateUserService } from "@/services/dashboard/user/user.service";
import ResetPasswordModal from "@/components/shared/dialog/dialog-reset-password";
import { DeleteConfirmationDialog } from "@/components/shared/dialog/dialog-delete";
import { AppToast } from "@/components/shared/toast/app-toast";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { ConfirmDialog } from "@/components/shared/dialog/dialog-confirm";
import { BusinessFormData } from "@/models/dashboard/master-data/business/business.schema";
import {
  AllBusinessResponse,
  BusinessModel,
} from "@/models/dashboard/master-data/business/business.response.model";
import {
  createBusinessService,
  deletedBusinessService,
  getAllBusinessService,
  updateBusinessService,
} from "@/services/dashboard/master-data/business/business.service";
import { BusinessStatusBadge } from "@/components/shared/badge/business-status-badge";
import ModalBusiness from "@/components/shared/modal/business-modal";
import { CardHeaderSection } from "@/components/layout/main/card-header-section";
import { AppIcons } from "@/constants/AppResource/icons/AppIcon";
import { BusinessDetailSheet } from "@/components/index/dashboard/master-data/business/business-detail-sheet";
import {
  AllSubscriptionPlan,
  SubscriptionPlanModel,
} from "@/models/dashboard/master-data/subscription-plan/subscription-plan-response";
import { SubscriptionPlanFormData } from "@/models/dashboard/master-data/subscription-plan/subscription-plan.schema";
import {
  createSubscriptionService,
  deletedSubscriptionPlanService,
  getAllSubscriptionService,
  updateSubscriptionPlanService,
} from "@/services/dashboard/master-data/subscrion-plan/subscription-plan.service";
import { CreateSubscriptionPlanRequest } from "@/models/dashboard/master-data/subscription-plan/subscription-plan-request";
import { SubscriptionPlanFilters } from "@/components/index/dashboard/master-data/subscription-plan/subscription-plan-filter";

export default function SubscriptionPlanPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [data, setData] = useState<AllSubscriptionPlan | null>(null);
  const [initializeSubscriptionPlan, setInitializeSubscriptionPlan] =
    useState<SubscriptionPlanFormData | null>(null);
  const [selectedSubscriptionPlan, setSelectedSubscriptionPlan] =
    useState<SubscriptionPlanModel | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isBusinessDetailOpen, setIsBusinessDetailOpen] = useState(false);
  const [mode, setMode] = useState<ModalMode>(ModalMode.CREATE_MODE);
  const [isExportingToExcel, setIsExportingToExcel] = useState(false);
  const [statusFilter, setStatusFilter] = useState<
    SubscriptionPlanStatus | undefined
  >(undefined);
  const [hasSubscription, setHasSubscription] = useState<boolean | undefined>(
    undefined
  );
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isResetPasswordDialogOpen, setIsResetPasswordDialogOpen] =
    useState(false);
  const [selectedBusinessToggle, setSelectedBusinessToggle] =
    useState<BusinessModel | null>(null);
  const [isToggleStatusDialogOpen, setIsToggleStatusDialogOpen] =
    useState(false);

  //filter state
  const [minPrice, setMinPrice] = useState<number | undefined>(undefined);
  const [maxPrice, setMaxPrice] = useState<number | undefined>(undefined);
  const [minDuration, setMinDuration] = useState<number | undefined>(undefined);
  const [maxDuration, setMaxDuration] = useState<number | undefined>(undefined);
  const [publicOnly, setPublicOnly] = useState(false);
  const [freeOnly, setFreeOnly] = useState(false);

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
      baseRoute: ROUTES.DASHBOARD.SUBSCRIPTION_PLAN,
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

  const loadSubscriptionPlan = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await getAllSubscriptionService({
        status: statusFilter,
        freeOnly: freeOnly,
        publicOnly: publicOnly,
        maxDurationDays: maxDuration,
        minDurationDays: minDuration,
        maxPrice: maxPrice,
        minPrice: minPrice,
        search: debouncedSearchQuery,
        pageNo: currentPage,
        pageSize: 10,
      });
      console.log("Fetched subscription plan:", response);
      setData(response);
    } catch (error: any) {
      console.log("Failed to fetch subscription plan: ", error);
    } finally {
      setIsLoading(false);
    }
  }, [
    debouncedSearchQuery,
    statusFilter,
    hasSubscription,
    currentPage,
    maxPrice,
    minPrice,
    minDuration,
    maxDuration,
    publicOnly,
    freeOnly,
  ]);

  useEffect(() => {
    loadSubscriptionPlan();
  }, [loadSubscriptionPlan]);

  // Simplified search change handler - just updates the state, debouncing handles the rest
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleExportToPdf = async (data: AllSubscriptionPlan | null) => {
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

  async function handleSubmit(formData: SubscriptionPlanFormData) {
    console.log("Submitting form:", formData, "mode:", mode);

    setIsSubmitting(true);
    try {
      const isCreate = mode === ModalMode.CREATE_MODE;

      const payload: CreateSubscriptionPlanRequest = {
        name: formData.name,
        durationDays: formData.durationDays,
        price: formData.price,
        description: formData.description,
        status: formData.status,
      };

      if (isCreate) {
        const response = await createSubscriptionService(payload);
        if (response) {
          // Update users list
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
            message: `Subscription Plan ${response.username} added successfully`,
            duration: 4000,
            position: "top-right",
          });

          setIsModalOpen(false);
        }
      } else {
        // Update mode
        if (!formData?.id) {
          throw new Error("Subscription Plan ID is required for update");
        }

        const response = await updateSubscriptionPlanService(
          formData?.id,
          payload
        );
        if (response) {
          // Update users list
          setData((prev) =>
            prev
              ? {
                  ...prev,
                  content: prev.content.map((b) =>
                    b.id === formData.id ? response : b
                  ),
                }
              : prev
          );

          AppToast({
            type: "success",
            message: `Subscription Plan ${
              response.username || response.email
            } updated successfully`,
            duration: 4000,
            position: "top-right",
          });

          setIsModalOpen(false);
        }
      }
    } catch (error: any) {
      console.error("Error submitting Subscription Plan form:", error);
      toast.error(error.message || "An unexpected error occurred");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleDeleteSubscriptionPlan() {
    if (!selectedSubscriptionPlan || !selectedSubscriptionPlan.id) return;

    setIsSubmitting(true);
    try {
      const response = await deletedSubscriptionPlanService(
        selectedSubscriptionPlan.id
      );

      if (response) {
        AppToast({
          type: "success",
          message: `Subscription plan ${
            selectedSubscriptionPlan.name ?? ""
          } deleted successfully`,
          duration: 4000,
          position: "top-right",
        });
        // After deletion, check if we need to go back a page
        if (data && data.content.length === 1 && currentPage > 1) {
          updateUrlWithPage(currentPage - 1);
        } else {
          await loadSubscriptionPlan();
        }
      } else {
        AppToast({
          type: "error",
          message: `Failed to delete Subscription plan`,
          duration: 4000,
          position: "top-right",
        });
      }
    } catch (error) {
      console.error("Error deleting Subscription plan:", error);
      toast.error("An error occurred while deleting the Subscription plan");
    } finally {
      setIsSubmitting(false);
      setIsDeleteDialogOpen(false);
    }
  }

  const handleEdit = (subPlan: SubscriptionPlanModel) => {
    setInitializeSubscriptionPlan(subPlan);
    setMode(ModalMode.UPDATE_MODE);
    setIsModalOpen(!isModalOpen);
  };

  // Status toggle handler
  const handleStatusToggle = async (
    formData: SubscriptionPlanFormData | null
  ) => {
    if (!formData?.id) return;

    setIsSubmitting(true);
    try {
      const newStatus =
        formData?.status === Status.ACTIVE ? Status.INACTIVE : Status.ACTIVE;

      const response = await updateSubscriptionPlanService(formData?.id, {
        status: newStatus,
      });

      if (response) {
        // Optimistic update
        setData((prev) =>
          prev
            ? {
                ...prev,
                content: prev.content.map((b) =>
                  b.id === selectedBusinessToggle?.id ? response : b
                ),
              }
            : prev
        );

        AppToast({
          type: "success",
          message: `Subscription plan status updated successfully`,
          duration: 4000,
          position: "top-right",
        });
        setSelectedBusinessToggle(null);
        setIsToggleStatusDialogOpen(false);
      } else {
        AppToast({
          type: "error",
          message: `Failed to update Subscription plan status`,
          duration: 4000,
          position: "top-right",
        });
        loadSubscriptionPlan(); // reload in case of failure
      }
    } catch (error: any) {
      toast.error(
        error?.message ||
          "An error occurred while updating Subscription plan status"
      );
      loadSubscriptionPlan(); // reload in case of failure
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle status filter change - directly updates the filter value
  const handleStatusChange = (status: SubscriptionPlanStatus) => {
    setStatusFilter(status);
  };

  const handleView = (subPlan: SubscriptionPlanModel | null) => {
    setSelectedSubscriptionPlan(subPlan);
    setIsBusinessDetailOpen(true);
  };

  const handleCloseViewBusinessDetail = () => {
    setSelectedSubscriptionPlan(null);
    setIsBusinessDetailOpen(false);
  };

  const handleDelete = (user: SubscriptionPlanModel) => {
    setSelectedSubscriptionPlan(user);
    setIsDeleteDialogOpen(true);
  };

  const handleResetFilters = () => {
    setStatusFilter(undefined);
    setHasSubscription(undefined);
    setSearchQuery("");
    updateUrlWithPage(1, true);
    setData(null); // Reset users to trigger reload};
    loadSubscriptionPlan(); // Reload users with default filters
    setMinPrice(undefined);
    setMaxPrice(undefined);
    setMinDuration(undefined);
    setMaxDuration(undefined);
    setPublicOnly(false);
    setFreeOnly(false);
  };

  const handleCreateBusiness = () => {
    setIsModalOpen(!isModalOpen);
    setMode(ModalMode.CREATE_MODE);
  };

  const handlePriceChange = (min?: number, max?: number) => {
    setMinPrice(min);
    setMaxPrice(max);
  };

  const handleDurationChange = (min?: number, max?: number) => {
    setMinDuration(min);
    setMaxDuration(max);
  };

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <div className="space-y-6">
        <CardHeaderSection
          breadcrumbs={[
            { label: "Dashboard", href: ROUTES.DASHBOARD.INDEX },
            { label: "Subscription Plan List", href: "" },
          ]}
          title="Subscription Plan"
          searchValue={searchQuery}
          searchPlaceholder="Search..."
          buttonIcon={<Plus className="w-3 h-3" />}
          buttonText="Add new"
          onSearchChange={handleSearchChange}
          openModal={handleCreateBusiness}
          children={
            <SubscriptionPlanFilters
              statusFilter={statusFilter}
              onStatusChange={handleStatusChange}
              minPrice={minPrice}
              maxPrice={maxPrice}
              onPriceChange={handlePriceChange}
              minDuration={minDuration}
              maxDuration={maxDuration}
              onDurationChange={handleDurationChange}
              publicOnly={publicOnly}
              freeOnly={freeOnly}
              setPublicOnly={setPublicOnly}
              setFreeOnly={setFreeOnly}
              onExport={() => handleExportToPdf(data)}
              onReset={handleResetFilters}
              disableReset={!statusFilter && !publicOnly && !freeOnly}
            />
          }
        />

        <div className="w-full">
          <Separator className="bg-gray-300" />
        </div>

        <div>
          <div className="rounded-md border overflow-x-auto whitespace-nowrap">
            <Table>
              <TableHeader>
                <TableRow>
                  {[
                    "No",
                    "Plan Name",
                    "Price",
                    "Duration",
                    "Status",
                    "Subscriptions",
                    "Visibility",
                    "Created At",
                    "Actions",
                  ].map((header, index) => (
                    <TableHead
                      key={index}
                      className="text-xs font-semibold text-muted-foreground"
                    >
                      <span>{header}</span>
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {!data || data.content.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={9}
                      className="text-center py-8 text-muted-foreground"
                    >
                      No subscription plans found
                    </TableCell>
                  </TableRow>
                ) : (
                  data.content.map((plan, index) => (
                    <TableRow key={plan.id} className="text-sm">
                      {/* Index */}
                      <TableCell className="font-medium truncate">
                        {indexDisplay(data.pageNo, data.pageSize, index)}
                      </TableCell>

                      {/* Plan Name */}
                      <TableCell className="text-xs font-medium">
                        {plan.name}
                      </TableCell>

                      {/* Price */}
                      <TableCell className="text-xs">
                        {plan.isFree
                          ? "Free"
                          : plan.pricingDisplay || `$${plan.price}`}
                      </TableCell>

                      {/* Duration */}
                      <TableCell className="text-xs">
                        {plan.durationDays} days
                      </TableCell>

                      {/* Status */}
                      <TableCell className="text-xs capitalize">
                        {plan.status}
                      </TableCell>

                      {/* Subscriptions Count */}
                      <TableCell className="text-xs">
                        {plan.activeSubscriptionsCount}
                      </TableCell>

                      {/* Visibility */}
                      <TableCell className="text-xs">
                        {plan.isPublic
                          ? "Public"
                          : plan.isPrivate
                          ? "Private"
                          : "-"}
                      </TableCell>

                      {/* Created At */}
                      <TableCell className="text-xs text-muted-foreground">
                        {DateTimeFormat(plan.createdAt)}
                      </TableCell>

                      {/* Actions */}
                      <TableCell className="text-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(plan)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleView(plan)}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDelete(plan)}
                        >
                          <Trash className="w-3 h-3" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>

            <ModalBusiness
              isOpen={isModalOpen}
              onClose={() => {
                setInitializeSubscriptionPlan(null);
                setIsModalOpen(false);
              }}
              isSubmitting={isSubmitting}
              onSave={handleSubmit}
              Data={initializeSubscriptionPlan}
              mode={mode}
            />

            <BusinessDetailSheet
              isOpen={isBusinessDetailOpen}
              onClose={() => handleCloseViewBusinessDetail()}
              business={selectedSubscriptionPlan}
            />

            <DeleteConfirmationDialog
              isOpen={isDeleteDialogOpen}
              onClose={() => {
                setIsDeleteDialogOpen(false);
                setSelectedSubscriptionPlan(null);
              }}
              onDelete={handleDeleteSubscriptionPlan}
              title="Delete Admin"
              description={`Are you sure you want to delete the admin`}
              itemName={selectedSubscriptionPlan?.name || "---"}
              isSubmitting={isSubmitting}
            />

            <ConfirmDialog
              open={isToggleStatusDialogOpen}
              onOpenChange={() => {
                setIsToggleStatusDialogOpen(false);
                setSelectedBusinessToggle(null);
              }}
              title="Change user status"
              description={`Are you sure you want to ${
                selectedBusinessToggle?.status === BusinessStatus.ACTIVE
                  ? "disable"
                  : "enable"
              } this user: ${selectedBusinessToggle?.email}?`}
              confirmButton={{
                text: `${
                  selectedBusinessToggle?.status === "ACTIVE"
                    ? "Disable"
                    : "Enable"
                }`,
                onClick: () => handleStatusToggle(sel),
                variant: "primary",
              }}
              size="md"
            />

            <PaginationPage
              currentPage={currentPage}
              totalPages={data?.totalPages ?? 10}
              onPageChange={handlePageChange}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
