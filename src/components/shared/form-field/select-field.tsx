"use client";

import React from "react";
import { Controller } from "react-hook-form";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SelectFieldProps } from ".";

export function SelectField({
  name,
  label,
  control,
  error,
  disabled = false,
  required = false,
  options,
  placeholder = "Select an option",
  onValueChange,
  className = "",
}: SelectFieldProps) {
  return (
    <div className={`space-y-2 ${className}`}>
      <Label htmlFor={name} className="text-sm font-medium">
        {label} {required && <span className="text-red-500">*</span>}
      </Label>
      <Controller
        control={control}
        name={name}
        render={({ field }) => {
          // Handle array values (for roles field)
          const currentValue = Array.isArray(field.value)
            ? field.value[0] || ""
            : field.value || "";

          return (
            <Select
              value={currentValue}
              onValueChange={(value) => {
                if (onValueChange) {
                  onValueChange(value);
                } else {
                  field.onChange(value);
                }
              }}
              disabled={disabled}
            >
              <SelectTrigger
                className={`transition-colors ${
                  error ? "border-red-500 focus:border-red-500" : ""
                }`}
              >
                <SelectValue placeholder={placeholder} />
              </SelectTrigger>
              <SelectContent>
                {options.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          );
        }}
      />
      {error && <p className="text-sm text-red-600">{error?.message}</p>}
    </div>
  );
}
