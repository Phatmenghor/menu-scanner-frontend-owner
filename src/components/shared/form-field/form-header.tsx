"use client";

import React from "react";
import {
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { CustomAvatar } from "@/components/shared/avator/custom-avator";
import { Plus, Edit } from "lucide-react";
import { cn } from "@/lib/utils";

interface FormHeaderProps {
  title: string;
  description?: string;
  avatarName?: string;
  avatarImageUrl?: string;
  showAvatar?: boolean;
  isCreate?: boolean;
  className?: string;
}

export function FormHeader({
  title,
  description,
  avatarName,
  avatarImageUrl,
  showAvatar = true,
  isCreate = true,
  className,
}: FormHeaderProps) {
  // Determine icon based on mode
  const Icon = isCreate ? Plus : Edit;

  return (
    <DialogHeader
      className={cn("px-6 pt-6 pb-4 border-b flex-shrink-0", className)}
    >
      <div className="flex items-start gap-4">
        {/* Avatar or Icon - Left side */}
        {showAvatar ? (
          <CustomAvatar size="xl" name={avatarName} imageUrl={avatarImageUrl} />
        ) : (
          <div className="p-3 bg-brand-100 rounded-lg shrink-0">
            <Icon className="h-6 w-6 text-brand-600" />
          </div>
        )}

        {/* Header Content */}
        <div className="flex flex-col gap-1.5 flex-1 min-w-0">
          <DialogTitle className="text-xl font-semibold">{title}</DialogTitle>
          {description && (
            <DialogDescription className="text-sm">
              {description}
            </DialogDescription>
          )}
        </div>
      </div>
    </DialogHeader>
  );
}
