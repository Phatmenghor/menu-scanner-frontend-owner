"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  AlertTriangle,
  CheckCircle2,
  RotateCcw,
  User,
  Key,
  Shield,
  Copy,
  Eye,
  EyeOff,
} from "lucide-react";
import { toast } from "sonner";
import { AdminChangePasswordService } from "@/services/dashboard/user/plateform-user/plateform-user.service";
import { AppDefault } from "@/constants/AppResource/default/default";

export default function ResetPasswordModal({
  userId,
  isOpen,
  userName,
  onClose,
}: {
  userId?: string;
  userName?: string;
  isOpen: boolean;
  onClose: () => void;
}) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const defaultPassword = AppDefault.RESET_PASSWORD;

  const onReset = async () => {
    if (!userId) {
      toast.error("User ID missing");
      return;
    }
    setIsSubmitting(true);
    try {
      await AdminChangePasswordService({
        userId: userId,
        newPassword: defaultPassword,
        confirmPassword: defaultPassword,
      });
      setShowSuccess(true);
      toast.success("Password reset successfully");
    } catch (error) {
      console.error("Password reset failed:", error);
      toast.error("Reset failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setShowSuccess(false);
    setShowPassword(false);
    onClose();
  };

  const copyPassword = async () => {
    try {
      await navigator.clipboard.writeText(defaultPassword);
      toast.success("Password copied to clipboard");
    } catch (error) {
      console.error("Failed to copy password:", error);
      toast.error("Failed to copy password");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md min-h-screen">
        {showSuccess ? (
          // Success State
          <div className="text-center space-y-6">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle2 className="w-8 h-8 text-green-600" />
            </div>

            <div className="space-y-2">
              <DialogTitle className="text-xl font-semibold text-gray-900">
                Password Reset Complete!
              </DialogTitle>
              <DialogDescription className="text-gray-600">
                The user's password has been successfully reset to the default
                password.
              </DialogDescription>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <Shield className="w-5 h-5 text-green-600 mt-0.5" />
                <div className="text-left">
                  <p className="text-sm font-medium text-green-800">
                    Security Notice
                  </p>
                  <p className="text-sm text-green-700">
                    User should change password on next login
                  </p>
                </div>
              </div>
            </div>

            <Button onClick={handleClose} className="w-full">
              Got it
            </Button>
          </div>
        ) : (
          // Confirmation State
          <>
            <DialogHeader className="text-center space-y-4">
              <div className="mx-auto w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center">
                <AlertTriangle className="w-8 h-8 text-yellow-600" />
              </div>
              <div>
                <DialogTitle className="text-xl font-semibold text-gray-900">
                  Reset Password?
                </DialogTitle>
                <DialogDescription className="text-gray-600 mt-2">
                  This will reset the user's password to the default value.
                  They'll need to change it on their next login.
                </DialogDescription>
              </div>
            </DialogHeader>

            <div className="space-y-6">
              {/* User Info */}
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-700">
                      Target User
                    </Label>
                    <p className="text-sm text-gray-900 font-medium">
                      {userName || "Unknown User"}
                    </p>
                  </div>
                </div>

                <Separator />

                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                      <Key className="w-5 h-5 text-yellow-600" />
                    </div>
                    <Label className="text-sm font-medium text-gray-700">
                      New Password
                    </Label>
                  </div>

                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      value={defaultPassword}
                      readOnly
                      className="pr-20 font-mono bg-gray-50"
                    />
                    <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowPassword(!showPassword)}
                        className="h-8 w-8 p-0 hover:bg-gray-200"
                      >
                        {showPassword ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={copyPassword}
                        className="h-8 w-8 p-0 hover:bg-gray-200"
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Warning */}
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-yellow-800">
                      This action cannot be undone
                    </p>
                    <p className="text-sm text-yellow-700 mt-1">
                      The user will be logged out of all devices and must use
                      the new password to sign in.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <DialogFooter className="flex gap-3 sm:gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={isSubmitting}
                className="flex-1 bg-transparent"
              >
                Cancel
              </Button>
              <Button
                type="button"
                onClick={onReset}
                disabled={isSubmitting}
                variant="destructive"
                className="flex-1"
              >
                {isSubmitting ? (
                  <div className="flex items-center gap-2">
                    <RotateCcw className="w-4 h-4 animate-spin" />
                    Resetting...
                  </div>
                ) : (
                  "Reset Password"
                )}
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
