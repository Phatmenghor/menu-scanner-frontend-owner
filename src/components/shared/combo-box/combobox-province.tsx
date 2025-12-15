"use client";

import { useEffect, useState, useCallback } from "react";
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
import { Check, ChevronsUpDown, Loader2 } from "lucide-react";
import { useInView } from "react-intersection-observer";
import { useDebounce } from "@/utils/debounce/debounce";
import { ProvinceResponseModel } from "@/redux/features/location/store/models/response/province-response";
import { fetchAllProvinceService } from "@/redux/features/location/store/thunks/province-thunks";
import { useAppDispatch } from "@/redux/store";

interface ComboboxSelectedProps {
  dataSelect: ProvinceResponseModel | null;
  onChangeSelected: (item: ProvinceResponseModel) => void;
  disabled?: boolean;
}

export function ComboboxSelectProvince({
  dataSelect,
  onChangeSelected,
  disabled = false,
}: ComboboxSelectedProps) {
  const dispatch = useAppDispatch();

  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [data, setData] = useState<ProvinceResponseModel[]>([]);
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(false);
  const [loading, setLoading] = useState(false);

  const { ref, inView } = useInView({ threshold: 1 });
  const debouncedSearch = useDebounce(searchTerm, 400);

  const fetchData = useCallback(
    async (search = "", newPage = 1) => {
      if (loading || (lastPage && newPage > 1)) return;
      setLoading(true);

      try {
        const result = await dispatch(
          fetchAllProvinceService({ search, pageNo: newPage, pageSize: 10 })
        ).unwrap();

        if (!result) return;

        if (newPage === 1) {
          setData(result.content);
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
    },
    [dispatch, loading, lastPage]
  );

  // Fetch first page on mount or when search changes
  useEffect(() => {
    fetchData(debouncedSearch, 1);
  }, [debouncedSearch, fetchData]);

  // Infinite scroll
  useEffect(() => {
    if (inView && !lastPage && !loading && data.length > 15) {
      fetchData(debouncedSearch, page + 1);
    }
  }, [
    inView,
    debouncedSearch,
    page,
    lastPage,
    loading,
    data.length,
    fetchData,
  ]);

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(
            "w-full h-10 flex-1 justify-between",
            !dataSelect && "text-muted-foreground",
            disabled && "opacity-50 cursor-not-allowed"
          )}
          disabled={disabled}
        >
          {dataSelect
            ? dataSelect.provinceEn ||
              dataSelect.provinceKh ||
              dataSelect.provinceCode
            : "Select a province..."}
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
                  value={item.provinceEn}
                  onSelect={() => {
                    onChangeSelected(item);
                    setOpen(false);
                  }}
                  ref={index === data.length - 1 ? ref : null}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      dataSelect?.id === item.id ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {item.provinceEn} ({item.provinceKh}) — {item.provinceCode}
                </CommandItem>
              ))}
            </CommandGroup>

            {/* Loading spinner while fetching more */}
            {loading && (
              <div className="text-center py-2">
                <Loader2 className="animate-spin text-gray-500 h-5 w-5 mx-auto" />
              </div>
            )}

            {/* Show message when last page reached */}
            {!loading && lastPage && data.length > 0 && (
              <div className="text-center py-2 text-sm text-gray-400">
                No more provinces
              </div>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
