// src/components/shared/form-field/number-field.tsx
"use client";

import React from "react";
import { Controller, Control, FieldValues, Path } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface NumberFieldProps<T extends FieldValues> {
  name: Path<T>;
  label: string;
  control: Control<T>;
  error?: any;
  disabled?: boolean;
  required?: boolean;
  placeholder?: string;
  className?: string;
  min?: number;
  max?: number;
  step?: number;
}

export function NumberField<T extends FieldValues>({
  name,
  label,
  control,
  error,
  disabled = false,
  required = false,
  placeholder = "",
  className = "",
  min,
  max,
  step,
}: NumberFieldProps<T>) {
  return (
    <div className={`space-y-2 ${className}`}>
      <Label htmlFor={name} className="text-[12px] font-normal text-gray-300">
        {label} {required && <span className="text-red-500 ml-1">*</span>}
      </Label>
      <Controller
        control={control}
        name={name}
        render={({ field }) => (
          <Input
            {...field}
            id={name}
            type="number"
            placeholder={placeholder}
            disabled={disabled}
            min={min}
            max={max}
            step={step}
            onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
            value={field.value || ""}
            autoComplete="off"
            className={`transition-colors ${disabled ? "bg-muted/50" : ""} ${
              error ? "border-red-500 focus:border-red-500" : ""
            }`}
          />
        )}
      />
      {error && <p className="text-xs text-red-500">{error.message}</p>}
    </div>
  );
}
