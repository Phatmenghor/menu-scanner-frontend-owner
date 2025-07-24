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
import { BusinessStatus } from "@/constants/AppResource/status/status";
import { cn } from "@/lib/utils";
import { BusinessModel } from "@/models/dashboard/master-data/business/business.response.model";
import { getAllBusinessService } from "@/services/dashboard/master-data/business/business.service";
import { debounce } from "@/utils/debounce/debounce";
import { Check, ChevronsUpDown, Loader2 } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";

interface ComboboxSelectedProps {
  dataSelect: BusinessModel | null;
  onChangeSelected: (item: BusinessModel) => void; // Callback to notify parent about the selection change
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

  // Intersection Observer Hook
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
            "w-full h-10 flex-1 justify-between",
            !dataSelect && "text-muted-foreground",
            disabled && "opacity-50 cursor-not-allowed"
          )}
          disabled={disabled}
        >
          {/* Always show the name directly from dataSelect prop if available */}
          {dataSelect ? dataSelect.name : "Select a user..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-[var(--radix-popover-trigger-width)] p-0"
        align="start"
      >
        <Command>
          <CommandInput
            placeholder="Search user..."
            value={searchTerm}
            onValueChange={onChangeSearch}
          />
          <CommandList
            className="max-h-60 overflow-y-auto"
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
                    onChangeSelected(item); // Notify parent about the change
                    setOpen(false);
                  }}
                  ref={index === data.length - 1 ? ref : null} // Attach observer to last item
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      dataSelect?.id === item.id ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {item.name}
                </CommandItem>
              ))}
            </CommandGroup>

            {/* Loading spinner */}
            {loading && (
              <div className="text-center py-2">
                <Loader2 className="animate-spin text-gray-500 h-5 w-5 mx-auto" />
              </div>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
