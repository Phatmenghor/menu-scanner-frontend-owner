"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar, ChevronLeft, ChevronRight, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface DatePickerProps {
  value?: string;
  onChange: (date: string) => void;
  disabled?: boolean;
  placeholder?: string;
  className?: string;
  error?: boolean;
}

const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const DAYS = ["S", "M", "T", "W", "T", "F", "S"];

export function CustomDatePicker({
  value,
  onChange,
  disabled = false,
  placeholder = "Select date",
  className,
  error = false,
}: DatePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [viewDate, setViewDate] = useState<Date>(new Date());

  // Initialize selected date from value prop
  useEffect(() => {
    if (value) {
      const date = new Date(value);
      if (!isNaN(date.getTime())) {
        setSelectedDate(date);
        setViewDate(date);
      }
    }
  }, [value]);

  // Format date for display
  const formatDate = (date: Date): string => {
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Format date for form submission (YYYY-MM-DD)
  const formatDateForForm = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  // Handle date selection
  const handleDateSelect = (day: number) => {
    const newDate = new Date(viewDate.getFullYear(), viewDate.getMonth(), day);
    setSelectedDate(newDate);
    onChange(formatDateForForm(newDate));
    setIsOpen(false);
  };

  // Handle month change
  const handleMonthChange = (month: string) => {
    const monthIndex = MONTHS.indexOf(month);
    const newDate = new Date(viewDate.getFullYear(), monthIndex, 1);
    setViewDate(newDate);
  };

  // Handle year change
  const handleYearChange = (year: string) => {
    const newDate = new Date(parseInt(year), viewDate.getMonth(), 1);
    setViewDate(newDate);
  };

  // Navigate months
  const navigateMonth = (direction: "prev" | "next") => {
    const newDate = new Date(viewDate);
    if (direction === "prev") {
      newDate.setMonth(newDate.getMonth() - 1);
    } else {
      newDate.setMonth(newDate.getMonth() + 1);
    }
    setViewDate(newDate);
  };

  // Generate calendar days
  const generateCalendarDays = () => {
    const year = viewDate.getFullYear();
    const month = viewDate.getMonth();

    const firstDayOfMonth = new Date(year, month, 1);
    const startDate = new Date(firstDayOfMonth);
    startDate.setDate(startDate.getDate() - firstDayOfMonth.getDay());

    const days = [];
    const currentDate = new Date(startDate);

    // Generate 5 weeks of days (35 days total) for compact view
    for (let i = 0; i < 35; i++) {
      const dayObj = {
        date: new Date(currentDate),
        day: currentDate.getDate(),
        isCurrentMonth: currentDate.getMonth() === month,
        isSelected: selectedDate
          ? currentDate.toDateString() === selectedDate.toDateString()
          : false,
        isToday: currentDate.toDateString() === new Date().toDateString(),
      };
      days.push(dayObj);
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return days;
  };

  // Generate year options
  const generateYearOptions = () => {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let i = currentYear - 50; i <= currentYear + 50; i++) {
      years.push(i.toString());
    }
    return years;
  };

  // Clear selection
  const clearSelection = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setSelectedDate(null);
    onChange("");
  };

  const calendarDays = generateCalendarDays();
  const yearOptions = generateYearOptions();

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-full justify-start text-left font-normal h-10 px-3 text-sm",
            !selectedDate && "text-muted-foreground",
            error && "border-red-500 focus:border-red-500",
            !error && "focus:border-green-500",
            disabled && "opacity-50 cursor-not-allowed",
            className
          )}
          disabled={disabled}
        >
          <Calendar className="mr-2 h-4 w-4" />
          <span className="flex-1">
            {selectedDate ? formatDate(selectedDate) : placeholder}
          </span>
          {selectedDate && !disabled && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="ml-1 h-6 w-6 p-0 hover:bg-destructive/10 hover:text-destructive"
              onClick={clearSelection}
            >
              <X className="h-3 w-3" />
            </Button>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-72 p-0" align="start">
        {/* Header */}
        <div className="flex items-center justify-between p-3 border-b bg-muted/30">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigateMonth("prev")}
              className="h-6 w-6 p-0 hover:bg-accent"
            >
              <ChevronLeft className="h-3 w-3" />
            </Button>

            <div className="flex gap-1">
              <Select
                value={MONTHS[viewDate.getMonth()]}
                onValueChange={handleMonthChange}
              >
                <SelectTrigger className="h-8 text-sm w-auto min-w-[60px] border-0 bg-transparent hover:bg-accent">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {MONTHS.map((month) => (
                    <SelectItem key={month} value={month}>
                      {month}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select
                value={viewDate.getFullYear().toString()}
                onValueChange={handleYearChange}
              >
                <SelectTrigger className="h-8 text-sm w-auto min-w-[65px] border-0 bg-transparent hover:bg-accent">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {yearOptions.map((year) => (
                    <SelectItem key={year} value={year}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigateMonth("next")}
              className="h-6 w-6 p-0 hover:bg-accent"
            >
              <ChevronRight className="h-3 w-3" />
            </Button>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsOpen(false)}
            className="h-6 w-6 p-0 opacity-50 hover:opacity-100 hover:bg-accent"
          >
            <X className="h-3 w-3" />
          </Button>
        </div>

        {/* Calendar Grid */}
        <div className="p-3">
          {/* Days header */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {DAYS.map((day) => (
              <div
                key={day}
                className="h-8 w-8 flex items-center justify-center text-xs font-medium text-muted-foreground"
              >
                {day}
              </div>
            ))}
          </div>

          {/* Calendar days */}
          <div className="grid grid-cols-7 gap-1">
            {calendarDays.map((dayObj, index) => (
              <Button
                key={index}
                variant="ghost"
                size="sm"
                onClick={() => handleDateSelect(dayObj.day)}
                disabled={!dayObj.isCurrentMonth}
                className={cn(
                  "h-8 w-8 p-0 text-xs font-normal transition-all hover:bg-accent hover:text-accent-foreground",
                  !dayObj.isCurrentMonth &&
                    "text-muted-foreground/30 hover:text-muted-foreground/30 hover:bg-transparent cursor-not-allowed",
                  dayObj.isSelected &&
                    "bg-primary text-primary-foreground hover:bg-primary/90 font-medium",
                  dayObj.isToday &&
                    !dayObj.isSelected &&
                    "bg-accent text-accent-foreground font-semibold ring-1 ring-border"
                )}
              >
                {dayObj.day}
              </Button>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 border-t bg-muted/30">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              const today = new Date();
              setSelectedDate(today);
              setViewDate(today);
              onChange(formatDateForForm(today));
              setIsOpen(false);
            }}
            className="w-full h-8 text-xs hover:bg-accent"
          >
            Today
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
