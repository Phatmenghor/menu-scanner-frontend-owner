"use client";

import React from "react";
import {
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { CustomAvatar } from "@/components/shared/common/custom-avator";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface FormHeaderProps {
  title: string;
  description?: string;
  avatarName?: string;
  avatarImageUrl?: string;
  showAvatar?: boolean;
  icon?: LucideIcon;
  iconClassName?: string;
  className?: string;
}

export function FormHeader({
  title,
  description,
  avatarName,
  avatarImageUrl,
  showAvatar = true,
  icon: Icon,
  iconClassName,
  className,
}: FormHeaderProps) {
  return (
    <DialogHeader
      className={cn("px-6 pt-6 pb-4 border-b flex-shrink-0", className)}
    >
      <div className="flex items-start gap-4">
        {/* Avatar - Optional */}
        {showAvatar && (
          <CustomAvatar size="xl" name={avatarName} imageUrl={avatarImageUrl} />
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

        {/* Icon - Optional */}
        {Icon && (
          <div
            className={cn(
              "p-2 bg-primary/10 rounded-lg shrink-0",
              iconClassName
            )}
          >
            <Icon className="h-5 w-5 text-primary" />
          </div>
        )}
      </div>
    </DialogHeader>
  );
}
