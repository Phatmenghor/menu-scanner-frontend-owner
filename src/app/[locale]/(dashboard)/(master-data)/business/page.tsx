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

export default function BusinessPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [data, setData] = useState<AllBusinessResponse | null>(null);
  const [initializeBusiness, setInitializeBusiness] =
    useState<BusinessFormData | null>(null);
  const [selectedBusiness, setSelectedBusiness] =
    useState<BusinessModel | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isBusinessDetailOpen, setIsBusinessDetailOpen] = useState(false);
  const [mode, setMode] = useState<ModalMode>(ModalMode.CREATE_MODE);
  const [isExportingToExcel, setIsExportingToExcel] = useState(false);
  const [statusFilter, setStatusFilter] = useState<BusinessStatus | undefined>(
    undefined
  );
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
      baseRoute: ROUTES.DASHBOARD.BUSINESS,
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

  const loadBusiness = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await getAllBusinessService({
        status: statusFilter,
        hasActiveSubscription: hasSubscription,
        search: debouncedSearchQuery,
        pageNo: currentPage,
        pageSize: 10,
      });
      console.log("Fetched businesses:", response);
      setData(response);
    } catch (error: any) {
      console.log("Failed to fetch businesses: ", error);
    } finally {
      setIsLoading(false);
    }
  }, [debouncedSearchQuery, statusFilter, hasSubscription, currentPage]);

  useEffect(() => {
    loadBusiness();
  }, [loadBusiness]);

  // Simplified search change handler - just updates the state, debouncing handles the rest
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleExportToPdf = async (data: AllBusinessResponse | null) => {
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

  async function handleSubmit(formData: BusinessFormData) {
    console.log("Submitting form:", formData, "mode:", mode);

    setIsSubmitting(true);
    try {
      const isCreate = mode === ModalMode.CREATE_MODE;

      const payload = {
        email: formData.email!,
        name: formData.name!,
        status: formData.status,
        address: formData.address,
        description: formData.description,
        phone: formData.phone,
      };

      if (isCreate) {
        const response = await createBusinessService(payload);
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
            message: `Business ${
              response.username || formData.email
            } added successfully`,
            duration: 4000,
            position: "top-right",
          });

          setIsModalOpen(false);
        }
      } else {
        // Update mode
        if (!formData?.id) {
          throw new Error("Business ID is required for update");
        }

        const response = await updateBusinessService(formData?.id, payload);
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
            message: `Business ${
              response.username || response.email
            } updated successfully`,
            duration: 4000,
            position: "top-right",
          });

          setIsModalOpen(false);
        }
      }
    } catch (error: any) {
      console.error("Error submitting business form:", error);
      toast.error(error.message || "An unexpected error occurred");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleDeleteBusiness() {
    if (!selectedBusiness || !selectedBusiness.id) return;

    setIsSubmitting(true);
    try {
      const response = await deletedBusinessService(selectedBusiness.id);

      if (response) {
        AppToast({
          type: "success",
          message: `Business ${
            selectedBusiness.name ?? ""
          } deleted successfully`,
          duration: 4000,
          position: "top-right",
        });
        // After deletion, check if we need to go back a page
        if (data && data.content.length === 1 && currentPage > 1) {
          updateUrlWithPage(currentPage - 1);
        } else {
          await loadBusiness();
        }
      } else {
        AppToast({
          type: "error",
          message: `Failed to delete business`,
          duration: 4000,
          position: "top-right",
        });
      }
    } catch (error) {
      console.error("Error deleting business:", error);
      toast.error("An error occurred while deleting the business");
    } finally {
      setIsSubmitting(false);
      setIsDeleteDialogOpen(false);
    }
  }

  const handleEditBusiness = (user: BusinessFormData) => {
    setInitializeBusiness(user);
    setMode(ModalMode.UPDATE_MODE);
    setIsModalOpen(!isModalOpen);
  };

  // Status toggle handler
  const handleStatusToggle = async (formData: BusinessModel | null) => {
    if (!formData?.id) return;

    setIsSubmitting(true);
    try {
      const newStatus =
        formData?.status === Status.ACTIVE ? Status.INACTIVE : Status.ACTIVE;

      const response = await updateBusinessService(formData?.id, {
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
          message: `Business status updated successfully`,
          duration: 4000,
          position: "top-right",
        });
        setSelectedBusinessToggle(null);
        setIsToggleStatusDialogOpen(false);
      } else {
        AppToast({
          type: "error",
          message: `Failed to update business status`,
          duration: 4000,
          position: "top-right",
        });
        loadBusiness(); // reload in case of failure
      }
    } catch (error: any) {
      toast.error(
        error?.message || "An error occurred while updating business status"
      );
      loadBusiness(); // reload in case of failure
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleStatus = (business: BusinessModel) => {
    setSelectedBusinessToggle(business);
    setIsToggleStatusDialogOpen(true);
  };

  // Handle status filter change - directly updates the filter value
  const handleStatusChange = (status: BusinessStatus) => {
    setStatusFilter(status);
  };

  const handleViewBusinessDetail = (business: BusinessModel | null) => {
    setSelectedBusiness(business);
    setIsBusinessDetailOpen(true);
  };

  const handleCloseViewBusinessDetail = () => {
    setSelectedBusiness(null);
    setIsBusinessDetailOpen(false);
  };

  const handleDelete = (user: BusinessModel) => {
    setSelectedBusiness(user);
    setIsDeleteDialogOpen(true);
  };

  const handleResetFilters = () => {
    setStatusFilter(undefined);
    setHasSubscription(undefined);
    setSearchQuery("");
    updateUrlWithPage(1, true);
    setData(null); // Reset users to trigger reload};
    loadBusiness(); // Reload users with default filters
  };

  const handleCreateBusiness = () => {
    setIsModalOpen(!isModalOpen);
    setMode(ModalMode.CREATE_MODE);
  };

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <div className="space-y-6">
        <CardHeaderSection
          breadcrumbs={[
            { label: "Dashboard", href: ROUTES.DASHBOARD.INDEX },
            { label: "Business List", href: "" },
          ]}
          title="Business"
          searchValue={searchQuery}
          searchPlaceholder="Search..."
          buttonIcon={<Plus className="w-3 h-3" />}
          buttonText="Add new"
          disableReset={!statusFilter}
          handleResetFilters={handleResetFilters}
          onSearchChange={handleSearchChange}
          openModal={handleCreateBusiness}
          children={
            <div className="flex flex-wrap items-center justify-start gap-4 w-full">
              {/* <div className="relative w-full md:w-[350px]">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              aria-label="search-business"
              autoComplete="search-business"
              type="search"
              placeholder={t("search")}
              value={searchQuery}
              onChange={handleSearchChange}
              className="pl-8 w-full min-w-[200px] text-xs md:min-w-[300px] h-9"
              disabled={isSubmitting}
            />
          </div> */}

              <div className="flex items-center gap-3">
                <Select value={statusFilter} onValueChange={handleStatusChange}>
                  <SelectTrigger className="min-w-[150px] h-9 text-sm">
                    <SelectValue placeholder="Select Status" />
                  </SelectTrigger>
                  <SelectContent>
                    {BUSINESS_STATUS_OPTIONS.map((option) => (
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
                <div className="flex flex-col space-y-1">
                  <Select
                    value={
                      hasSubscription === true
                        ? "true"
                        : hasSubscription === false
                        ? "false"
                        : "all"
                    }
                    onValueChange={(value) => {
                      if (value === "true") {
                        setHasSubscription(true);
                      } else if (value === "false") {
                        setHasSubscription(false);
                      } else {
                        setHasSubscription(undefined); // 'all' selected
                      }
                    }}
                  >
                    <SelectTrigger
                      className="min-w-[150px] h-9 text-sm text-black"
                      id="subscription-filter"
                    >
                      <SelectValue placeholder="All" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All</SelectItem>
                      <SelectItem value="true">Subscribed</SelectItem>
                      <SelectItem value="false">Not Subscribed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button
                  onClick={() => handleExportToPdf(data)}
                  variant="outline"
                  className="gap-2 text-sm sm:text-base text-black lg:text-sm px-3 sm:px-4 lg:px-6 py-2 lg:py-3"
                >
                  <img
                    src={AppIcons.Excel}
                    alt="excel Icon"
                    className="lg:h-5 lg:w-5 text-muted-foreground flex-shrink-0"
                  />
                  <span>Excel</span>
                  <Download className="w-4 h-4 lg:w-5 lg:h-5 flex-shrink-0" />
                </Button>
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
                  {BusinessTableHeaders.map((header, index) => (
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
                {!data || data.content.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={BusinessTableHeaders.length}
                      className="text-center py-8 text-muted-foreground"
                    >
                      No businesses found
                    </TableCell>
                  </TableRow>
                ) : (
                  data.content.map((business, index) => {
                    const logoUrl =
                      business?.logoUrl && process.env.NEXT_PUBLIC_API_BASE_URL
                        ? `${process.env.NEXT_PUBLIC_API_BASE_URL}${business.logoUrl}`
                        : undefined;

                    return (
                      <TableRow key={business.id} className="text-sm">
                        {/* Index */}
                        <TableCell className="font-medium truncate">
                          {indexDisplay(data.pageNo, data.pageSize, index)}
                        </TableCell>

                        {/* Business Info with Logo */}
                        <TableCell>
                          <div>
                            <Avatar className="h-10 w-10 border-2 border-background dark:border-card shadow-sm group-hover:border-primary/30 transition-all">
                              <AvatarImage
                                src={business.logoUrl ? logoUrl : ""}
                                alt={`${business.name} logo`}
                              />
                              <AvatarFallback className="bg-primary/10 dark:bg-primary/20 text-primary font-semibold">
                                {business?.name?.charAt(0).toUpperCase() || "B"}
                              </AvatarFallback>
                            </Avatar>
                          </div>
                        </TableCell>

                        {/* Business Type & Cuisine */}
                        <TableCell className="text-xs">
                          <div className="flex flex-col">
                            <span className="font-medium">
                              {business?.name}
                            </span>
                          </div>
                        </TableCell>

                        {/* Business Type & Cuisine */}
                        <TableCell className="text-xs">
                          <div className="flex flex-col">
                            <span className="font-medium">
                              {business?.businessType}
                            </span>
                            {business?.cuisineType && (
                              <span className="text-muted-foreground">
                                {business?.cuisineType}
                              </span>
                            )}
                          </div>
                        </TableCell>

                        {/* Contact Info */}
                        <TableCell className="text-xs">
                          <div className="flex flex-col gap-1">
                            <span className="font-medium">
                              {business?.email}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="text-xs">
                          <div className="flex flex-col gap-1">
                            <span className="text-muted-foreground">
                              {business?.phone}
                            </span>
                          </div>
                        </TableCell>

                        {/* Subscription Info */}
                        <TableCell className="text-xs">
                          <div className="flex flex-col gap-1">
                            <span className="font-medium">
                              {business?.currentSubscriptionPlan || "No Plan"}
                            </span>
                            {business?.daysRemaining && (
                              <span
                                className={`text-xs ${
                                  business?.isExpiringSoon
                                    ? "text-yellow-600"
                                    : "text-muted-foreground"
                                }`}
                              >
                                {business.daysRemaining} days left
                              </span>
                            )}
                          </div>
                        </TableCell>

                        {/* Status Switch */}
                        <TableCell>
                          <div className="flex flex-col justify-center">
                            <BusinessStatusBadge
                              status={business?.status}
                              isSubscriptionActive={
                                business?.isSubscriptionActive
                              }
                              isExpiringSoon={business?.isExpiringSoon}
                            />
                          </div>
                        </TableCell>

                        {/* Created At */}
                        <TableCell className="text-sm text-muted-foreground">
                          {DateTimeFormat(business?.createdAt)}
                        </TableCell>

                        {/* Actions */}
                        <TableCell className="text-center space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditBusiness(business)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleViewBusinessDetail(business)}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDelete(business)}
                          >
                            <Trash className="w-3 h-3" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>

            <ModalBusiness
              isOpen={isModalOpen}
              onClose={() => {
                setInitializeBusiness(null);
                setIsModalOpen(false);
              }}
              isSubmitting={isSubmitting}
              onSave={handleSubmit}
              Data={initializeBusiness}
              mode={mode}
            />

            <ResetPasswordModal
              isOpen={isResetPasswordDialogOpen}
              userName={selectedBusiness?.name || selectedBusiness?.email}
              onClose={() => {
                setIsResetPasswordDialogOpen(false);
                setSelectedBusiness(null);
              }}
              userId={selectedBusiness?.id}
            />

            <BusinessDetailSheet
              isOpen={isBusinessDetailOpen}
              onClose={() => handleCloseViewBusinessDetail()}
              business={selectedBusiness}
            />

            <DeleteConfirmationDialog
              isOpen={isDeleteDialogOpen}
              onClose={() => {
                setIsDeleteDialogOpen(false);
                setSelectedBusiness(null);
              }}
              onDelete={handleDeleteBusiness}
              title="Delete Admin"
              description={`Are you sure you want to delete the admin`}
              itemName={selectedBusiness?.name || selectedBusiness?.email}
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
                onClick: () => handleStatusToggle(selectedBusinessToggle),
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
