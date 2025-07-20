import { useCallback, useEffect, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";

interface UsePaginationOptions {
  baseRoute: string;
  defaultPageSize?: number;
  totalPages?: number; // Add totalPages to options
  onPageChange?: (page: number) => void;
}

interface UsePaginationReturn {
  currentPage: number;
  updateUrlWithPage: (newPage: number, replace?: boolean) => void;
  handlePageChange: (newPage: number) => void; // Remove totalPages parameter
  getDisplayIndex: (index: number, pageSize?: number) => number;
}

export function usePagination({
  baseRoute,
  defaultPageSize = 10,
  totalPages, // Remove default value to handle it properly
  onPageChange,
}: UsePaginationOptions): UsePaginationReturn {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Get current page from URL
  const currentPage = useMemo(() => {
    const pageParam = searchParams.get("pageNo");
    const parsed = pageParam ? parseInt(pageParam, 10) : 1;
    return isNaN(parsed) || parsed < 1 ? 1 : parsed;
  }, [searchParams]);

  // Centralized URL update function
  const updateUrlWithPage = useCallback(
    (newPage: number, replace: boolean = false) => {
      const params = new URLSearchParams(searchParams);

      // Always show pageNo in URL (including page 1)
      params.set("pageNo", newPage.toString());

      const queryString = params.toString();
      const url = `${baseRoute}?${queryString}`;

      if (replace) {
        router.replace(url);
      } else {
        router.push(url);
      }
    },
    [searchParams, router, baseRoute]
  );

  // Initialize URL with pageNo=1 if no page parameter exists
  useEffect(() => {
    const pageParam = searchParams.get("pageNo");
    if (!pageParam) {
      updateUrlWithPage(1, true);
    }
  }, [searchParams, updateUrlWithPage]);

  // Page change handler with validation - now only takes newPage
  const handlePageChange = useCallback(
    (newPage: number) => {
      // If totalPages is not available yet, don't validate bounds
      if (totalPages) {
        // Validate page bounds
        if (newPage < 1 || newPage > totalPages) {
          return;
        }
      } else {
        // Basic validation when totalPages is not available
        if (newPage < 1) {
          return;
        }
      }

      // Don't update if we're already on the target page
      if (newPage === currentPage) {
        return;
      }

      updateUrlWithPage(newPage);

      // Call optional callback
      if (onPageChange) {
        onPageChange(newPage);
      }
    },
    [currentPage, updateUrlWithPage, onPageChange, totalPages]
  );

  // Calculate display index for table rows
  const getDisplayIndex = useCallback(
    (index: number, pageSize: number = defaultPageSize) => {
      return (currentPage - 1) * pageSize + index + 1;
    },
    [currentPage, defaultPageSize]
  );

  return {
    currentPage,
    updateUrlWithPage,
    handlePageChange,
    getDisplayIndex,
  };
}
