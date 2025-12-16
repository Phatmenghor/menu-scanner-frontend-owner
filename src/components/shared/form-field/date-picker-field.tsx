"use client";

import React from "react";
import { Controller, Control, FieldValues, Path } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { CustomDatePicker } from "../common/custom-date-picker";

interface DatePickerFieldProps<T extends FieldValues> {
  name: Path<T>;
  label: string;
  control: Control<T>;
  error?: any;
  disabled?: boolean;
  required?: boolean;
  placeholder?: string;
  className?: string;
}

export function DatePickerField<T extends FieldValues>({
  name,
  label,
  control,
  error,
  disabled = false,
  required = false,
  placeholder = "Select date",
  className = "",
}: DatePickerFieldProps<T>) {
  return (
    <div className={`space-y-2 ${className}`}>
      <Label htmlFor={name} className="text-[12px] font-normal text-gray-300">
        {label} {required && <span className="text-red-500 ml-1">*</span>}
      </Label>
      <Controller
        control={control}
        name={name}
        render={({ field }) => (
          <CustomDatePicker
            value={field.value || ""}
            onChange={field.onChange}
            disabled={disabled}
            placeholder={placeholder}
            error={!!error}
          />
        )}
      />
      {error && <p className="text-xs text-red-500">{error?.message}</p>}
    </div>
  );
}
