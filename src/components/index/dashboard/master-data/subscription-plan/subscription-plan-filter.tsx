import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Download, RotateCw, Filter, X } from "lucide-react";
import {
  SUBSCRIPTION_PLAN_OPTIONS,
  SubscriptionPlanStatus,
} from "@/constants/AppResource/status/status";
import { AppIcons } from "@/constants/AppResource/icons/AppIcon";

interface Props {
  statusFilter: SubscriptionPlanStatus | undefined;
  onStatusChange: (val: SubscriptionPlanStatus) => void;

  minPrice: number | undefined;
  maxPrice: number | undefined;
  onPriceChange: (min?: number, max?: number) => void;

  minDuration: number | undefined;
  maxDuration: number | undefined;
  onDurationChange: (min?: number, max?: number) => void;

  publicOnly: boolean;
  freeOnly: boolean;
  setPublicOnly: (val: boolean) => void;
  setFreeOnly: (val: boolean) => void;

  onExport: () => void;
  onReset: () => void;
  disableReset: boolean;
}

export function SubscriptionPlanFilters({
  statusFilter,
  onStatusChange,
  minPrice,
  maxPrice,
  onPriceChange,
  minDuration,
  maxDuration,
  onDurationChange,
  publicOnly,
  freeOnly,
  setPublicOnly,
  setFreeOnly,
  onExport,
  onReset,
  disableReset,
}: Props) {
  // Calculate active filters for better UX
  const activeFilters = [
    statusFilter && {
      type: "status",
      label: `Status: ${
        SUBSCRIPTION_PLAN_OPTIONS.find((o) => o.value === statusFilter)?.label
      }`,
      clear: () => onStatusChange("" as any),
    },
    (minPrice || maxPrice) && {
      type: "price",
      label: `Price: ${minPrice || 0} - ${maxPrice || "∞"}`,
      clear: () => onPriceChange(undefined, undefined),
    },
    (minDuration || maxDuration) && {
      type: "duration",
      label: `Duration: ${minDuration || 0} - ${maxDuration || "∞"} days`,
      clear: () => onDurationChange(undefined, undefined),
    },
    publicOnly && {
      type: "public",
      label: "Public Only",
      clear: () => setPublicOnly(false),
    },
    freeOnly && {
      type: "free",
      label: "Free Only",
      clear: () => setFreeOnly(false),
    },
  ].filter(Boolean);

  return (
    <div className="space-y-5">
      {/* Filter Header with Active Count */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {activeFilters.length > 0 && (
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {activeFilters.length} active
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Active Filters Pills */}
      {activeFilters.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {activeFilters.map((filter: any, index) => (
            <div
              key={`${filter.type}-${index}`}
              className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded-full text-xs font-medium border border-blue-200 dark:border-blue-700"
            >
              <span>{filter.label}</span>
              <button
                onClick={filter.clear}
                title="Clear filter"
                className="hover:bg-blue-100 dark:hover:bg-blue-800 rounded-full p-0.5 transition-colors"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Filter Controls Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
        {/* Status Filter */}
        <div className="space-y-2">
          <Select value={statusFilter} onValueChange={onStatusChange}>
            <SelectTrigger className="h-9 text-sm min-w-[120px] dark:bg-gray-800 border-gray-200 dark:border-gray-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20">
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent>
              {SUBSCRIPTION_PLAN_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Price Range */}
        <div className="space-y-2">
          <div className="grid grid-cols-2 gap-2">
            <Input
              type="number"
              value={minPrice ?? ""}
              onChange={(e) =>
                onPriceChange(Number(e.target.value) || undefined, maxPrice)
              }
              placeholder="Min"
              className="h-9 text-sm bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
              min="0"
            />
            <Input
              type="number"
              value={maxPrice ?? ""}
              onChange={(e) =>
                onPriceChange(minPrice, Number(e.target.value) || undefined)
              }
              placeholder="Max"
              className="h-9 text-sm bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
              min="0"
            />
          </div>
        </div>

        {/* Duration Range */}
        <div className="space-y-2">
          <div className="grid grid-cols-2 gap-2">
            <Input
              type="number"
              value={minDuration ?? ""}
              onChange={(e) =>
                onDurationChange(
                  Number(e.target.value) || undefined,
                  maxDuration
                )
              }
              placeholder="Min"
              className="h-9 text-sm bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
              min="0"
            />
            <Input
              type="number"
              value={maxDuration ?? ""}
              onChange={(e) =>
                onDurationChange(
                  minDuration,
                  Number(e.target.value) || undefined
                )
              }
              placeholder="Max"
              className="h-9 text-sm bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
              min="0"
            />
          </div>
        </div>

        {/* Plan Type Filters */}
        <div className="space-y-2">
          <div className="flex flex-row">
            <label className="flex items-center gap-3 cursor-pointer group">
              <Checkbox
                checked={publicOnly}
                onCheckedChange={(val) => setPublicOnly(Boolean(val))}
                className="data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600 border-gray-300 dark:border-gray-600"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-gray-100 transition-colors">
                Public Only
              </span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer group">
              <Checkbox
                checked={freeOnly}
                onCheckedChange={(val) => setFreeOnly(Boolean(val))}
                className="data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600 border-gray-300 dark:border-gray-600"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-gray-100 transition-colors">
                Free Only
              </span>
            </label>
          </div>
        </div>
        {/* Quick Actions */}
        <div className="flex items-center gap-2">
          <Button
            onClick={onExport}
            variant="outline"
            size="sm"
            className="gap-2 text-xs hover:bg-green-50 dark:hover:bg-green-900/20 text-black transition-colors"
          >
            <img src={AppIcons.Excel} alt="excel" className="h-3 w-3" />
            Export
            <Download className="w-3 h-3" />
          </Button>

          <Button
            onClick={onReset}
            disabled={disableReset}
            variant="outline"
            size="sm"
            className="gap-2 text-xs text-black disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <RotateCw className="h-3 w-3" />
          </Button>
        </div>
      </div>
    </div>
  );
}
