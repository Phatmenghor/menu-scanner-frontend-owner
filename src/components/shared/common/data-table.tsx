import { ReactNode } from "react";

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
  loading = false,
  emptyMessage = "No data found",
  className = "",
  onRowClick,
  getRowKey = (_, index) => index.toString(),
}: DataTableProps<T>) {
  if (loading) {
    return (
      <div className={`rounded-md border overflow-x-auto ${className}`}>
        <table className="w-full text-sm">
          <thead className="bg-muted/50">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={`px-4 py-3 text-left font-semibold text-xs text-muted-foreground border-b border-border ${
                    column.className || ""
                  }`}
                >
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[...Array(5)].map((_, i) => (
              <tr key={i}>
                {columns.map((column) => (
                  <td
                    key={column.key}
                    className="px-4 py-3 border-b border-border/50"
                  >
                    <div className="h-4 bg-muted animate-pulse rounded" />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  return (
    <div
      className={`rounded-md border overflow-x-auto whitespace-nowrap ${className}`}
    >
      <table className="w-full text-sm">
        <thead className="bg-muted/50">
          <tr>
            {columns.map((column) => (
              <th
                key={column.key}
                className={`px-4 py-3 text-left font-semibold text-xs text-muted-foreground border-b border-border ${
                  column.className || ""
                }`}
              >
                <div
                  className={`flex items-center gap-1 ${
                    column.className || ""
                  }`}
                >
                  <span>{column.label}</span>
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {!data || data.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length}
                className="px-4 py-8 text-center text-muted-foreground border-b border-border/50"
              >
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((item, index) => (
              <tr
                key={getRowKey(item, index)}
                className={`text-sm transition-all duration-200 hover:bg-muted/30 ${
                  onRowClick ? "cursor-pointer" : ""
                }`}
                onClick={() => onRowClick?.(item)}
              >
                {columns.map((column) => (
                  <td
                    key={column.key}
                    className={`px-4 py-3 border-b border-border/50 ${
                      column.className || ""
                    }`}
                  >
                    {column.render
                      ? column.render(item, index)
                      : String(item[column.key as keyof T] || "---")}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
