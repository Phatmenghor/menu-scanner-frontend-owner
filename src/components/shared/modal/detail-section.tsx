import { ReactNode } from "react";
import { Label } from "@/components/ui/label";

interface DetailSectionProps {
  title: string;
  children: ReactNode;
}

export function DetailSection({ title, children }: DetailSectionProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-1 h-6 bg-primary rounded-full"></div>
        <h3 className="text-base font-semibold">{title}</h3>
      </div>
      <div className="grid gap-3">{children}</div>
    </div>
  );
}

interface DetailRowProps {
  label: string;
  value: ReactNode;
  isLast?: boolean;
}

export function DetailRow({ label, value, isLast = false }: DetailRowProps) {
  return (
    <div
      className={`flex items-start justify-between py-2 ${
        !isLast ? "border-b border-border/40" : ""
      }`}
    >
      <Label className="text-sm font-medium text-muted-foreground">
        {label}
      </Label>
      <div className="text-sm text-right">{value}</div>
    </div>
  );
}
