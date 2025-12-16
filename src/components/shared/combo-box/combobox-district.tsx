"use client";

import { useEffect, useState, useRef } from "react";
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
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { Check, ChevronsUpDown, Loader2 } from "lucide-react";
import { useInView } from "react-intersection-observer";
import { useDebounce } from "@/utils/debounce/debounce";
import { useAppDispatch } from "@/redux/store";
import { DistrictResponseModel } from "@/redux/features/location/store/models/response/district-response";
import { fetchAllDistrictService } from "@/redux/features/location/store/thunks/district-thunks";

interface ComboboxSelectedProps {
  dataSelect: DistrictResponseModel | null;
  onChangeSelected: (item: DistrictResponseModel | null) => void;
  disabled?: boolean;
  label?: string;
  required?: boolean;
  size?: "sm" | "md" | "lg";
  placeholder?: string;
  showAllOption?: boolean;
}

const ALL_OPTION: DistrictResponseModel = {
  id: "all",
  districtEn: "All",
  districtKh: "ទាំងអស់",
  districtCode: "",
} as DistrictResponseModel;

export function ComboboxSelectDistrict({
  dataSelect,
  onChangeSelected,
  disabled = false,
  label = "District",
  required = false,
  size = "md",
  placeholder = "Select a district...",
  showAllOption = true,
}: ComboboxSelectedProps) {
  const dispatch = useAppDispatch();

  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [data, setData] = useState<DistrictResponseModel[]>([]);
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(false);
  const [loading, setLoading] = useState(false);

  const { ref, inView } = useInView({ threshold: 0.5 });
  const debouncedSearch = useDebounce(searchTerm, 400);

  // Use refs to track loading state and avoid stale closures
  const loadingRef = useRef(false);
  const lastPageRef = useRef(false);

  // Update refs when state changes
  useEffect(() => {
    loadingRef.current = loading;
    lastPageRef.current = lastPage;
  }, [loading, lastPage]);

  // Size classes matching CustomSelect
  const sizeClasses = {
    sm: "h-8 text-xs",
    md: "h-9 text-sm",
    lg: "h-10 text-base",
  };

  // Fetch data function
  const fetchData = async (search: string, newPage: number) => {
    if (loadingRef.current || (lastPageRef.current && newPage > 1)) return;

    setLoading(true);

    try {
      const result = await dispatch(
        fetchAllDistrictService({ search, pageNo: newPage, pageSize: 10 })
      ).unwrap();

      if (!result) return;

      if (newPage === 1) {
        // Add "All" option at the beginning only when showAllOption is true and no search
        const newData = result.content;
        if (showAllOption && !search) {
          setData([ALL_OPTION, ...newData]);
        } else {
          setData(newData);
        }
      } else {
        setData((prev) => [...prev, ...result.content]);
      }

      setPage(result.pageNo);
      setLastPage(result.last);
    } catch (error) {
      console.error("Error fetching provinces:", error);
    } finally {
      setLoading(false);
    }
  };

  // Reset and fetch first page when search changes
  useEffect(() => {
    setPage(1);
    setLastPage(false);
    setData([]);
    fetchData(debouncedSearch, 1);
  }, [debouncedSearch]);

  // Infinite scroll - load more when scrolling to bottom
  useEffect(() => {
    if (
      inView &&
      !loadingRef.current &&
      !lastPageRef.current &&
      data.length > 0
    ) {
      fetchData(debouncedSearch, page + 1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView]);

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
  };

  const handleSelect = (item: DistrictResponseModel) => {
    if (item.id === "all") {
      onChangeSelected(null);
    } else {
      onChangeSelected(item);
    }
    setOpen(false);
  };

  return (
    <div className="space-y-2 w-full">
      {label && (
        <Label className="text-[12px] font-normal text-gray-300">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </Label>
      )}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className={cn(
              "w-full justify-between min-w-[150px]",
              sizeClasses[size],
              !dataSelect && "text-muted-foreground",
              disabled && "opacity-50 cursor-not-allowed"
            )}
            disabled={disabled}
          >
            {dataSelect
              ? dataSelect.districtEn ||
                dataSelect.districtKh ||
                dataSelect.districtCode
              : placeholder}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>

        <PopoverContent
          className="w-[var(--radix-popover-trigger-width)] p-0"
          align="start"
        >
          <Command>
            <CommandInput
              placeholder="Search province..."
              value={searchTerm}
              onValueChange={handleSearchChange}
            />
            <CommandList className="max-h-60 overflow-y-auto">
              <CommandEmpty>No province found.</CommandEmpty>
              <CommandGroup>
                {data.map((item, index) => (
                  <CommandItem
                    key={item.id}
                    value={item.districtEn}
                    onSelect={() => handleSelect(item)}
                    ref={index === data.length - 1 ? ref : null}
                    className={sizeClasses[size]}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        (item.id === "all" && !dataSelect) ||
                          dataSelect?.id === item.id
                          ? "opacity-100"
                          : "opacity-0"
                      )}
                    />
                    {item.id === "all" ? (
                      item.districtEn
                    ) : (
                      <>{item.districtEn || item.districtKh}</>
                    )}
                  </CommandItem>
                ))}
              </CommandGroup>

              {loading && (
                <div className="text-center py-2">
                  <Loader2 className="animate-spin text-gray-500 h-5 w-5 mx-auto" />
                </div>
              )}

              {!loading && lastPage && data.length > 0 && (
                <div className="text-center py-2 text-sm text-gray-400">
                  No more district
                </div>
              )}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}
