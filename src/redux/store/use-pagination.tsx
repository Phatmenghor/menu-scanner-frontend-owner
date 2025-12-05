import { useCallback, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";

interface UsePaginationOptions {
  baseRoute: string;
  defaultPageSize?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
}

interface UsePaginationReturn {
  currentPage: number;
  updateUrlWithPage: (newPage: number, replace?: boolean) => void;
  handlePageChange: (newPage: number) => void;
  getDisplayIndex: (index: number, pageSize?: number) => number;
}

export function usePagination({
  baseRoute,
  defaultPageSize = 10,
  totalPages,
  onPageChange,
}: UsePaginationOptions): UsePaginationReturn {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Get current page from URL - defaults to 1 if not present
  const currentPage = useMemo(() => {
    const pageParam = searchParams.get("pageNo");
    const parsed = pageParam ? parseInt(pageParam, 10) : 1;
    return isNaN(parsed) || parsed < 1 ? 1 : parsed;
  }, [searchParams]);

  // Centralized URL update function
  const updateUrlWithPage = useCallback(
    (newPage: number, replace: boolean = false) => {
      const params = new URLSearchParams(searchParams);
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

  // Page change handler with validation
  const handlePageChange = useCallback(
    (newPage: number) => {
      // Validate page bounds if totalPages is available
      if (totalPages && (newPage < 1 || newPage > totalPages)) {
        return;
      }

      // Basic validation when totalPages is not available
      if (newPage < 1) {
        return;
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
