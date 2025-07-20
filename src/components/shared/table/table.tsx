import React from "react";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// Generic type for table data
export interface TableData {
  id: string;
  [key: string]: any;
}

// Column configuration interface
export interface TableColumn<T = any> {
  key: string;
  label: string;
  icon?: LucideIcon;
  width?: string;
  align?: "left" | "center" | "right";
  sortable?: boolean;
  render?: (item: T, index: number) => React.ReactNode;
  headerRender?: () => React.ReactNode;
  className?: string;
  cellClassName?: string;
}

// Pagination data interface
export interface PaginatedData<T> {
  content: T[];
  total: number;
  pageNo: number;
  pageSize: number;
  totalPages: number;
}

// Table configuration interface
export interface TableConfig<T = any> {
  columns: TableColumn<T>[];
  data: PaginatedData<T> | null;
  loading?: boolean;
  emptyMessage?: string;
  showIndex?: boolean;
  indexLabel?: string;
  rowClassName?: string | ((item: T, index: number) => string);
  onRowClick?: (item: T, index: number) => void;
  tableClassName?: string;
  headerClassName?: string;
  bodyClassName?: string;
}

// Main configurable table component
export function ConfigurableTable<T extends TableData>({
  columns,
  data,
  loading = false,
  emptyMessage = "No data found",
  showIndex = true,
  indexLabel = "#",
  rowClassName,
  onRowClick,
  tableClassName,
  headerClassName,
  bodyClassName,
}: TableConfig<T>): React.JSX.Element {
  // Calculate index for pagination
  const getIndexDisplay = (index: number) => {
    if (!data) return index + 1;
    return ((data.pageNo || 1) - 1) * (data.pageSize || 10) + index + 1;
  };

  // Get row class name
  const getRowClassName = (item: T, index: number) => {
    const baseClass = "text-sm";
    const clickableClass = onRowClick ? "cursor-pointer hover:bg-muted/50" : "";

    if (typeof rowClassName === "function") {
      return cn(baseClass, clickableClass, rowClassName(item, index));
    }
    return cn(baseClass, clickableClass, rowClassName);
  };

  // Render table header
  const renderHeader = () => (
    <TableHeader className={headerClassName}>
      <TableRow>
        {showIndex && (
          <TableHead className="text-xs font-semibold text-muted-foreground w-[60px]">
            {indexLabel}
          </TableHead>
        )}
        {columns.map((column, index) => (
          <TableHead
            key={index}
            className={cn(
              "text-xs font-semibold text-muted-foreground",
              column.className
            )}
            style={{ width: column.width }}
          >
            {column.headerRender ? (
              column.headerRender()
            ) : (
              <div
                className={cn(
                  "flex items-center gap-1",
                  column.align === "center" && "justify-center",
                  column.align === "right" && "justify-end"
                )}
              >
                {column.icon && <column.icon className="w-4 h-4" />}
                <span>{column.label}</span>
              </div>
            )}
          </TableHead>
        ))}
      </TableRow>
    </TableHeader>
  );

  // Render table body
  const renderBody = () => (
    <TableBody className={bodyClassName}>
      {loading ? (
        <TableRow>
          <TableCell
            colSpan={columns.length + (showIndex ? 1 : 0)}
            className="text-center py-8 text-muted-foreground"
          >
            Loading...
          </TableCell>
        </TableRow>
      ) : !data || data.content.length === 0 ? (
        <TableRow>
          <TableCell
            colSpan={columns.length + (showIndex ? 1 : 0)}
            className="text-center py-8 text-muted-foreground"
          >
            {emptyMessage}
          </TableCell>
        </TableRow>
      ) : (
        data.content.map((item, index) => (
          <TableRow
            key={item.id}
            className={getRowClassName(item, index)}
            onClick={() => onRowClick?.(item, index)}
          >
            {showIndex && (
              <TableCell className="font-medium truncate">
                {getIndexDisplay(index)}
              </TableCell>
            )}
            {columns.map((column, columnIndex) => (
              <TableCell
                key={columnIndex}
                className={cn(
                  column.cellClassName,
                  column.align === "center" && "text-center",
                  column.align === "right" && "text-right"
                )}
              >
                {column.render ? (
                  column.render(item, index)
                ) : (
                  <span>{item[column.key]}</span>
                )}
              </TableCell>
            ))}
          </TableRow>
        ))
      )}
    </TableBody>
  );

  return (
    <Table className={tableClassName}>
      {renderHeader()}
      {renderBody()}
    </Table>
  );
}
