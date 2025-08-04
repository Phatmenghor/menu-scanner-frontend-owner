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
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { BusinessStatus } from "@/constants/AppResource/status/status";
import { cn } from "@/lib/utils";
import { BusinessModel } from "@/models/dashboard/master-data/business/business.response.model";
import { getAllBusinessService } from "@/services/dashboard/master-data/business/business.service";
import { debounce } from "@/utils/debounce/debounce";
import {
  Check,
  ChevronsUpDown,
  Loader2,
  MapPin,
  Phone,
  Mail,
  Globe,
  Users,
  Clock,
  AlertTriangle,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";

interface ComboboxSelectedProps {
  dataSelect: BusinessModel | null;
  onChangeSelected: (item: BusinessModel) => void;
  disabled?: boolean;
}

export function ComboboxSelectBusiness({
  dataSelect,
  onChangeSelected,
  disabled = false,
}: ComboboxSelectedProps) {
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [data, setData] = useState<BusinessModel[]>([]);
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(false);
  const [loading, setLoading] = useState(false);

  const { ref, inView } = useInView({ threshold: 1 });

  // Fetch data from API
  const fetchData = async (search = "", newPage = 1) => {
    if (loading || (lastPage && newPage > 1)) return;
    setLoading(true);
    try {
      const result = await getAllBusinessService({
        search,
        pageSize: 10,
        pageNo: newPage,
      });
      if (!result) {
        console.error("No data returned from getAllBusinessService");
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
      console.error("Error fetching business:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const delaySearch = setTimeout(() => {
      fetchData(searchTerm, 1);
    }, 500);

    return () => clearTimeout(delaySearch);
  }, [searchTerm]);

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

  const getStatusIcon = (
    status: string,
    isSubscriptionActive: boolean,
    isExpiringSoon: boolean
  ) => {
    if (status === "ACTIVE" && isSubscriptionActive && !isExpiringSoon) {
      return <CheckCircle className="h-3 w-3 text-green-500" />;
    } else if (isExpiringSoon) {
      return <AlertTriangle className="h-3 w-3 text-yellow-500" />;
    } else {
      return <XCircle className="h-3 w-3 text-red-500" />;
    }
  };

  const getStatusVariant = (
    status: string,
    isSubscriptionActive: boolean,
    isExpiringSoon: boolean
  ) => {
    if (status === "ACTIVE" && isSubscriptionActive && !isExpiringSoon) {
      return "default";
    } else if (isExpiringSoon) {
      return "secondary";
    } else {
      return "destructive";
    }
  };

  const getStatusText = (
    status: string,
    isSubscriptionActive: boolean,
    isExpiringSoon: boolean,
    daysRemaining: number
  ) => {
    if (status === "ACTIVE" && isSubscriptionActive && !isExpiringSoon) {
      return "Active";
    } else if (isExpiringSoon) {
      return `${daysRemaining} days left`;
    } else {
      return "Inactive";
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(
            "w-full h-10 flex-1 hover:bg-transparent hover:text-foreground justify-between",
            !dataSelect && "text-muted-foreground",
            disabled && "opacity-50 cursor-not-allowed"
          )}
          disabled={disabled}
        >
          {dataSelect ? dataSelect.name : "Select a business..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[500px] p-0" align="start">
        <Command>
          <CommandInput
            placeholder="Search business..."
            value={searchTerm}
            onValueChange={onChangeSearch}
          />
          <CommandList
            className="max-h-80 overflow-y-auto"
            onWheel={(e) => {
              e.stopPropagation();
              const target = e.currentTarget;
              target.scrollTop += e.deltaY;
            }}
          >
            <CommandEmpty>No business found.</CommandEmpty>
            <CommandGroup>
              {data?.map((item, index) => (
                <CommandItem
                  key={item.id}
                  value={item.name}
                  onSelect={() => {
                    onChangeSelected(item);
                    setOpen(false);
                  }}
                  ref={index === data.length - 1 ? ref : null}
                  className="p-4 cursor-pointer hover:bg-gray-50 border-b last:border-b-0 !bg-white data-[selected=true]:!bg-blue-50"
                >
                  <div className="flex items-start space-x-3 w-full">
                    {/* Business Logo/Avatar */}
                    <Avatar className="h-12 w-12 flex-shrink-0">
                      <AvatarImage src={item.imageUrl} alt={item.name} />
                      <AvatarFallback className="bg-blue-100 text-blue-600 font-semibold">
                        {item.name
                          .split(" ")
                          .map((word) => word[0])
                          .join("")
                          .slice(0, 2)
                          .toUpperCase()}
                      </AvatarFallback>
                    </Avatar>

                    {/* Business Information */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 truncate">
                            {item.name}
                          </h3>
                          <p className="text-sm text-gray-600 capitalize">
                            {item.businessType}
                          </p>
                        </div>
                        <div className="flex items-center space-x-2 ml-2">
                          {getStatusIcon(
                            item.status,
                            item.isSubscriptionActive,
                            item.isExpiringSoon
                          )}
                          <Badge
                            variant={getStatusVariant(
                              item.status,
                              item.isSubscriptionActive,
                              item.isExpiringSoon
                            )}
                            className="text-xs"
                          >
                            {getStatusText(
                              item.status,
                              item.isSubscriptionActive,
                              item.isExpiringSoon,
                              item.daysRemaining
                            )}
                          </Badge>
                          <Check
                            className={cn(
                              "h-4 w-4 ml-2",
                              dataSelect?.id === item.id
                                ? "opacity-100 text-blue-600"
                                : "opacity-0"
                            )}
                          />
                        </div>
                      </div>

                      {/* Contact Info */}
                      <div className="grid grid-cols-1 gap-1 mb-2">
                        {item.email && (
                          <div className="flex items-center text-xs text-gray-500">
                            <Mail className="h-3 w-3 mr-1 flex-shrink-0" />
                            <span className="truncate">{item.email}</span>
                          </div>
                        )}
                        {item.phone && (
                          <div className="flex items-center text-xs text-gray-500">
                            <Phone className="h-3 w-3 mr-1 flex-shrink-0" />
                            <span className="truncate">{item.phone}</span>
                          </div>
                        )}
                        {item.address && (
                          <div className="flex items-center text-xs text-gray-500">
                            <MapPin className="h-3 w-3 mr-1 flex-shrink-0" />
                            <span className="truncate">{item.address}</span>
                          </div>
                        )}
                      </div>

                      {/* Business Stats */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4 text-xs text-gray-500">
                          <div className="flex items-center">
                            <Users className="h-3 w-3 mr-1" />
                            <span>{item.totalStaff} staff</span>
                          </div>
                          <div className="flex items-center">
                            <Clock className="h-3 w-3 mr-1" />
                            <span>{item.totalCustomers} customers</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>

            {/* Loading spinner */}
            {loading && (
              <div className="text-center py-4">
                <Loader2 className="animate-spin text-gray-500 h-5 w-5 mx-auto" />
                <p className="text-xs text-gray-500 mt-2">
                  Loading more businesses...
                </p>
              </div>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
