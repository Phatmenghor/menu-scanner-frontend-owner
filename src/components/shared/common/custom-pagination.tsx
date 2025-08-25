import { useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface CustomPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
  size?: "sm" | "md" | "lg";
}

export const CustomPagination: React.FC<CustomPaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  className = "",
  size = "md",
}) => {
  const sizeClasses = {
    sm: {
      button: "h-8 px-3 text-xs",
      icon: "h-3 w-3",
      pageButton: "h-8 w-8 text-xs",
    },
    md: {
      button: "h-9 px-4 text-sm",
      icon: "h-4 w-4",
      pageButton: "h-9 w-9 text-sm",
    },
    lg: {
      button: "h-10 px-5 text-base",
      icon: "h-5 w-5",
      pageButton: "h-10 w-10 text-base",
    },
  };

  const classes = sizeClasses[size];

  const handlePreviousPage = useCallback(() => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  }, [currentPage, onPageChange]);

  const handleNextPage = useCallback(() => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  }, [currentPage, totalPages, onPageChange]);

  const getPaginationItems = useCallback((): (number | "ellipsis")[] => {
    const items: (number | "ellipsis")[] = [];

    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) {
        items.push(i);
      }
    } else {
      items.push(1);

      let start = Math.max(2, currentPage - 1);
      let end = Math.min(totalPages - 1, currentPage + 1);

      if (currentPage <= 3) {
        start = 2;
        end = 4;
      }

      if (currentPage >= totalPages - 2) {
        start = totalPages - 3;
        end = totalPages - 1;
      }

      if (start > 2) {
        items.push("ellipsis");
      }

      for (let i = start; i <= end; i++) {
        items.push(i);
      }

      if (end < totalPages - 1) {
        items.push("ellipsis");
      }

      items.push(totalPages);
    }

    return items;
  }, [currentPage, totalPages]);

  if (totalPages <= 1) {
    return null;
  }

  return (
    <div className={`flex items-center justify-center gap-2 p-4 ${className}`}>
      {/* Previous Button */}
      <button
        onClick={handlePreviousPage}
        disabled={currentPage === 1}
        className={`
          ${classes.button}
          flex items-center gap-2 rounded-lg border font-medium transition-all duration-200
          ${
            currentPage === 1
              ? "opacity-50 cursor-not-allowed text-muted-foreground border-border"
              : "text-foreground border-border hover:bg-muted hover:border-border-strong"
          }
        `}
      >
        <ChevronLeft className={classes.icon} />
        <span className="hidden sm:inline">Previous</span>
      </button>

      {/* Page Numbers */}
      <div className="flex items-center gap-1">
        {getPaginationItems().map((item, index) => {
          if (item === "ellipsis") {
            return (
              <span
                key={`ellipsis-${index}`}
                className="px-2 text-muted-foreground"
              >
                ...
              </span>
            );
          }

          return (
            <button
              key={item}
              onClick={() => onPageChange(item)}
              className={`
                ${classes.pageButton}
                rounded-lg font-medium transition-all duration-200
                ${
                  currentPage === item
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-foreground border border-border hover:bg-muted hover:border-border-strong"
                }
              `}
            >
              {item}
            </button>
          );
        })}
      </div>

      {/* Next Button */}
      <button
        onClick={handleNextPage}
        disabled={currentPage === totalPages}
        className={`
          ${classes.button}
          flex items-center gap-2 rounded-lg border font-medium transition-all duration-200
          ${
            currentPage === totalPages
              ? "opacity-50 cursor-not-allowed text-muted-foreground border-border"
              : "text-foreground border-border hover:bg-muted hover:border-border-strong"
          }
        `}
      >
        <span className="hidden sm:inline">Next</span>
        <ChevronRight className={classes.icon} />
      </button>
    </div>
  );
};
