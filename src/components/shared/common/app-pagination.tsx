"use client";

import { useCallback } from "react";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface CustomPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

export default function PaginationPage({
  currentPage,
  totalPages,
  onPageChange,
  className = "",
}: CustomPaginationProps) {
  // Handle previous page
  const handlePreviousPage = useCallback(() => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  }, [currentPage, onPageChange]);

  // Handle next page
  const handleNextPage = useCallback(() => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  }, [currentPage, totalPages, onPageChange]);

  // Generate page numbers with ellipsis logic
  const getPaginationItems = useCallback((): (number | "ellipsis")[] => {
    const items: (number | "ellipsis")[] = [];

    if (totalPages <= 7) {
      // Show all pages if 7 or fewer
      for (let i = 1; i <= totalPages; i++) {
        items.push(i);
      }
    } else {
      // Always show first page
      items.push(1);

      // Determine the range around current page
      let start = Math.max(2, currentPage - 1);
      let end = Math.min(totalPages - 1, currentPage + 1);

      // Adjust range if current page is near the beginning
      if (currentPage <= 3) {
        start = 2;
        end = 4;
      }

      // Adjust range if current page is near the end
      if (currentPage >= totalPages - 2) {
        start = totalPages - 3;
        end = totalPages - 1;
      }

      // Add ellipsis after first page if needed
      if (start > 2) {
        items.push("ellipsis");
      }

      // Add middle pages
      for (let i = start; i <= end; i++) {
        items.push(i);
      }

      // Add ellipsis before last page if needed
      if (end < totalPages - 1) {
        items.push("ellipsis");
      }

      // Always show last page
      items.push(totalPages);
    }

    return items;
  }, [currentPage, totalPages]);

  // Don't render if there's only one page or no pages
  if (totalPages <= 1) {
    return null;
  }

  return (
    <div className={`p-4 ${className}`}>
      {/* Desktop Pagination */}
      <div className="hidden md:block">
        <div className="flex justify-center items-center gap-2">
          <button
            onClick={handlePreviousPage}
            disabled={currentPage === 1}
            className={`flex items-center gap-1 px-3 py-2 rounded-lg border text-sm font-medium transition-colors ${
              currentPage === 1
                ? "opacity-50 cursor-not-allowed text-gray-400 border-gray-200"
                : "text-gray-700 border-gray-300 hover:bg-gray-50 cursor-pointer"
            }`}
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Previous
          </button>

          {getPaginationItems().map((item, index) => {
            if (item === "ellipsis") {
              return (
                <span key={`ellipsis-${index}`} className="px-2 text-gray-400">
                  ...
                </span>
              );
            }

            return (
              <button
                key={item}
                onClick={() => onPageChange(item)}
                className={`w-10 h-10 rounded-lg text-sm font-medium transition-colors ${
                  currentPage === item
                    ? "bg-black text-white"
                    : "text-gray-700 border border-gray-300 hover:bg-gray-50"
                }`}
              >
                {item}
              </button>
            );
          })}

          <button
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
            className={`flex items-center gap-1 px-3 py-2 rounded-lg border text-sm font-medium transition-colors ${
              currentPage === totalPages
                ? "opacity-50 cursor-not-allowed text-gray-400 border-gray-200"
                : "text-gray-700 border-gray-300 hover:bg-gray-50 cursor-pointer"
            }`}
          >
            Next
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Pagination - Matches the design in your image */}
      <div className="flex justify-center items-center gap-2 md:hidden">
        <button
          onClick={handlePreviousPage}
          disabled={currentPage === 1}
          className={`flex items-center gap-1 px-3 py-2 rounded-lg border text-sm font-medium transition-colors ${
            currentPage === 1
              ? "opacity-50 cursor-not-allowed text-gray-400 border-gray-200"
              : "text-gray-700 border-gray-300 hover:bg-gray-50"
          }`}
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Previous
        </button>

        {/* Show limited page numbers on mobile */}
        {(() => {
          const mobilePagesToShow = [];

          if (totalPages <= 4) {
            // Show all pages if 4 or fewer
            for (let i = 1; i <= totalPages; i++) {
              mobilePagesToShow.push(i);
            }
          } else {
            // Show current page and adjacent pages
            const start = Math.max(1, currentPage - 1);
            const end = Math.min(totalPages, currentPage + 1);

            for (let i = start; i <= end; i++) {
              mobilePagesToShow.push(i);
            }
          }

          return mobilePagesToShow.map((pageNumber) => (
            <button
              key={pageNumber}
              onClick={() => onPageChange(pageNumber)}
              className={`w-10 h-10 rounded-lg text-sm font-medium transition-colors ${
                currentPage === pageNumber
                  ? "bg-black text-white"
                  : "text-gray-700 border border-gray-300 hover:bg-gray-50"
              }`}
            >
              {pageNumber}
            </button>
          ));
        })()}

        <button
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
          className={`flex items-center gap-1 px-3 py-2 rounded-lg border text-sm font-medium transition-colors ${
            currentPage === totalPages
              ? "opacity-50 cursor-not-allowed text-gray-400 border-gray-200"
              : "text-gray-700 border-gray-300 hover:bg-gray-50"
          }`}
        >
          Next
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}
