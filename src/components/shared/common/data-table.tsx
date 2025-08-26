import { ReactNode } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";

export interface TableColumn<T = any> {
  key: string;
  label: string;
  className?: string;
  render?: (item: T, index: number) => ReactNode;
  sortable?: boolean;
}

interface DataTableProps<T = any> {
  data: T[];
  columns: TableColumn<T>[];
  loading?: boolean;
  emptyMessage?: string;
  className?: string;
  onRowClick?: (item: T) => void;
  getRowKey?: (item: T, index: number) => string;
}

export function DataTable<T = any>({
  data,
  columns,
  loading = true,
  emptyMessage = "No data found",
  className = "",
  onRowClick,
  getRowKey = (_, index) => index.toString(),
}: DataTableProps<T>) {
  if (loading) {
    return (
      <div className={`rounded-md border overflow-x-auto ${className}`}>
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((column) => (
                <TableHead
                  key={column.key}
                  className={`font-semibold text-xs ${column.className || ""}`}
                >
                  {column.label}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {[...Array(10)].map((_, i) => (
              <TableRow key={i}>
                {columns.map((column) => (
                  <TableCell
                    key={column.key}
                    className={column.className || ""}
                  >
                    <Skeleton className="h-4 w-full" />
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  }

  return (
    <div className={`rounded-md border overflow-x-auto ${className}`}>
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((column) => (
              <TableHead
                key={column.key}
                className={`font-semibold text-xs ${column.className || ""}`}
              >
                <div className="flex items-center gap-1">
                  <span>{column.label}</span>
                </div>
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {!data || data.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={columns.length}
                className="px-4 py-8 text-center text-muted-foreground"
              >
                {emptyMessage}
              </TableCell>
            </TableRow>
          ) : (
            data.map((item, index) => (
              <TableRow
                key={getRowKey(item, index)}
                className={`transition-all duration-200 hover:bg-muted/30 ${
                  onRowClick ? "cursor-pointer" : ""
                }`}
                onClick={() => onRowClick?.(item)}
              >
                {columns.map((column) => {
                  const hasMaxWidth = column.className?.includes("max-w-");
                  const cellContent = column.render
                    ? column.render(item, index)
                    : String(item[column.key as keyof T] || "---");

                  return (
                    <TableCell
                      key={column.key}
                      className={`${column.className || ""} ${
                        hasMaxWidth ? "truncate" : ""
                      }`}
                      title={
                        hasMaxWidth && typeof cellContent === "string"
                          ? cellContent
                          : undefined
                      }
                    >
                      {cellContent}
                    </TableCell>
                  );
                })}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
