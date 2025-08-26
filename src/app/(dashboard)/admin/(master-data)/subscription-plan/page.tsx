"use client";

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
  BUSINESS_STATUS_OPTIONS,
  BusinessStatus,
  ModalMode,
  SUBSCRIPTION_PLAN_OPTIONS,
  subscriptionOptions,
  SubscriptionPlanStatus,
} from "@/constants/AppResource/status/status";
import { indexDisplay } from "@/utils/common/common";
import { DateTimeFormat } from "@/utils/date/date-time-format";
import { useDebounce } from "@/utils/debounce/debounce";
import {
  ExcelColumn,
  ExcelExporter,
  ExcelSheet,
} from "@/utils/export-file/excel";
import {
  Edit,
  Eye,
  Plus,
  RotateCw,
  Search,
  Trash,
  UserPlus,
} from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { usePagination } from "@/hooks/use-pagination";
import { ROUTES } from "@/constants/AppRoutes/routes";
import PaginationPage from "@/components/shared/common/app-pagination";
import { DeleteConfirmationDialog } from "@/components/shared/dialog/dialog-delete";
import { AppToast } from "@/components/shared/toast/app-toast";
import { Switch } from "@/components/ui/switch";
import { CardHeaderSection } from "@/components/layout/main/card-header-section";
import {
  AllSubscriptionPlan,
  SubscriptionPlanModel,
} from "@/models/dashboard/master-data/subscription-plan/subscription-plan-response";
import { SubscriptionPlanFormData } from "@/models/dashboard/master-data/subscription-plan/subscription-plan.schema";
import {
  createSubscriptionService,
  deletedSubscriptionPlanService,
  getAllSubscriptionPlanService,
  updateSubscriptionPlanService,
} from "@/services/dashboard/master-data/subscrion-plan/subscription-plan.service";
import { SubscriptionPlanFilters } from "@/components/dashboard/master-data/subscription-plan/subscription-plan-filter";
import ModalSubscriptionPlan from "@/components/shared/modal/subscription-plan-modal";
import { SubscriptionPlanDetailSheet } from "@/components/dashboard/master-data/subscription-plan/subscription-plan-detail-sheet";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { SubscriptionPlanTableHeaders } from "@/constants/AppResource/table/master-data/subscription-plan";
import { CustomSelect } from "@/components/shared/common/custom-select";

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
  const [isSubPlanDetailOpen, setIsSubPlanDetailOpen] = useState(false);
  const [mode, setMode] = useState<ModalMode>(ModalMode.CREATE_MODE);
  const [statusFilter, setStatusFilter] = useState<
    SubscriptionPlanStatus | undefined
  >(undefined);
  const [hasSubscription, setHasSubscription] = useState<boolean | undefined>(
    undefined
  );
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  //filter state
  const [minPrice, setMinPrice] = useState<number | undefined>(undefined);
  const [maxPrice, setMaxPrice] = useState<number | undefined>(undefined);
  const [minDuration, setMinDuration] = useState<number | undefined>(undefined);
  const [maxDuration, setMaxDuration] = useState<number | undefined>(undefined);
  const [publicOnly, setPublicOnly] = useState(false);
  const [freeOnly, setFreeOnly] = useState(false);

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
      const response = await getAllSubscriptionPlanService({
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

  async function handleSubmit(formData: SubscriptionPlanFormData) {
    console.log("Submitting form:", formData, "mode:", mode);

    setIsSubmitting(true);
    try {
      const isCreate = mode === ModalMode.CREATE_MODE;

      if (
        !formData.name ||
        formData.durationDays === undefined ||
        formData.price === undefined ||
        !formData.description ||
        !formData.status
      ) {
        throw new Error(
          "All fields are required to create a subscription plan"
        );
      }

      const payload = {
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
    if (!selectedSubscriptionPlan || !selectedSubscriptionPlan?.id) return;

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

  // Handle status filter change - directly updates the filter value
  const handleStatusChange = (status: SubscriptionPlanStatus) => {
    setStatusFilter(status);
  };

  const handleView = (subPlan: SubscriptionPlanModel | null) => {
    setSelectedSubscriptionPlan(subPlan);
    setIsSubPlanDetailOpen(true);
  };

  const handleCloseViewSubPlanDetail = () => {
    setSelectedSubscriptionPlan(null);
    setIsSubPlanDetailOpen(false);
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
            { label: "Subscription Plans", href: "" },
          ]}
          title="Subscription Plans"
          searchValue={searchQuery}
          searchPlaceholder="Search..."
          disableReset={!statusFilter && !hasSubscription}
          handleResetFilters={handleResetFilters}
          onSearchChange={handleSearchChange}
          children={
            <div className="flex flex-wrap items-center justify-start gap-4 w-full">
              <div className="flex items-center gap-3">
                <CustomSelect
                  options={SUBSCRIPTION_PLAN_OPTIONS}
                  value={statusFilter}
                  placeholder="Select Status"
                  onValueChange={(value) =>
                    setStatusFilter(value as SubscriptionPlanStatus)
                  }
                />
                <CustomSelect
                  options={subscriptionOptions}
                  value={
                    hasSubscription === undefined
                      ? "All"
                      : hasSubscription
                      ? "true"
                      : "false"
                  }
                  placeholder="All"
                  onValueChange={(value) => {
                    if (value === "true") setHasSubscription(true);
                    else if (value === "false") setHasSubscription(false);
                    else setHasSubscription(undefined);
                  }}
                />
              </div>
            </div>
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
                  {SubscriptionPlanTableHeaders.map((header, index) => (
                    <TableHead
                      key={index}
                      className="text-xs font-semibold text-muted-foreground"
                    >
                      <span>{header.label}</span>
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
                      <TableCell className=" font-medium">
                        {plan.name}
                      </TableCell>

                      {/* Price */}
                      <TableCell>
                        {plan.isFree
                          ? "Free"
                          : plan.pricingDisplay || `$${plan.price}`}
                      </TableCell>

                      {/* Duration */}
                      <TableCell>{plan.durationDays} days</TableCell>

                      {/* Status */}
                      <TableCell className="capitalize">
                        {plan.status}
                      </TableCell>

                      {/* Subscriptions Count */}
                      <TableCell className="">
                        {plan.activeSubscriptionsCount}
                      </TableCell>

                      {/* Visibility */}
                      <TableCell className="">
                        {plan.isPublic
                          ? "Public"
                          : plan.isPrivate
                          ? "Private"
                          : "-"}
                      </TableCell>

                      {/* Created At */}
                      <TableCell className="text-muted-foreground">
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

            <ModalSubscriptionPlan
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

            <SubscriptionPlanDetailSheet
              isOpen={isSubPlanDetailOpen}
              onClose={handleCloseViewSubPlanDetail}
              subPlan={selectedSubscriptionPlan}
            />

            <DeleteConfirmationDialog
              isOpen={isDeleteDialogOpen}
              onClose={() => {
                setIsDeleteDialogOpen(false);
                setSelectedSubscriptionPlan(null);
              }}
              onDelete={handleDeleteSubscriptionPlan}
              title="Delete Subscription Plan"
              description={`Are you sure you want to delete the subscription plan`}
              itemName={selectedSubscriptionPlan?.name || "---"}
              isSubmitting={isSubmitting}
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
