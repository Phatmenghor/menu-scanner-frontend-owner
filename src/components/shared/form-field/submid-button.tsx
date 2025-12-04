"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface SubmitButtonProps {
  isSubmitting: boolean;
  isDirty?: boolean;
  isCreate?: boolean;
  createText?: string;
  updateText?: string;
  submittingCreateText?: string;
  submittingUpdateText?: string;
  disabled?: boolean;
  onClick?: () => void;
  className?: string;
  variant?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link";
  size?: "default" | "sm" | "lg" | "icon";
  icon?: React.ReactNode;
}

export function SubmitButton({
  isSubmitting,
  isDirty = true,
  isCreate = false,
  createText = "Create",
  updateText = "Update",
  submittingCreateText = "Creating...",
  submittingUpdateText = "Updating...",
  disabled = false,
  onClick,
  className,
  variant = "default",
  size = "default",
  icon,
}: SubmitButtonProps) {
  const isDisabled = isSubmitting || disabled || (!isDirty && !isCreate);

  const getButtonText = () => {
    if (isSubmitting) {
      return isCreate ? submittingCreateText : submittingUpdateText;
    }
    return isCreate ? createText : updateText;
  };

  return (
    <Button
      type="submit"
      onClick={onClick}
      disabled={isDisabled}
      variant={variant}
      size={size}
      className={cn("min-w-[120px] transition-all", className)}
    >
      {isSubmitting ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          {getButtonText()}
        </>
      ) : (
        <>
          {icon && <span className="mr-2">{icon}</span>}
          {getButtonText()}
        </>
      )}
    </Button>
  );
}
