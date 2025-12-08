"use client";

import React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

interface FormBodyProps {
  children: React.ReactNode;
  className?: string;
  contentClassName?: string;
}

export function FormBody({
  children,
  className,
  contentClassName,
}: FormBodyProps) {
  return (
    <ScrollArea className={cn("flex-1 overflow-y-auto", className)}>
      <div className={cn("px-6 py-4 space-y-6", contentClassName)}>
        {children}
      </div>
    </ScrollArea>
  );
}
