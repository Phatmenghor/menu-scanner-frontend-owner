"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { DialogTitle } from "@radix-ui/react-dialog";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export default function ResetPasswordModal({
  userId,
  isOpen,
  userName,
  onClose,
}: {
  userId?: number;
  userName?: string;
  isOpen: boolean;
  onClose: () => void;
}) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const onReset = async () => {
    // if (!userId) return toast.error("User ID missing");
    // setIsSubmitting(true);
    // try {
    //   const ok = await AdminChangePasswordService ({
    //     id: userId,
    //     newPassword: "88889999",
    //     confirmNewPassword: "88889999",
    //   });
    //   if (ok) {
    //     setShowSuccess(true);
    //     toast.success("Password reset to default");
    //   } else {
    //     toast.error("Reset failed");
    //   }
    // } catch (error) {
    //   toast.error("Reset failed");
    // } finally {
    //   setIsSubmitting(false);
    // }
  };

  const handleClose = () => {
    setShowSuccess(false);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg w-[95vw] mx-auto rounded-2xl border-0 shadow-2xl bg-white p-0">
        <div className="p-8 space-y-4">
          {showSuccess ? (
            // Success Dialog
            <>
              <div className="flex flex-col items-center space-y-2">
                <div className="flex items-center justify-center">
                  <img
                    // src={AppIcons.Circle_alert_teal}
                    alt="back Icon"
                    className="h-10 w-10 text-muted-foreground"
                  />{" "}
                </div>
                <div className="text-center space-y-1">
                  <DialogTitle className="text-xl font-bold text-gray-900">
                    Password Reset!
                  </DialogTitle>
                  <DialogDescription className="text-gray-500 text-base">
                    User password have been reset to default password
                  </DialogDescription>
                </div>
              </div>

              <Separator className="bg-slate-400" />

              <div className="flex justify-end">
                <Button
                  type="button"
                  onClick={handleClose}
                  className="bg-teal-900 hover:bg-teal-950 text-white font-medium px-8 py-2 rounded-lg"
                >
                  Okay
                </Button>
              </div>
            </>
          ) : (
            <>
              <div className="flex flex-col items-center space-y-2">
                <div className="flex items-center justify-center">
                  <img
                    // src={AppIcons.reset}
                    alt="back Icon"
                    className="h-10 w-10 text-muted-foreground"
                  />{" "}
                </div>
                <div className="text-center space-y-1">
                  <DialogTitle className="text-xl font-bold text-gray-900">
                    Confirm Reset!
                  </DialogTitle>
                  <DialogDescription className="text-gray-500 text-base">
                    Are you sure you want to reset user password?
                  </DialogDescription>
                </div>
              </div>

              <div className="bg-amber-50 border- border-amber-200 rounded-lg p-4 space-y-4">
                <div className="flex justify-center items-center">
                  <div className="flex gap-4">
                    <DialogDescription className="text-yellow-600 text-sm">
                      <span>Password will reset for: {userName || "User"}</span>
                      <br />
                      <span>Password reset: 88889999</span>
                    </DialogDescription>
                  </div>
                </div>
              </div>

              <Separator className="bg-slate-200" />

              {/* Action buttons */}
              <DialogFooter className="flex flex-row justify-end items-center gap-3 flex-wrap">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onClose}
                  disabled={isSubmitting}
                  className="min-w-[100px]"
                >
                  Discard
                </Button>
                <Button
                  type="button"
                  variant="default"
                  onClick={onReset}
                  disabled={isSubmitting}
                  className="bg-yellow-500 hover:bg-yellow-600 text-white font-medium min-w-[100px]"
                >
                  {isSubmitting ? "Resetting..." : "Reset"}
                </Button>
              </DialogFooter>
            </>
          )}
          {/* Header with icon */}
        </div>
      </DialogContent>
    </Dialog>
  );
}
