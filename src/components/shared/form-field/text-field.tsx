"use client";

import React from "react";
import { Controller } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface TextFieldProps {
  name: string;
  label: string;
  control: any;
  error?: any;
  disabled?: boolean;
  required?: boolean;
  type?: "text" | "email" | "tel" | "password" | "number";
  placeholder?: string;
  className?: string;
}

export function TextField({
  name,
  label,
  control,
  error,
  disabled = false,
  required = false,
  type = "text",
  placeholder = "",
  className = "",
}: TextFieldProps) {
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
            value={field.value || ""}
            id={name}
            type={type}
            placeholder={placeholder}
            disabled={disabled}
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
