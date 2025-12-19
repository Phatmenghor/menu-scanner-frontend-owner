// src/components/shared/form-field/checkbox-field.tsx
"use client";

import React from "react";
import { Controller, Control, FieldValues, Path } from "react-hook-form";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface CheckboxFieldProps<T extends FieldValues> {
  name: Path<T>;
  label: string;
  control: Control<T>;
  error?: any;
  disabled?: boolean;
  className?: string;
}

export function CheckboxField<T extends FieldValues>({
  name,
  label,
  control,
  error,
  disabled = false,
  className = "",
}: CheckboxFieldProps<T>) {
  return (
    <div className={`space-y-2 ${className}`}>
      <Controller
        control={control}
        name={name}
        render={({ field }) => (
          <div className="flex items-center space-x-2">
            <Checkbox
              id={name}
              checked={field.value}
              onCheckedChange={field.onChange}
              disabled={disabled}
            />
            <Label
              htmlFor={name}
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              {label}
            </Label>
          </div>
        )}
      />
      {error && <p className="text-xs text-red-500">{error.message}</p>}
    </div>
  );
}
