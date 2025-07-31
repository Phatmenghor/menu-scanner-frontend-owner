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
import { UserTableHeaders } from "@/constants/AppResource/table/user/plateform-user";
import { indexDisplay } from "@/utils/common/common";
import { DateTimeFormat } from "@/utils/date/date-time-format";
import { useDebounce } from "@/utils/debounce/debounce";
import {
  ExcelColumn,
  ExcelExporter,
  ExcelSheet,
} from "@/utils/export-file/excel";
import { Eye } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { usePagination } from "@/hooks/use-pagination";
import { ROUTES } from "@/constants/AppRoutes/routes";
import PaginationPage from "@/components/shared/common/app-pagination";
import { AllUserResponse } from "@/models/dashboard/user/plateform-user/user.response";
import { CardHeaderSection } from "@/components/layout/main/card-header-section";
import {
  AllSubdomainResponse,
  SubdomainModel,
} from "@/models/dashboard/sub-domain/sub-domain.response.model";
import { getAllSubdomainService } from "@/services/dashboard/sub-domain/sub-domain.service";
import { subdomainTableHeaders } from "@/constants/AppResource/table/user/sub-domain";

export default function SubdomainPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [subDomains, setSubDomains] = useState<AllSubdomainResponse | null>(
    null
  );
  const [selectedSubdomain, setSelectedSubdomain] =
    useState<SubdomainModel | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isExportingToExcel, setIsExportingToExcel] = useState(false);
  const [isSubdomainDetailOpen, setIsSubdomainDetailOpen] = useState(false);
  // Debounced search query - Optimized api performance when search
  const debouncedSearchQuery = useDebounce(searchQuery, 400);

  const searchParams = useSearchParams();

  const { currentPage, updateUrlWithPage, handlePageChange, getDisplayIndex } =
    usePagination({
      baseRoute: ROUTES.DASHBOARD.SUB_DOMAIN,
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

  const loadSubdomain = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await getAllSubdomainService({
        search: debouncedSearchQuery,
        pageNo: currentPage,
        pageSize: 10,
      });
      console.log("Fetched domains:", response);
      setSubDomains(response);
    } catch (error: any) {
      console.log("Failed to fetch domains: ", error);
    } finally {
      setIsLoading(false);
    }
  }, [debouncedSearchQuery, currentPage]);

  useEffect(() => {
    loadSubdomain();
  }, [loadSubdomain]);

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

  const handleCloseViewDomainDetail = () => {
    setSelectedSubdomain(null);
    setIsSubdomainDetailOpen(false);
  };

  const handleViewDomainDetail = (subDomain: SubdomainModel | null) => {
    setSelectedSubdomain(subDomain);
    setIsSubdomainDetailOpen(true);
  };

  const handleResetFilters = () => {
    setSearchQuery("");
    updateUrlWithPage(1, true);
    setSelectedSubdomain(null); // Reset users to trigger reload};
    loadSubdomain(); // Reload users with default filters
  };

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <div className="space-y-6">
        <CardHeaderSection
          breadcrumbs={[
            { label: "Dashboard", href: ROUTES.DASHBOARD.INDEX },
            { label: "Subdomain List", href: "" },
          ]}
          title="Subdomain"
          searchValue={searchQuery}
          searchPlaceholder="Search..."
          onSearchChange={handleSearchChange}
          handleResetFilters={handleResetFilters}
        />

        <div className="w-full">
          <Separator className="bg-gray-300" />
        </div>

        <div>
          <div className="rounded-md border overflow-x-auto whitespace-nowrap">
            <Table>
              <TableHeader>
                <TableRow>
                  {subdomainTableHeaders.map((header, index) => (
                    <TableHead
                      key={index}
                      className="font-semibold text-muted-foreground"
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
                {!subDomains || subDomains.content.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={UserTableHeaders.length}
                      className="text-center py-8 text-muted-foreground"
                    >
                      No users found
                    </TableCell>
                  </TableRow>
                ) : (
                  subDomains.content.map((d, index) => {
                    return (
                      <TableRow key={d.id} className="text-sm">
                        {/* Index */}
                        <TableCell className="font-medium truncate">
                          {getDisplayIndex(index, subDomains.pageSize)}
                        </TableCell>

                        <TableCell className="text-muted-foreground">
                          {d?.subdomain || "---"}
                        </TableCell>

                        {/* business name */}
                        <TableCell className="text-muted-foreground">
                          {d?.businessName || "---"}
                        </TableCell>

                        <TableCell className="text-muted-foreground">
                          {d?.status || "---"}
                        </TableCell>

                        <TableCell className="text-muted-foreground">
                          {d?.lastAccessed || "---"}
                        </TableCell>

                        <TableCell className="text-muted-foreground">
                          {d?.accessCount || "---"}
                        </TableCell>

                        <TableCell className="text-muted-foreground">
                          {d?.currentSubscriptionPlan || "---"}
                        </TableCell>

                        <TableCell className="text-muted-foreground">
                          {d?.subscriptionDaysRemaining || "---"}
                        </TableCell>

                        <TableCell>
                          {d?.isAccessible === true ? (
                            <span className="px-2 py-1 rounded-full text-green-700 bg-green-100 text-xs font-medium">
                              Accessible
                            </span>
                          ) : d?.isAccessible === false ? (
                            <span className="px-2 py-1 rounded-full text-red-700 bg-red-100 text-xs font-medium">
                              Restricted
                            </span>
                          ) : (
                            <span className="text-muted-foreground text-xs">
                              ---
                            </span>
                          )}
                        </TableCell>

                        <TableCell>
                          {d?.hasActiveSubscription === true ? (
                            <span className="px-2 py-1 rounded-full text-green-700 bg-green-100 text-xs font-medium">
                              Subscribed
                            </span>
                          ) : d?.hasActiveSubscription === false ? (
                            <span className="px-2 py-1 rounded-full text-red-700 bg-red-100 text-xs font-medium">
                              Not Subscribed
                            </span>
                          ) : (
                            <span className="text-muted-foreground text-xs">
                              ---
                            </span>
                          )}
                        </TableCell>

                        {/* Created At */}
                        <TableCell className="text-sm text-muted-foreground">
                          {DateTimeFormat(d?.createdAt)}
                        </TableCell>

                        {/* Actions */}
                        <TableCell className="text-center space-x-2">
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleViewDomainDetail(d)}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>

            {/* <UserDetailSheet
              onClose={handleCloseViewUserDetail}
              open={isUserDetailOpen}
              user={selectedUser}
            /> */}

            <PaginationPage
              currentPage={currentPage}
              totalPages={subDomains?.totalPages ?? 10}
              onPageChange={handlePageChange}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
