"use client";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { SubscriptionPlanModel } from "@/models/dashboard/master-data/subscription-plan/subscription-plan-response";
import { getAllSubscriptionPlanService } from "@/services/dashboard/master-data/subscrion-plan/subscription-plan.service";
import { debounce } from "@/utils/debounce/debounce";
import {
  Check,
  ChevronsUpDown,
  Loader2,
  DollarSign,
  Calendar,
  Users,
  Star,
  Shield,
  Zap,
  Crown,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";

interface ComboboxSelectedProps {
  dataSelect: SubscriptionPlanModel | null;
  onChangeSelected: (item: SubscriptionPlanModel) => void;
  disabled?: boolean;
}

export function ComboboxSelectPlan({
  dataSelect,
  onChangeSelected,
  disabled = false,
}: ComboboxSelectedProps) {
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [data, setData] = useState<SubscriptionPlanModel[]>([]);
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(false);
  const [loading, setLoading] = useState(false);

  // Intersection Observer Hook
  const { ref, inView } = useInView({ threshold: 1 });

  // Helper functions for plan styling
  const getPlanIcon = (plan: SubscriptionPlanModel) => {
    if (plan.isFree)
      return <Star className="w-4 h-4 text-amber-500 flex-shrink-0" />;
    if (plan.price >= 199)
      return <Crown className="w-4 h-4 text-purple-500 flex-shrink-0" />;
    if (plan.price >= 79)
      return <Zap className="w-4 h-4 text-blue-500 flex-shrink-0" />;
    return <Shield className="w-4 h-4 text-green-500 flex-shrink-0" />;
  };

  const getPlanBadgeColor = (plan: SubscriptionPlanModel) => {
    if (plan.isFree) return "bg-amber-100 text-amber-700 border-amber-200";
    if (plan.price >= 199)
      return "bg-purple-100 text-purple-700 border-purple-200";
    if (plan.price >= 79) return "bg-blue-100 text-blue-700 border-blue-200";
    return "bg-green-100 text-green-700 border-green-200";
  };

  const formatDuration = (days: number) => {
    if (days >= 365)
      return `${Math.floor(days / 365)} year${days >= 730 ? "s" : ""}`;
    if (days >= 30)
      return `${Math.floor(days / 30)} month${days >= 60 ? "s" : ""}`;
    return `${days} day${days !== 1 ? "s" : ""}`;
  };

  // Fetch data from API
  const fetchData = async (search = "", newPage = 1) => {
    if (loading || (lastPage && newPage > 1)) return;
    setLoading(true);
    try {
      const result = await getAllSubscriptionPlanService({
        search,
        pageSize: 10,
        pageNo: newPage,
      });
      if (!result) {
        console.error("No data returned from getAllSubscriptionPlanService");
        return;
      }
      if (newPage === 1) {
        setData(result.content);
      } else {
        setData((prev) => [...prev, ...result.content]);
      }
      setPage(result.pageNo);
      setLastPage(result.last);
    } catch (error) {
      console.error("Error fetching subscription plan:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch data on mount
  useEffect(() => {
    fetchData();
  }, []);

  // Handle search input with debounce
  useEffect(() => {
    const delaySearch = setTimeout(() => {
      fetchData(searchTerm, 1);
    }, 500);

    return () => clearTimeout(delaySearch);
  }, [searchTerm]);

  // Load more when last item is visible
  useEffect(() => {
    if (inView && !lastPage && !loading) {
      fetchData(searchTerm, page + 1);
    }
  }, [inView]);

  async function onChangeSearch(value: string) {
    setSearchTerm(value);
    onSearchClick(value);
  }

  const onSearchClick = useCallback(
    debounce(async (value: string) => {
      fetchData(value);
    }),
    [searchTerm]
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(
            "w-full h-auto min-h-[2.5rem] hover:bg-transparent hover:text-muted-foreground flex-1 justify-between p-3",
            !dataSelect && "text-muted-foreground",
            disabled && "opacity-50 cursor-not-allowed",
            dataSelect && "border-blue-200 bg-blue-50"
          )}
          disabled={disabled}
        >
          {dataSelect ? (
            <div className="flex items-center space-x-3 text-left">
              {getPlanIcon(dataSelect)}
              <div>
                <div className="font-medium text-gray-900">
                  {dataSelect.name}
                </div>
                <div className="text-sm text-gray-500">
                  {dataSelect.pricingDisplay} •{" "}
                  {dataSelect.activeSubscriptionsCount} active
                </div>
              </div>
            </div>
          ) : (
            "Select a plan..."
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-[var(--radix-popover-trigger-width)] p-0 z-50"
        align="start"
        side="bottom"
        sideOffset={4}
        avoidCollisions={true}
        collisionPadding={10}
      >
        <Command className="overflow-hidden">
          <CommandInput
            placeholder="Search plans..."
            value={searchTerm}
            onValueChange={onChangeSearch}
            className="border-0 border-b border-gray-100 rounded-none"
          />
          <CommandList
            className="max-h-80 overflow-y-auto overflow-x-hidden"
            onWheel={(e) => {
              e.stopPropagation();
              const target = e.currentTarget;
              target.scrollTop += e.deltaY;
            }}
          >
            <CommandEmpty className="py-6 text-center text-sm text-gray-500">
              No plans found matching your search.
            </CommandEmpty>
            <CommandGroup className="p-0 overflow-hidden">
              {data?.map((item, index) => (
                <CommandItem
                  key={item.id}
                  value={item.name}
                  onSelect={() => {
                    onChangeSelected(item);
                    setOpen(false);
                  }}
                  ref={index === data.length - 1 ? ref : null}
                  className={cn(
                    "p-4 cursor-pointer border-b border-gray-50 last:border-b-0",
                    "!bg-white hover:!bg-gray-50 transition-colors duration-150",
                    "data-[selected=true]:!bg-blue-50 data-[selected=true]:border-blue-100",
                    "focus:!bg-gray-50 focus:outline-none",
                    "overflow-hidden", // Prevent content overflow
                    dataSelect?.id === item.id && "!bg-blue-50 border-blue-100"
                  )}
                >
                  <div className="flex items-start justify-between w-full overflow-hidden">
                    <div className="flex items-start space-x-3 flex-1 min-w-0 overflow-hidden">
                      <div className="flex items-center mt-1 flex-shrink-0">
                        <Check
                          className={cn(
                            "h-4 w-4 mr-2 flex-shrink-0",
                            dataSelect?.id === item.id
                              ? "opacity-100 text-blue-600"
                              : "opacity-0"
                          )}
                        />
                        {getPlanIcon(item)}
                      </div>
                      <div className="flex-1 min-w-0 overflow-hidden">
                        <div className="flex items-center space-x-2 mb-1 overflow-hidden">
                          <h4 className="font-semibold text-gray-900 truncate flex-1 min-w-0">
                            {item.name}
                          </h4>
                          <div className="flex items-center space-x-1 flex-shrink-0">
                            <span
                              className={cn(
                                "text-xs px-2 py-1 rounded-full border font-medium whitespace-nowrap",
                                getPlanBadgeColor(item)
                              )}
                            >
                              {item.isFree ? "FREE" : "PAID"}
                            </span>
                            {!item.isPublic && (
                              <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-600 border border-gray-200 whitespace-nowrap">
                                PRIVATE
                              </span>
                            )}
                          </div>
                        </div>

                        {item.description && (
                          <p className="text-sm text-gray-600 mb-2 line-clamp-2 leading-relaxed break-words">
                            {item.description}
                          </p>
                        )}

                        <div className="flex items-center space-x-4 text-xs text-gray-500 overflow-hidden">
                          <div className="flex items-center space-x-1 flex-shrink-0">
                            <DollarSign className="w-3 h-3" />
                            <span className="font-medium whitespace-nowrap">
                              {item.pricingDisplay}
                            </span>
                          </div>
                          <div className="flex items-center space-x-1 flex-shrink-0">
                            <Calendar className="w-3 h-3" />
                            <span className="whitespace-nowrap">
                              {formatDuration(item.durationDays)}
                            </span>
                          </div>
                          <div className="flex items-center space-x-1 flex-shrink-0">
                            <Users className="w-3 h-3" />
                            <span className="whitespace-nowrap">
                              {item.activeSubscriptionsCount} active
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="text-right ml-4 flex-shrink-0">
                      <div className="text-lg font-bold text-gray-900 whitespace-nowrap">
                        {item.isFree ? "FREE" : `$${item.price}`}
                      </div>
                      {!item.isFree && (
                        <div className="text-xs text-gray-500 whitespace-nowrap">
                          per {formatDuration(item.durationDays)}
                        </div>
                      )}
                    </div>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>

            {/* Loading spinner */}
            {loading && (
              <div className="flex items-center justify-center py-4 border-t border-gray-100">
                <Loader2 className="animate-spin text-gray-500 h-5 w-5 mr-2" />
                <span className="text-sm text-gray-500">
                  Loading more plans...
                </span>
              </div>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
