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

  publicOnly: boolean;
  freeOnly: boolean;
  setPublicOnly: (val: boolean) => void;
  setFreeOnly: (val: boolean) => void;

  onExport: () => void;
}

export function SubscriptionPlanFilters({
  statusFilter,
  onStatusChange,
  minPrice,
  maxPrice,
  onPriceChange,
  freeOnly,
  publicOnly,
  setFreeOnly,
  setPublicOnly,
  onExport,
}: Props) {
  return (
    <div className="w-full space-y-5">
      {/* Filter Controls Grid */}
      <div className="flex flex-row gap-2">
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
        <div className="grid grid-cols-2 gap-2">
          <Input
            type="number"
            value={minPrice ?? ""}
            onChange={(e) =>
              onPriceChange(Number(e.target.value) || undefined, maxPrice)
            }
            placeholder="Price Min"
            className="h-9 text-sm text-black bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
            min="0"
          />
          <Input
            type="number"
            value={maxPrice ?? ""}
            onChange={(e) =>
              onPriceChange(minPrice, Number(e.target.value) || undefined)
            }
            placeholder="Price Max"
            className="h-9 text-sm text-black bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
            min="0"
          />
        </div>

        {/* Quick Actions */}
        <div className="flex items-center gap-2">
          <Button
            onClick={onExport}
            variant="outline"
            size="sm"
            className="gap-2 h-9 text-xs text-black transition-colors"
          >
            <img src={AppIcons.Excel} alt="excel" className="h-4 w-4" />
            <Download className="w-3 h-3" />
          </Button>
        </div>
      </div>
    </div>
  );
}
