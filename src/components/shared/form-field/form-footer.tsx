// components/shared/form/FormFooter.tsx
"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface FormFooterProps {
  isSubmitting: boolean;
  isDirty: boolean;
  isCreate: boolean;
  createMessage?: string;
  updateMessage?: string;
  noChangesMessage?: string;
  children: React.ReactNode;
  className?: string;
}

export function FormFooter({
  isSubmitting,
  isDirty,
  isCreate,
  createMessage = "Creating...",
  updateMessage = "Updating...",
  noChangesMessage = "No changes made",
  children,
  className,
}: FormFooterProps) {
  const getStatusMessage = () => {
    if (isSubmitting) {
      return isCreate ? createMessage : updateMessage;
    }
    if (isDirty) {
      return "You have unsaved changes";
    }
    return noChangesMessage;
  };

  return (
    <div
      className={cn(
        "flex justify-between items-center p-6 border-t bg-muted/30 flex-shrink-0",
        className
      )}
    >
      <div className="text-sm text-muted-foreground flex items-center gap-2">
        {isSubmitting && (
          <div className="h-2 w-2 rounded-full bg-blue-500 animate-pulse" />
        )}
        {isDirty && !isSubmitting && (
          <div className="h-2 w-2 rounded-full bg-orange-500" />
        )}
        <span>{getStatusMessage()}</span>
      </div>
      <div className="flex gap-3">{children}</div>
    </div>
  );
}
