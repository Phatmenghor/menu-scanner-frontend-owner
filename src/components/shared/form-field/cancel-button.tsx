// components/shared/form/CancelButton.tsx
"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface CancelButtonProps {
  onClick: () => void;
  disabled?: boolean;
  text?: string;
  className?: string;
  variant?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link";
  showIcon?: boolean;
}

export function CancelButton({
  onClick,
  disabled = false,
  text = "Cancel",
  className,
  variant = "outline",
  showIcon = false,
}: CancelButtonProps) {
  return (
    <Button
      type="button"
      variant={variant}
      onClick={onClick}
      disabled={disabled}
      className={cn("transition-all", className)}
    >
      {showIcon && <X className="mr-2 h-4 w-4" />}
      {text}
    </Button>
  );
}
