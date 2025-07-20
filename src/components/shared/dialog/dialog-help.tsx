import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Info } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { AppIcons } from "@/constants/icons/icon";

interface HelpDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  subDescription?: string;
  onConfirm: () => void;
  confirmText?: string;
  cancelText?: string;
}

export function HelpDialog({
  open,
  onOpenChange,
  title,
  description,
  onConfirm,
  subDescription,
  confirmText = "Confirm",
}: HelpDialogProps) {
  return (
    <Dialog open={open}>
      <DialogContent className="md:max-w-xl max-w-sm mx-auto p-4 text-center">
        <div className="flex flex-col items-center space-y-6">
          {/* Info Icon */}
          <div className="flex items-center justify-center">
            <img
              src={AppIcons.Circle_alert}
              alt="back Icon"
              className="h-10 w-10 text-muted-foreground"
            />{" "}
          </div>

          {/* Title and Description */}
          <div>
            <div className="space-y-1">
              <DialogTitle className="text-xl font-medium text-gray-900">
                {title}
              </DialogTitle>
              <div className="bg-amber-50 border- border-amber-200 rounded-lg p-4 space-y-4">
                <div className="flex justify-between items-center">
                  <div className="flex gap-4">
                    <div className="flex border-l-4 border-amber-500 rounded-xl" />
                    <DialogDescription className="text-black text-sm">
                      {description}
                    </DialogDescription>
                  </div>
                </div>
              </div>
            </div>

            {subDescription && (
              <h3 className="mt-2 text-black">{subDescription}</h3>
            )}
          </div>

          <Separator className="bg-gray-300" />
          {/* Buttons */}
        </div>
        <div className="flex space-x-3 items-end justify-end">
          <Button
            onClick={() => {
              onConfirm();
              onOpenChange(false);
            }}
            className="px-8 py-2.5 bg-yellow-600 hover:bg-yellow-700 text-white"
          >
            {confirmText}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
